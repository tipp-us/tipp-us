var gulp = require('gulp');
var jshint = require('gulp-jshint');
var shell = require('gulp-shell');
var Server = require('karma').Server;

gulp.task('lint', function() {
  return gulp.src(['./server/**/*.js', './client/**/*.js', '!./client/lib/**/*.js', './*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
});

gulp.task('dummydb', shell.task('node db/dummydb.js'));

gulp.task('dropdb', shell.task('node db/dropdb.js'));

gulp.task('check', ['lint', 'test']);

gulp.task('default', function() {
  // place code for your default task here
});
