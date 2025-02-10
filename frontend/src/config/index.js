export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://172.16.3.2:8080/',
    dev1: ['http://172.16.3.4:8080', 'localhost:4999', ''], // ''为测试需要跨域的接口
    pro1: ['http://172.16.3.4:8080', 'localhost:4999', ''], // ''为线上需要跨域的接口
    // dev: 'http://172.18.1.23:8080',
    // pro: 'http://172.18.1.22:3000/mock/17'
    // pro1: ['http://172.18.1.23:8080', 'http://172.18.1.21:8080']
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
