const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// ceakj-emergency-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  publicPath: '/',
  // publicPath: BASE_URL,
  baseUrl: '',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    config.module
      .rule('css')
      .test(/\.css$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('px2rem')
      .loader('px2rem-loader')
      .options({
        remUnit: 192 // 设计稿大小比例 / 10
      })
  },
  configureWebpack: {
    module: {
      rules: [
        {
          include: /node_modules/,
          test: /\.mjs$/,
          type: 'javascript/auto'
        }
      ]
    },
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip', // 使用gzip压缩
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
        minRatio: 1, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      })
    ]
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // proxy: 'http://172.18.1.23:8080'
    proxy: {
      // '/ceakj': {
      //   target: 'http://172.18.1.23:8080',
      //   changeOrigin: true,
      //   ws: true,
      //   secure: false
      // },
      // '/user/emergency': {
      //   target: 'http://172.18.1.23:8080',
      //   changeOrigin: true,
      //   ws: true,
      //   secure: false
      // },
      'E:/IEM/shm': {
        target: 'http://10.17.55.181:4999',
        changeOrigin: true,
        ws: true,
        secure: false
      },
    }

  }
}
