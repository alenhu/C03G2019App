/* eslint-disable import/no-extraneous-dependencies */
import {
  each,
  assign,
  transform,
  snakeCase,
  toUpper
} from 'lodash';
import {
  DefinePlugin,
  LoaderOptionsPlugin,
  HotModuleReplacementPlugin
} from 'webpack';
import BuildNotifierPlugin from 'webpack-build-notifier';
// import { VueLoaderPlugin } from 'vue-loader';
import webpackConfig from './webpack.frontend.config';
import pkg from '../package.json';

// Add the client which connects to our middleware
// You can use full urls like
// 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
// useful if you run your app from another point like django

process.env.NODE_ENV = 'development';

const config = webpackConfig(true);
config.mode = process.env.NODE_ENV = 'development';
each(config.entry, (entry) => {
  entry.unshift(
    'webpack-dev-server/client?/',
    'webpack/hot/dev-server'
  );
});

config.output.filename = '[name].js';
config.output.chunkFilename = '[id].js';

config.devtool = 'cheap-module-source-map';

config.devServer = {
  noInfo: false
};

config.plugins = (config.plugins || []).concat([
  new DefinePlugin({
    'process.env': assign({
      NODE_ENV: 'undefined'
    }, transform(pkg, (result, value, key) => {
      result[`PKG_${toUpper(snakeCase(key))}`] = JSON.stringify(value);
    }))
  }),
  new LoaderOptionsPlugin({
    debug: true
  }),
  new HotModuleReplacementPlugin(),
  new BuildNotifierPlugin()
]);

export default config;
