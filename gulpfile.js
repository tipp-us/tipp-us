var gulp = require('gulp');
var jshint = require('gulp-jshint');
var shell = require('gulp-shell');
var Server = require('karma').Server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var run = require('gulp-run');

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

gulp.task('presdb', shell.task('node db/dummydb-pres.js'));

gulp.task('dropdb', shell.task('node db/dropdb.js'));

gulp.task('check', ['lint', 'test']);

gulp.task('uglyCat', function() {
  return gulp.src(['./client/app.js', './client/controllers/*.js', './client/directives/*.js'])
    .pipe(concat('starvingall.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./client/dist/'));
});

gulp.task('nodeIndex', function() {
  run('node index.js').exec();
});

gulp.task('build', ['uglyCat', 'nodeIndex']);

gulp.task('default', function() {
  // place code for your default task here
});
