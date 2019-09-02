/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';

import config from './config.gulpfile';

const {
  dir,
  $,
  pkg
} = config;

gulp.task('nodemon', ['init'], () => {
  $.nodemon({
    exec: 'babel-node',
    script: pkg.main,
    watch: [
      `${dir.backend}/`,
      `./`,
      `${dir.config}/`
    ],
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('nodemon-debug', ['init'], () => {
  const devConfig = config.dev;
  const portDebug = devConfig.port.http + 2000;

  $.nodemon({
    exec: `babel-node --inspect=0.0.0.0:${portDebug}`,
    script: pkg.main,
    watch: [
      `${dir.backend}/`,
      `${dir.config}/`
    ],
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('serve', [
  'nodemon',
  'webpack-dev-server'
]);

gulp.task('serve-debug', [
  'nodemon-debug',
  'webpack-dev-server'
]);