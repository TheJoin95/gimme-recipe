const webpackPlugins = []
const path = require('path')
const webpack = require('webpack')
const pages = require('./src/pages.json')

if (process.env.NODE_ENV === 'development') {
  webpackPlugins.push(new webpack.HotModuleReplacementPlugin())
  webpackPlugins.push(new webpack.NamedModulesPlugin())
}

module.exports = {
  publicPath: '/',
  assetsDir: 'assets',
  runtimeCompiler: true,

  css: {
    modules: true
  },

  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {},

    prerenderSpa: {
      headless: true,
      registry: undefined,
      onlyProduction: true,
      useRenderEvent: false,
      renderRoutes: Array.from(pages, page => page.path)
    }
  },

  configureWebpack: {
    plugins: webpackPlugins,

    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],

      alias: {
        modernizr$: path.resolve(__dirname, '.modernizrrc'),
        '~': path.resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        '@three': 'three/src'
      }
    }
  },

  chainWebpack: config => {
    config.plugins.delete('fork-ts-checker')

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          preserveWhitespace: true
        }
      }))

    config.module
      .rule('modernizr')
      .test(/\.modernizrrc$/)
      .use('webpack-modernizr-loader')
      .loader('webpack-modernizr-loader')
  }
}
