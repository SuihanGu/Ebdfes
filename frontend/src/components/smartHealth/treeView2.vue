<template>
    <div class="treeBox">
        <Tree
          ref="tree"
          :data="treeList"
          @on-select-change="selectItem"
          :render="renderContent">
        </Tree>
    </div>
</template>
<script>
import {
  catlog
} from '@/api/smartHealth'
export default {
  name: 'smartHealth',
  components: {
  },
  data () {
    return {
      treeList: [],
      selectTree: null
    }
  },
  watch: {
  },
  created () {
    this.getTreeData()
  },
  mounted () {
  },
  methods: {
    // 构造树结构点
    renderContent (h, { root, node, data }) {
      let that = this
      let hBox = null
      if (data.operatetype == 'layer1') {
        hBox = h('Icon', {
          props: {
            type: 'md-git-network'
          },
          style: {
            marginRight: '8px'
          }
        })
      } else if (data.operatetype == 'layer2') {
        hBox = h('Icon', {
          props: {
            type: 'ios-hammer'
          },
          style: {
            marginRight: '8px'
          }
        })
      } else if (data.operatetype == 'layer3') {
        hBox = h('Icon', {
          props: {
            type: 'ios-options'
          },
          style: {
            marginRight: '8px'
          }
        })
      } else {
        hBox = h('Icon', {
          props: {
            type: 'ios-photos-outline'
          },
          style: {
            marginRight: '8px'
          }
        })
      }
      let className = that.selectTree != null && that.selectTree.id == data.id ? 'ivu-tree-title-selected' : ''
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          padding: '0 4px',
          borderRadius: '3px'
        },
        class: className
      }, [
        h('div', [
          h('div', [
            hBox,
            h('span', {
              style: {
                display: 'inline-block'
              },
              on: {
                click: () => {
                  // this.TreeChange(root, node, data)
                }
              }
            },
            data.name)
          ])
        ])
      ])
    },
    // 获取树结构数据
    getTreeData () {
      let that = this
      catlog({ parentid: '' }).then(res => {
        let rs = res.data
        if (rs.code == 0) {
          let data = rs.data
          for (let i in data) {
            let info = that.loadData2(data[i])
            info.then(ress => {
              data[i].children = ress
            })
            data[i].loading = false
          }
          that.treeList = data
          that.selectTree = data[0]
          setTimeout(() => {
            that.$emit('getcurDate', data[0])
          }, 100)
        } else {
          that.$Message.error(rs.msg)
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
      })
    },
    // 同步获取第二节点
    async loadData2 (item) {
      let that = this
      let data = []
      await catlog({ parentid: item.id }).then(res => {
        let rs = res.data
        if (rs.code == 0) {
          data = rs.data
        } else {
          that.$Message.error(rs.msg)
        }
      }).catch(err => {
        console.log(err) // that.$Message.error('系统错误')
      })
      return data
    },
    // 点击树节点
    selectItem (list, row) {
      // if(row.type=="parent"||row.type=="velocity"){
      this.selectTree = row
      this.$emit('selectItem', row)
      // }
    }
  }
}
</script>

<style>
  .ivu-tree-title{
    padding: 0;
  }
  .ivu-tree-arrow-disabled{
    cursor: auto;
  }
</style>
