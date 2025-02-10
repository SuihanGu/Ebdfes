<template>
  <div class="headerbar">
    <div class="topuserset" v-show="backup<400">
      <div class="ceiling" v-if="userName">
        <Dropdown @on-click="toUserInfoMotify">
          <a href="javascript:void(0)">
              {{userName}},欢迎您！<Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
              <DropdownItem name="1">个人中心</DropdownItem>
              <DropdownItem name="3" v-if="userIdentity=='1'">后台管理</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div @click="supexit" style="color:red;margin-left:10px">退出</div>
      </div>
      <div class="ceiling" v-else>
        <div class="login" @click="toLogin">您好，请登录</div>
        <div class="registe" @click="toRegister">免费注册</div>
      </div>
    </div>
    <div class="top-header">
      <div class="top-bar" @click="goback">
        <img :src="iconLogo" alt="" srcset="" class="iconLogo">
        <!-- <div>中国地震局工程力学研究所</div> -->
      </div>
      <div class="top-input">
        <template>
          <Input v-model="searchVal"
            search enter-button
            @on-search="searchInfo(searchVal)"
            placeholder="查询" style="width: 400px;" size="large">
          </Input>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import iconLogo from '@/assets/images/logo.png'
import { setCookie,delCookie } from '@/libs/util'
import { mapActions } from 'vuex'

import './header-bar.less'
export default {
  name: 'HeaderBar',
  data () {
    return {
      iconLogo,
      searchVal:"",
      theme:"light",
      userName:"",//用户名
      userId:'',//用户Id
      userIdentity:"",//用户类型
      pwd:"",
    }
  },
  components: {
  },
  props: ['topnavName','backup'],
  watch: {
  },
  mounted() {
    this.userName = this.$store.state.user.userName
    this.userIdentity = this.$store.state.user.access
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'handleLogOut'
    ]),
    // 去登录页
    toLogin(){
      const news = this.$router.resolve('/login')
      window.open(news.href,'_blank')
    },
    // 去注册页
    toRegister(){
      const news = this.$router.resolve('/user_res')
      window.open(news.href,'_blank')
    },
    // 点击图标返回首页
    goback(){
      var test = this.$route.path;
      if(test=="/"){
        location.reload();
      }else{
        this.$router.push('/')
      }
    },
    // 供应商退出
    supexit(){
      this.$Modal.confirm({
        title: '退出登录',
        content: '<p>请确认是否退出登录</p>',
        onOk: () => {
          this.handleLogOut().then(() => {
            location.reload();
          })
        },
        onCancel: () => {
        }
      });
    },
    // 搜索
    searchInfo(val){
      
    },
    // 生成随机数
    JsNewGuid() {
      var curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)){
          curguid += "-";
        }
      }
      return curguid
    },
    // 用户信息页
    toUserInfoMotify(name){
      switch(name){
        case '1':
          this.$router.push('/user_index?userId='+this.userId)
          break;
        case '3':
          const news = this.$router.resolve('/home')
          window.open(news.href,'_blank')
          break;
      }
    },
  }
}
</script>
