/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';

import config from './config.gulpfile';

const {
  dir,
  $
} = config;
gulp.task('mkdir', () => Promise.all([
  dir.log,
  `${dir.distPkg}/${dir.log}`
].map(dest => $.makeDir(dest))));

gulp.task('lint:backend', () =>
  gulp.src([
    config.pkg.main,
    `{${dir.backend},${dir.config}}/**/*.js`
  ])
    .pipe($.eslint({
      configFile: '.eslintrc.js',
      fix: true
    }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe($.if(file => file.eslint && file.eslint.fixed, gulp.dest('.')))
);

gulp.task('init', ['mkdir', 'lint:backend']);
