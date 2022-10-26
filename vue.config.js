const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const publicPathObj = {
  'development': '/web-main/',
  'uat': '/web-main/',
  'test': '/web-main/',
  'production': '//cdnrs.longsailing.net/web-main/'
}
module.exports = defineConfig({
  publicPath: publicPathObj[process.env.NODE_ENV] || '/web-main/',
  lintOnSave: false,
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/wms': {
        target: 'http://wmstest.com',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/': {
        target: 'http://lstest.com',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    performance: {
      hints: false
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: false
            }
          },
          parallel: true // 多进程打包
        })
      ]
    }
  },
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].title = '长帆国际物流'
      return args
    })
    config.plugin('define').tap((args) => {
      args[0]['process'] = { ...args[0]['process.env'] }
      return args
    })
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons')) //注意svg的存储地址
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons')) //注意svg的存储地址
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 压缩代码
    config.optimization.minimize(true)
  }
})
