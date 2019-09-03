/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';

import config from './config.gulpfile';

const {
  dir,
  $,
  pkg
} = config;

gulp.task('clean', () => $.del([
  `${dir.dist}/*.*`,
  `${dir.distPkg}/*`,
  `${dir.distPkg}/node_modules`
]));

gulp.task('babel-config-env', () => gulp.src([
  `${dir.configEnv}/**/*.js`
])
  .pipe($.babel({
    plugins: [
      'transform-es2015-modules-commonjs',
      'syntax-dynamic-import',
      'dynamic-import-node',
      'syntax-object-rest-spread',
      'transform-object-rest-spread'
    ]
  }))
  .pipe(gulp.dest(`${dir.distPkg}/${dir.config}`)));

gulp.task('copy', () => gulp.src([
  '*.{json,md}',
  '*.sh',
  '*.txt'
])
  .pipe(gulp.dest(dir.distPkg)));

gulp.task('copy-env', gulp.series('copy', () => gulp.src([
  `${dir.configEnv}/**/*.*`,
  `!${dir.configEnv}/**/*.js`
])
  .pipe(gulp.dest(`${dir.distPkg}/config`))));

// 安装运行依赖的 node_modules
gulp.task('node-modules', gulp.series('copy', $.shell.task([
  `cd ${dir.distPkg} && npm install -d --production`
])));

gulp.task('gzip', () =>
  gulp.src([
    `${dir.distPkg}/**/*`,
    `${dir.distPkg}/**/.*/**/*`,
    `!${dir.distPkg}/**/{package-lock.json,yarn.lock}`
  ])
    .pipe($.tar(`${pkg.name}-${pkg.version}.tar.gz`, {
      gzip: true,
      gzipOptions: { level: 9 },
      mode: null
    }))
    .pipe(gulp.dest(dir.dist)));

gulp.task('building', gulp.series(
  'clean',
  'init',
  'html',
  'webpack-backend',
  'babel-config-env',
  'node-modules',
  'copy-env',
  'gzip'
));
