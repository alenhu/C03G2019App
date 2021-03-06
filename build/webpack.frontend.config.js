/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import {
  assign,
  map
} from 'lodash';
import {
  LoaderOptionsPlugin,
  ProvidePlugin
} from 'webpack';

import gulpConfig from './config.gulpfile';

const { dir } = gulpConfig;
const PAGE_PATH = resolve(__dirname, '../app/framework');
function entries() {
  const entryFiles = glob.sync(`${PAGE_PATH}/*/*.js`);
  const maps = {};
  entryFiles.forEach((filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
    maps[filename] = filePath;
  });
  // console.log('entrier ', maps);
  maps.app = resolve(__dirname, '../app/index.html');
  return maps;
}
export default (isDev) => {
  const eslintLoader = {
    loader: 'eslint-loader',
    options: {
      fix: true,
      failOnError: true
    }
  };
  const babelLoader = {
    loader: 'babel-loader',
    options: assign({
      cacheDirectory: '.tmp'
    }, JSON.parse(readFileSync(resolve(__dirname, `../${dir.frontend}/.babelrc`), 'utf8')))
  };

  return {
    externals: {
    },
    entry: entries(),
    // {
    //   // app: [resolve(__dirname, `../${dir.frontend}`)]
    // },
    output: {
      path: resolve(__dirname, `../${dir.distPkg}/${dir.frontend}`),
      publicPath: '/',
      jsonpFunction: 'LJ'
    },
    resolve: {
      modules: [
        resolve(__dirname, '../'),
        resolve(__dirname, '../node_modules')
      ],
      extensions: '.vue .js .styl .css'.split(' '),
      alias: {
        'core-js/library/fn/promise': 'pinkie-polyfill',
        setimmediate: 'set-immediate-shim',
        lodash: 'lodash-es',
        underscore: 'lodash-es'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                loaders: {
                  html: 'htmlhint-loader',
                  js: [
                    babelLoader
                  ],
                  stylus: [
                    'vue-style-loader',
                    'style-loader',
                    {
                      loader: 'css-loader',
                      options: { sourceMap: isDev }
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        sourceMap: isDev
                      }
                    },
                    'stylus-loader'
                  ]
                }
              }
            }
          ].concat(isDev ? [eslintLoader] : [])
        },
        {
          test: /\.js$/,
          // make sure to exclude 3rd party code in node_modules
          exclude: /node_modules/,
          use: [
            babelLoader
          ].concat(isDev ? [eslintLoader] : [])
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        // {
        //   test: /\.css$/,
        //   use: [
        //     'vue-style-loader',
        //     'style-loader',
        //     {
        //       loader: 'css-loader',
        //       options: { sourceMap: isDev }
        //     }
        //   ]
        // },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: isDev }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev
              }
            }
          ]
        },
        {
          test: /icons[\\/]+?\S+\.svg$/,
          use: [
            'raw-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: map({
                  cleanupAttrs: true,
                  removeDoctype: true,
                  removeComments: true,
                  removeTitle: true,
                  removeDesc: true,
                  removeUselessDefs: true,
                  convertColors: { shorthex: false },
                  convertPathData: true,
                  mergePaths: true,
                  convertShapeToPath: true,
                  sortAttrs: true,
                  removeStyleElement: true
                }, (value, key) => {
                  const option = {};
                  option[key] = value;
                  return option;
                })
              }
            }
          ]
        },
        {
        // edit this for additional asset file types
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          options: {
          // inline files smaller then 10kb as base64 dataURL
            limit: 10000,
            // fallback to file-loader with this naming scheme
            name: '[name]-[hash:8].[ext]'
          }
        },
        {
          test: /\.svg(\?\S*)?$/,
          exclude: /icons[\\/]+?/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name]-[hash:8].[ext]',
            mimetype: 'image/svg+xml'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf)(\?\S*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name]-[hash:8].[ext]',
            mimetype: 'application/font-woff'
          }
        }
      ]
    },
    plugins: [
      new LoaderOptionsPlugin({
        stylus: {
          preferPathResolver: 'webpack'
        }
      }),
      new ProvidePlugin({
        Promise: 'pinkie-polyfill',
        setImmediate: 'set-immediate-shim'
      })
    ]
  };
};
