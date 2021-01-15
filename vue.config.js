let path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('@/assets'))
  },
  configureWebpack: {
    devServer: {
      proxy: {
        '/proxy': {
          target: 'http://localhost:8080/',
          changeOrigin: true, //改变源
          ws: true, //跨域
          pathRewrite: {
            '^/proxy': ''
          }
        }
      }
    }
  }
}