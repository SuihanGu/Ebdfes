<style lang="less">
  @import "./user.less";
</style>
<template>
  <div id="userManage">
     <Card dis-hover>
        <template #title>
            <div class="titleBox">
                <div>
                    <Input placeholder="用户名" style="width:150px;"/>
                    &nbsp;
                    <Button type="primary">查询</Button>
                </div>
                <div>
                    <Button type="primary" @click="addUser">新增</Button>
                </div>
            </div>
        </template>
        <Table border :columns="columns" :data="data" :height="heightNum-30">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="editeUser(row)">修改</Button>
                &nbsp;
                <Button type="error" size="small" @click="delUser" v-if="row.roleId!='system'">删除</Button>
            </template>
        </Table>
        <Page :total="total"
            show-total
            :current="page"
            show-sizer
            show-elevator
            :page-size="pageSize"
            :page-size-opts="opts"
            v-on:on-change="changePage"
            v-on:on-page-size-change="changePageSize"
        />
        <Modal
            v-model="userModal"
            title="用户信息编辑"
            @on-ok="submitData"
            @on-cancel="userModal=false">

        </Modal>
    </Card>
  </div>
</template>

<script>
import userForm from './components/user-form.vue'
import $ from 'jquery'
export default {
  name: 'userManage',
  components: {
    userForm
  },
  data () {
    return {
      columns: [
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '角色',
          key: 'role'
        },
        {
          title: '公司/单位',
          key: 'companeyName'
        },
        {
          title: '国家',
          key: 'country'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data: [
        {
          id: '1',
          userName: '甲',
          role: '政府',
          roleId: '',
          companeyName: '测试测试',
          country: '中国',
          date: '2016-10-03'
        },
        {
          id: '2',
          userName: '乙',
          role: '保险公司',
          roleId: '',
          companeyName: '测试测试',
          country: '日本',
          date: '2016-10-01'
        },
        {
          id: '3',
          userName: '管理员',
          role: '普通管理员',
          roleId: '1',
          companeyName: '测试测试',
          country: '中国',
          date: '2016-10-02'
        },
        {
          id: '4',
          userName: '超级管理员',
          role: '超级管理员',
          roleId: 'system',
          companeyName: '测试测试',
          country: '中国',
          date: '2016-10-04'
        }
      ],
      screenWidth: 0,
      heightNum: 0,
      total: 0, // 数据总长度
      page: 1, // 当前页码
      pageSize: 50, // 一页显示数量
      opts: [50, 100, 150, 200, 250, 300], // 每页切换数量
      editeForm: {}, // 编辑的表单
      userModal: false
    }
  },
  watch: {
    screenWidth (val, oldVal) {
      this.heightNum = $(window).height() - 170
      // immediate: true
    }
  },
  created () {
    let that = this
    that.screenWidth = $(window).height()
    window.onresize = () => { // 屏幕尺寸变化就重新赋值
      return (() => {
        this.screenWidth = $(window).height()
      })()
    }
  },
  methods: {
    // 新增用户
    addUser () {
      this.editeForm = {
        id: '',
        userName: '',
        role: '',
        roleId: '',
        companeyName: '',
        country: '',
        date: ''
      }
      this.userModal = true
    },
    editeUser (form) {
      this.editeForm = JSON.parse(JSON.stringify(form))
    },
    // 切换分页
    changePage (pageNum) {

    },
    // 切换分页数据数量
    changePageSize (pageSize) {

    }
  },
  beforeDestroy () {

  }
}
</script>
