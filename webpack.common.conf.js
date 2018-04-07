'use strict';
const path = require('path');
const assetsPath = require('./utils').assetsPath;
const vueLoaderConfig = require('./vue-loader.conf');
const resolve = dir => {
  return path.join(__dirname, '..', dir);
};

module.exports = {
  /**
   * 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和加载器(loader)
   * 默认使用当前目录
   */
  context: path.resolve(__dirname, '../'),
  /**
   * 入口文件
   * 如果有多个入口清用数组配置
   * 如果要支持IE要引入babel-polyfill
   */
  entry: {
    /* index: './src/main.js', */
    index: ['babel-polyfill', './src/main.js']
  },
  /**
   * 出口文件
   */
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? '/Dev/EPF/Web/' : '/'
  },
  /**
   * 解析
   * extensions 自动解析的扩展，导入Vue, js ,json 文件不用写扩展名，如果需要导入其他文件，请假一个 '*'
   * alias 别名 通常是一个文件夹路径，方便导入文件
   */
  resolve: {
    extensions: ['.js', '.vue', '.json', '*'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '~': resolve('src'),
      '@': resolve('src/components/common')
    }
  },
  /**
   *模块和规则
   */
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
};
