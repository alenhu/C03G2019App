/* eslint-disable import/no-extraneous-dependencies */
import {
  assign,
  transform,
  snakeCase,
  toUpper
} from 'lodash';
import {
  DefinePlugin,
  LoaderOptionsPlugin,
  HashedModuleIdsPlugin,
  optimize
} from 'webpack';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

import webpackConfig from './webpack.frontend.config';
import pkg from '../package.json';

process.env.NODE_ENV = 'production';

const config = webpackConfig();

config.output.filename = '[name]-[hash:8].js';
config.output.chunkFilename = '[chunkhash:8].js';

config.plugins = (config.plugins || []).concat([
  // this allows uglify to strip all warnings
  // from Vue.js source code.
  new DefinePlugin({
    'process.env': assign({
      NODE_ENV: '"production"'
    }, transform(pkg, (result, value, key) => {
      result[`PKG_${toUpper(snakeCase(key))}`] = JSON.stringify(value);
    }))
  }),
  // This minifies not only JavaScript, but also
  // the templates (with html-minifier) and CSS (with cssnano)!
  new LoaderOptionsPlugin({
    minimize: true
  }),
  new HashedModuleIdsPlugin(),
  new ParallelUglifyPlugin({
    cacheDir: '.tmp',
    uglifyES: {
      sourceMap: false,
      ecma: 5,
      compress: {
        drop_console: true
      }
    }
  }),
  new optimize.MinChunkSizePlugin({
    minChunkSize: 30 * 1024
  }),
  new optimize.CommonsChunkPlugin({
    async: 'vendor',
    children: true,
    minChunks: 3
  }),
  new optimize.ModuleConcatenationPlugin()
  // new optimize.AggressiveMergingPlugin({
  //   minSizeReduce: 1.5
  // }),
]);

export default config;
