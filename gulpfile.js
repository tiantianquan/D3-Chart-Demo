var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

//检查代码
gulp.task('lint', function() {
  gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(connect.reload())
})

//sass
gulp.task('sass', function() {
  gulp.src('./scss/*.scss')
    .pipe(sass({
      // includePaths: require('node-bourbon').with('other/path', 'another/path')
      // - or -
      includePaths: require('node-bourbon').with(require('node-neat').includePaths,
          './bower_components/bootstrap-sass-official/assets/stylesheets')
        // includePaths: ['./bower_components/bootstrap-sass-official/assets/stylesheets']
    }))
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload())
})

gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(connect.reload());
})

gulp.task('watch', function() {
  gulp.watch('./*.html', function() {
    gulp.run('html')
  })
  gulp.watch('./js/*.js', function() {
    gulp.run('lint')
  })
  gulp.watch('./scss/*.scss', function() {
    gulp.run('sass')
  })
})

gulp.task('serve', function() {
  connect.server({
    port: 2222,
    livereload: true
  })
  gulp.run('watch');
})

//default
gulp.task('default', ['serve']);