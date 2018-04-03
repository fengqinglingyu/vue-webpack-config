'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonWebpackConfig = require('./webpack.common.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const env = process.env.NODE_ENV === 'production';

const webpackConfig = merge(commonWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true
    })
  },
  /** 开发工具，如果配置源映射请把这个项目改成source-map */
  devtool: false,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    /* 生成文件之前，先清除之前生成的dist */
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist')]),
    /* 定义全局环境为生产环境 */
    new webpack.DefinePlugin({
      'process.env': env
    }),
    /* JS代码压缩 */
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false //不显示警告,默认配置就是false，可以不写
          /* 清空控制台输入，根据实际需求调用
          drop_debugger: true, // 用于清空控制台输出 
          drop_console: true //  用于清空控制台输出
          */
        },
        /**
         * 配置源映射
         * 如果为true，并且devtool的配置不是false或者cheap-source-map的实惠
         * 会生成同名的.map文件
         */
        sourceMap: false,
        parallel: true // 设置运行并发，默认数目 os.cpus().length - 1，也可设置并发的数目
      }
    }),
    /**
     *  将内嵌的在JS bundle里面的样式
     *  分离成一个单独的css文件，减少页面的<style>标签
     *  使用这个插件会强制使用devtool:source-map，当然，不会影响其他插件
     *  会延长编译的时间
     */
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      /* 当使用 CommonsChunkPlugin 
         并且在公共 chunk 中有提取的 chunk（来自ExtractTextPlugin.extract）时，
         allChunks 必须设置为 true
      */
      allChunks: true
    }),
    /**
     * 压缩提取出来的css文件
     * 并且使用这个组件可以清除来自不用组件的重复的样式
     * 一般不用额外配置，直接引用就好
     * 同样的，配置了map会生成一个同名的.map文件
     */
    new OptimizeCSSPlugin(),
    // new OptimizeCSSPlugin({
    //   cssProcessorOptions: config.build.productionSourceMap
    //     ? { safe: true, map: { inline: false } }
    //     : { safe: true }
    // })
    /**
     * 生成HTML文件，并且引用js和css
     */
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'), //生成html的文件名
      template: 'src/index.html' // 依据的模板
      /* 这部分可以使用默认配置，html就算压缩也省不了几个Byte
      inject: true, // 是否将js文件放在body里面，默认为true
      minify: {
        //压缩选项
        removeComments: true, //删除html中的注释代码
        collapseWhitespace: true, //删除html中的空白符
        removeAttributeQuotes: true ////删除html元素中属性的引号
      },
      chunksSortMode: 'dependency' //按dependency的顺序引入
      */
    }),
    /* 分离公共js到vendor中 */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // 匹配所有再node_modules里面用到的模块
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        );
      }
    }),
    /**
     * 上面虽然已经分离了第三方库,
     * 但每次修改编译都会改变vendor的hash值
     * 导致浏览器缓存失效。
     * 因为vendor包含了webpack在打包过程中会产生一些运行时代码
     * 当修改业务代码时,业务代码的js文件的hash值必然会改变。
     * 一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
     * 将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'mainifest',
      chunks: ['vendor']
    })
  ]
});

module.exports = webpackConfig;
