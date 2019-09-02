import gulp from 'gulp';
import './build/init.gulpfile';
import './build/webpack.gulpfile';
import './build/serve.gulpfile';
import './build/build.gulpfile';
// 可用任务列表
gulp.task('default', ['serve']);
gulp.task('build', ['building']);
