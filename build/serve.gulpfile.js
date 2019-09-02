/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';

import config from './config.gulpfile';

const {
  dir,
  $,
  pkg
} = config;

gulp.task('nodemon', gulp.series('init', (done) => {
  $.nodemon({
    exec: 'babel-node',
    script: pkg.main,
    watch: [
      `${dir.backend}/`,
      './',
      `${dir.config}/`
    ],
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    }
  });
  done();
}));

gulp.task('nodemon-debug', gulp.series('init', (done) => {
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
  done();
}));

gulp.task('serve', gulp.series(
  'nodemon',
  'webpack-dev-server'
));

gulp.task('serve-debug', gulp.series(
  'nodemon-debug',
  'webpack-dev-server'
));
