var gulp = require('gulp'),
  jshint = require('gulp-jshint');

gulp.task('lint', function(){
  return gulp.src(['./server/**/*.js', './client/**/*.js', './*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('default', function() {
  // place code for your default task here
});