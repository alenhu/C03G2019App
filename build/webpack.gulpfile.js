/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import webpack from 'webpack';
import {
  keys,
  transform
} from 'lodash';

import config from './config.gulpfile';
import webpackBackendConfig from './webpack.backend.config';

const {
  $,
  dir
} = config;

gulp.task('webpack-dev-server', gulp.series('init', (done) => {
  import('./webpack.frontend.dev.config')
    .then((webpackFrontendDevConfig) => {
      webpackFrontendDevConfig = webpackFrontendDevConfig.default;
      const devConfig = config.dev;
      const portDev = devConfig.port.http + 1;
      const currentUrl = `http://${devConfig.ips[0]}:${portDev}`;
      const originalUrl = `http://${devConfig.ips[0]}:${devConfig.port.http}`;
      const compiler = webpack(webpackFrontendDevConfig);
      const server = new $.WebpackDevServer(compiler, {
        contentBase: dir.frontend,
        hot: true,
        compress: false,
        quiet: false,
        noInfo: false,
        disableHostCheck: true,
        watchOptions: {
          aggregateTimeout: 500,
          poll: 1000
        },
        publicPath: '/',
        stats: {
          cached: false,
          colors: true,
          maxModules: 5
          // optimizationBailout: true
        },
        proxy: {
          '**': {
            target: `http://localhost:${devConfig.port.http}`,
            secure: false
          }
        }
      });
      server.listen(portDev, '0.0.0.0', () => {
        $.log(
          '[webpack-dev-server]',
          `${currentUrl} => ${originalUrl}`
        );
        $.open(currentUrl);
        done();
      });
    })
    .catch(done);
}));

gulp.task('webpack-frontend', () =>
  import('./webpack.frontend.prod.config')
    .then(webpackFrontendProdConfig => $.webpack(webpackFrontendProdConfig.default))
    .then((stats) => {
      $.log('[webpack]', stats.toString({
        cached: false,
        colors: true,
        maxModules: 5,
        optimizationBailout: true
      }));
    }));

gulp.task('html', gulp.series('webpack-frontend', () => import('./webpack.frontend.prod.config')
  .then((webpackFrontendProdConfig) => {
    webpackFrontendProdConfig = webpackFrontendProdConfig.default;
    const webpackEntries = webpackFrontendProdConfig.entry;

    const entry = keys(webpackEntries).join('|');
    const entryRegExp = new RegExp(`(${entry})\\-(\\S+?)\\.js$`);
    const scriptRegExp = new RegExp(`/?(${entry})\\.js`);
    return $.recursiveReaddir(`${dir.distPkg}/${dir.frontend}`)
      .then(files => transform(
        files,
        (result, file) => {
          const matches = entryRegExp.exec(file);
          if (matches && matches[1] && matches[2]) {
            result[matches[1]] = matches[2];
          }
        }
      ))
      .then(bundleNames => gulp.src([
        `${dir.frontend}/**/*.html`
      ])
        .pipe($.replace(scriptRegExp, ($0, $1) => (
          `/${$1}-${bundleNames[$1]}.js`
        )))
        .pipe($.replace('@@build.name', config.pkg.name))
        .pipe($.replace('@@build.version', config.pkg.version))
        .pipe($.htmlmin({
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          customAttrCollapse: /./,
          customAttrSurround: [
            [/<%/, /%>/]
          ],
          minifyJS: true,
          minifyCSS: true
        }))
        .pipe(gulp.dest(`${dir.distPkg}/${dir.frontend}`)));
  })));

gulp.task('webpack-backend', () =>
  $.webpack(webpackBackendConfig)
    .then((stats) => {
      $.log('[webpack]', stats.toString({
        cached: false,
        colors: true,
        maxModules: 5
      }));
    }));
