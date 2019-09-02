/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import { LoaderOptionsPlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

import gulpConfig from './config.gulpfile';

const { dir } = gulpConfig;

export default {
  entry: resolve(__dirname, '../', gulpConfig.pkg.main),
  output: {
    path: resolve(__dirname, '../', dir.distPkg),
    filename: gulpConfig.pkg.main
  },
  resolve: {
    modules: [
      resolve(__dirname, '../'),
      resolve(__dirname, '../node_modules')
    ],
    extensions: ['.js']
  },
  target: 'node',
  externals: [
    nodeExternals(),
    function(context, request, callback) {
      if (request.indexOf(`${dir.config}/config`) > -1) {
        callback(null, `require("./${dir.config}/config")`);
        return;
      }
      callback();
    }
  ],
  context: resolve(__dirname, '../'),
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // make sure to exclude 3rd party code in node_modules
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'syntax-dynamic-import',
            'dynamic-import-node'
          ]
        }
      }
    ]
  },
  plugins: [
    new LoaderOptionsPlugin({
      minimize: true
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.tmp',
      uglifyES: {
        sourceMap: false,
        compress: {
          ecma: 8,
          drop_console: true
        }
      }
    })
  ]
};
