<template>
  <Layout style="height: 100%" class="index">
    <Layout>
      <div class="top-nav" :style="{position:topnavName=='index'&&!userName?'absolute':'relative',
        backgroundColor:topnavName=='index'&&backup<770&&!userName?'transparent':'#000'}">
        <div class="logoBox" @click="goback">
          <img :src="iconLogo" alt="" srcset="" class="iconLogo">
          <h2>中国地震局工程力学研究所</h2>
        </div>
        <div class="menuBox">
          <Menu mode="horizontal" :theme="theme" :active-name="topnavName" @on-select="turnToPage"  ref="menu">
            <Menu-item v-for="(item,index) in topList" :key="index" :name="item.name">
                {{item.meta.title}}
            </Menu-item>
          </Menu>
        </div>
        <div class="topuserset">

          <div class="ceiling" v-if="userName">
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
          <div class="ceiling" v-else>
            <div class="login" @click="toLogin">您好，请登录</div>
            <div class="registe" @click="toRegister">免费注册</div>
          </div>
        </div>
      </div>
      <Content class="main-content-con" id="main-content-con">
        <div class="breadcrumd" v-if="topnavName!='index'">
          <Breadcrumb>
            <BreadcrumbItem v-for="item in breadcrumdList" :key="item.name" :to="item">
              <span :style="{color:item.name==$route.name?'#fff':''}">
                <Icon type="ios-home" size="16" v-if="item.name=='index'" style="vertical-align: middle;"></Icon>{{item.meta.title}}
              </span>
            </BreadcrumbItem>
          </Breadcrumb>
          <!-- <Button size="small" @click="handleFullscreen"
            :icon="isFullscreen ? 'md-contract' : 'md-expand'">
            {{isFullscreen ? '退出全屏' : '全屏'}}
          </Button> -->

        </div>
        <div class="backup" v-if="backup>100">
          <Tooltip placement="top">
            <Button icon="ios-arrow-up" @click="gotoBackup" style="width:50px"></Button>
            <div slot="content">
              <p>返回顶部</p>
            </div>
          </Tooltip>
        </div>
        <Layout class="main-layout-con">
          <Content class="content-wrap">
            <keep-alive :include="cacheList">
              <router-view @reviseTopnav='reviseTopnav' :key="key" :backup="backup"
                :searchVal2="searchVal2">
              </router-view>
            </keep-alive>
            <!-- <foot-terss>
            </foot-terss> -->
          </Content>
        </Layout>

      </Content>

    </Layout>
  </Layout>
</template>
<script>
import HeaderBar from './components/header-content'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import FootTerss from './components/footterss'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import iconLogo from '@/assets/images/logo.png'

import './index.less'
export default {
  name: 'Index',
  components: {
    HeaderBar,
    Language,
    Fullscreen,
    ErrorStore,
    ABackTop,
    FootTerss,
  },
  //  beforeUpdate() {
  //  },
  beforeMount () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      //  collapsed: false,
      isFullscreen: false,
      topnavName: 'index',
      theme: 'dark',
      backup: 0,
      searchVal2: '',
      iconLogo,
      userName: '', // 用户名
      userId: '', // 用户Id
      userIdentity: '', // 用户类型
      breadcrumdList: [], // 面包屑导航
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    topList () {
      this.breadcrumdList[0] = this.$store.getters.topList[0]
      return this.$store.getters.topList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }

  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    searchClick (val) {
      this.searchVal2 = val
    },
    // 导航选择
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (!this.userName && name != 'index') {
        this.$nextTick(() => {
          this.topnavName = 'index'
          this.$refs.menu.updateActiveName()
        })
        this.$Message.error('暂无权限，请先登录！')
        return
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    // 修改导航栏状态
    reviseTopnav (name) {
      this.topnavName = name
      this.$refs.aback.back()
    },
    // 用户信息页
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
    // 去登录页
    toLogin () {
      this.$router.push({
        name: 'login'
      })
    },
    // 去注册页
    toRegister () {
      const news = this.$router.resolve('/user_res')
      window.open(news.href, '_blank')
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
            if (this.$route.name == 'index') {
              location.reload()
            } else {
              this.$router.push({
                name: 'index'
              })
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    handleScroll () {
      this.backup = document.querySelector('#main-content-con').scrollTop
    },
    // 点击图标返回首页
    goback () {
      var test = this.$route.path
      if (test == '/') {
        location.reload()
      } else {
        this.$router.push('/')
      }
    },
    // 全屏 退出全屏
    handleFullscreen () {
      let main = document.getElementById('main-content-con')
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
      }
      this.isFullscreen = !this.isFullscreen
    },
    // 返回顶部
    gotoBackup () {
      document.getElementById('main-content-con').scrollTo({
        'top': 0,
        'behavior': 'smooth'
      })
    },
  },
  watch: {
    $route (cur, old) {
      let arr = this.topList.filter(item => item.name == cur.name)
      if (arr.length>0) {
        this.topnavName = cur.name
      } else {
        let arr = this.breadcrumdList.filter(item => item.name == cur.name)
        if (arr.length == 0) {
          let obj = {
            name: cur.name,
            meta: cur.meta,
            children: [],
            icon: ''
          }
          this.breadcrumdList.push(obj)
        }
      }
    },
    topnavName (cur, old) {
      if (this.$route.name != 'index') {
        let obj = {
          name: this.$route.name,
          meta: this.$route.meta,
          children: [],
          icon: ''
        }
        this.breadcrumdList[1] = obj
      } else {
        this.breadcrumdList = this.breadcrumdList.filter(item => item.name == 'index')
      }
    }
  },
  mounted () {
    let that = this
    document.getElementById('main-content-con').addEventListener('scroll', that.handleScroll)

    const { name, params, query, meta } = that.$route
    that.topnavName = that.$route.name
    // 如果当前打开页面不在标签栏中，跳到主页
    if (!that.topList.find(item => item.name === that.$route.name)) {
      that.$router.push({
        name: 'index'
      })
    }
    that.userName = that.$store.state.user.userName
    that.userIdentity = that.$store.state.user.access
  }
}
</script>
