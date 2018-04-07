'use strict';
const utils = require('./utils');
const isProduction = process.env.NODE_ENV === 'production';
const sourceMapEnabled = isProduction ? false : 'source-map';

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  /**
   * 如果需要在开发工具中调试vue文件
   * 比如Visual Studio Code中的 Debugger for Chrome
   * 请把这个设置成false，开发环境适用
   */
  cacheBusting: false, // 开发环境才需要的配置
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};
