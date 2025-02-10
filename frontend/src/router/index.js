import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.meta.MenuType === 'shop') {
    // 未登录且要跳转的页面是门户主页面
    next()
  } else if (!token && to.meta.MenuType === 'home') {
    // 未登陆且要跳转的页面是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    }) // 跳转
  }else {
    if (store.state.user.hasGetInfo) {
      if(to.meta.MenuType === 'home'&&store.state.user.access=='1'){
        turnTo(to, store.state.user.access, next)
      }else{
        next()
      }
    } else {
      // turnTo(to, "1", next)
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        if(to.meta.MenuType === 'home'){
          if(user.access=='1'){
            turnTo(to, user.access, next)
          }else{
            next({
              name: "index"
            })
          }
        }else{
          next()
        }
      }).catch(() => {
        setToken('')
        // 接口报错页面返回门户主页
        next()
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
