// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
// import gcoord from 'gcoord'
import 'v-org-tree/dist/v-org-tree.css'
import 'lib-flexible/flexible.js'
// 引包方式一
import TimelineSliderVue from 'timeline-slider-vue'
import 'timeline-slider-vue/lib/timeline-slider-vue.css'
import VueContextMenu from 'vue-contextmenu'
import animated from 'animate.css' // npm install animate.css --save安装，在引入
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css' // 引入它的 css
import VueVirtualScroller from 'vue-virtual-scroller' // 引入它
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)

Vue.use(VueVirtualScroller) // use 它

Vue.use(animated)
Vue.use(VueContextMenu)
Vue.use(TimelineSliderVue)
//

/* eslint-disable */

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
// Vue.use(gcoord)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
