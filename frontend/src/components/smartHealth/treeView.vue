<template>
  <div class="treeBox">
      <Tree
        ref="tree"
        :data="treeList"
        :show-checkbox="this.$route.name!=='smartHealthHome'"
        @on-select-change="selectItem"
        @on-check-change="checkItem"
        :render="renderContent">
      </Tree>
  </div>
</template>

<script>
import {
  category
} from '@/api/smartHealth'
export default {
  name: 'smartHealth',
  components: {
  },
  props: ['devicesList', 'taborpic'],
  data () {
    return {
      treeList: [],
      selectTree: null
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.getTreeData()
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
        h('div', {
          style: {
            color: '#fff'
          }
        }, [
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
    // 父组件更新树结构
    getParentTree (data, list) {
      this.selectTree = data
      this.treeList = list
      setTimeout(() => {
        this.$emit('initeGridData', 1)
        this.$forceUpdate()
      }, 100)
    },
    // 获取树结构数据
    getTreeData () {
      let that = this
      category({ parentid: '' }).then(res => {
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
          setTimeout(() => {
            if (that.treeList.length == 0) {
              that.treeList = data
              that.selectTree = data[0]
              // that.$emit("getItemSelectTree",data[0]);
            }
            that.$emit('initeGridData', 0)
          }, 10)
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
      await category({ parentid: item.id }).then(res => {
        let rs = res.data
        if (rs.code == 0) {
          data = rs.data
          for (let i in data) {
            if (data[i].operatetype != 'layer4') {
              let info = that.loadData2(data[i])
              info.then(ress => {
                data[i].children = ress
              })
              data[i].loading = false
            }
          }
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
      this.$emit('selectItem', this.treeList, row)
      // }
    },
    // 复选框勾选
    checkItem (list, row) {
      let that = this
      switch (this.taborpic[0]) {
        case '04':
          if (row.operatetype == 'layer4') {
            // 相关图单选
            for (let i in list) {
              list[i].checked = false
            }
            row.checked = true
            this.$emit('getTreeInfo', list)
          } else {
            let list = that.getchecked()
            let parent = null
            parent = list.filter(x => {
              return x.operatetype == 'layer1'
            })[0]
            if (parent == undefined) {
              parent = list.filter(x => {
                return x.operatetype == 'layer1'
              })[0]
            }
            that.cancelParent(parent.id)
            that.$Message.error('相关图一次只能选择一个项添加轴')
          }
          break
        default:
          that.$emit('getTreeInfo', list)
          break
      }
      that.$forceUpdate()
    },
    // 获取已勾选的节点
    getchecked () {
      let list = this.$refs.tree.getCheckedAndIndeterminateNodes()
      return list
    },
    // 取消根节点选中状态
    cancelParent (id) {
      let that = this
      for (let i in that.treeList) {
        let oItem = that.treeList[i]
        if (oItem.id == id) {
          that.$set(oItem, 'checked', false)
          that.$set(oItem, 'indeterminate', false)
          if (oItem.children && oItem.children.length) {
            that.cancelItem(oItem.children)
          } else {
            that.$forceUpdate()
          }
        }
      }
    },
    cancelItem (data) {
      let that = this
      for (let i in data) {
        let oItem = data[i]
        that.$set(oItem, 'checked', false)
        that.$set(oItem, 'indeterminate', false)
        if (oItem.children && oItem.children.length) {
          that.cancelItem(oItem.children)
        } else {
          that.$forceUpdate()
        }
      }
    },
    update () {
      this.$set(this.treeList[0], 'checked', true)
      this.$set(this.treeList[0], 'expand', true)
      setTimeout(() => {
        this.$emit('getTreeInfo')
      }, 100)
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
