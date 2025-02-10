<template>
    <div class="header">
        <Tooltip content="返回主页">
            <div class="logo" @click="gobalck">
                <img :src="iconLogo" alt="" srcset="">
                智慧健康监测云
            </div>
        </Tooltip>
        <div class="order">
            <div v-for="(item,i) in orderList" :key="i+'or'">
                <div @click="gotoSmart(item,i)" v-if="!item.children"
                    class="orderItem"
                    :class="activeTab==i?'actorderItem':''">
                    <img :src="item.icon" alt="" />
                    <p>{{ item.label }}</p>
                </div>
                <Poptip trigger="hover" v-else class="orderItem"
                    :class="activeTab==i?'actorderItem':''">
                    <div>
                        <img :src="item.icon" alt="" />
                        <p>{{ item.label }}</p>
                    </div>
                    <!-- color: #4E90CB;
                            background-color:#fff; -->
                    <template #content>
                        <p class="itemBox"
                            v-for="(op,n) in item.children" :key="n+'it'"
                            @click="gotoSmart(op,i)">{{ op.label }}</p>
                    </template>
                </Poptip>
            </div>
        </div>
        <div class="acctount">
            <Badge dot style="margin-right: 10px;">
                <Icon type="ios-notifications-outline" size="23"></Icon>
            </Badge>
            <Dropdown @on-click="toUserInfoMotify">
                <a href="javascript:void(0)" style="color: #fff;">
                    {{userName}}<Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="1">个人中心</DropdownItem>
                    <DropdownItem name="3" v-if="userIdentity=='1'">后台管理</DropdownItem>
                    <DropdownItem name="4">退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
  </template>

<script>
import iconLogo from '@/assets/images/logo.png'
import { mapActions } from 'vuex'

export default {
  name: 'smartHealth',
  components: {
  },
  props: ['activeTab', 'devicesList'],
  data () {
    return {
      iconLogo,
      userName: '', // 用户名
      userId: '', // 用户Id
      userIdentity: '', // 用户类型
      visible: false,
      orderList: [
        {
          icon: require('@/assets/images/shicon/home.png'),
          label: '首页',
          path: 'smartHealthHome'
        }, {
          icon: require('@/assets/images/shicon/system.png'),
          label: '项目管理',
          path: 'smartHealthSystem'
        },
        // {
        //     icon:require('@/assets/images/shicon/grahics.png'),
        //     label:'数据图形',
        //     path:'smartHealthGrahics',
        // },
        {
          icon: require('@/assets/images/shicon/analysis.png'),
          label: '数据分析',
          path: 'smartHealthAnalysis'
        }, {
          icon: require('@/assets/images/shicon/warn.png'),
          label: '智能预警',
          path: 'smartHealthWarn'
        }, {
          icon: require('@/assets/images/shicon/device.png'),
          label: '设备管理',
          path: 'smartHealthDevice2'
        },{
          icon: require('@/assets/images/shicon/patrol.png'),
          label: '巡视检查',
          path: 'smartHealthPatrol'
        }, {
          icon: require('@/assets/images/shicon/report.png'),
          label: '日报管理',
          path: 'smartHealthReport'
        }
      ]
    }
  },
  watch: {

  },
  created () {

  },
  mounted () {
    this.userName = this.$store.state.user.userName
    this.userIdentity = this.$store.state.user.access
  },
  methods: {
    // 返回首页
    gobalck () {
      this.$router.push('/')
    },
    ...mapActions([
      'handleLogOut'
    ]),
    gotoSmart (row, i) {
      // this.activeTab=i
      this.$router.push({
        name: row.path
      })
    },
    toUserInfoMotify (name) {
      switch (name) {
        case '1':
          this.$router.push('/user_index?userId=' + this.userId)
          break
        case '3':
          const news = this.$router.resolve('/home')
          window.open(news.href, '_blank')
          break
        case '4':
          if(localStorage.getItem("eventList")){
            localStorage.removeItem("eventList")
          }
          this.supexit()
          break
      }
    },
    // 用户退出
    supexit () {
      this.$Modal.confirm({
        title: '退出登录',
        content: '<p>请确认是否退出登录</p>',
        onOk: () => {
          this.handleLogOut().then(() => {
            this.userName = this.$store.state.user.userName
            this.userIdentity = this.$store.state.user.access
            this.$router.push({
              name: 'index'
            })
          })
        },
        onCancel: () => {
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
