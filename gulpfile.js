var gulp = require('gulp'),
  sass = require('gulp-sass'),
  htmlmin = require('gulp-htmlmin'),
  watch = require('gulp-watch'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');

var paths = {
  html: {
    src: './src/*.html',
    dest: 'www'
  },
  scss: {
    src: './src/scss/**/*.scss',
    dest: './www/css'
  },
    js: {
    src: './src/js/*.js',
    dest: './www/js'
  }
};

// MINIFY HTML
gulp.task('htmlmin', function() {
  return gulp.src(paths.html.src)
    // .pipe(watch(paths.html.src))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.html.dest));
});

// SASS TO CSS
gulp.task('sass', function () {
  return gulp.src(paths.scss.src)
    // .pipe(watch(paths.scss.src))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.scss.dest));
});

// UGLIFY JS
gulp.task('uglifyjs', function() {
  return gulp.src(paths.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
});

// WATCH FOR CHANGES
gulp.task('watch', function() {
  gulp.watch(paths.html.src, ['htmlmin']);
  gulp.watch(paths.scss.src, ['sass']);
  gulp.watch(paths.js.src, ['uglifyjs']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['htmlmin', 'sass', 'uglifyjs', 'watch']);



