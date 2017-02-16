'use strict';

var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');

var browserSync = require('browser-sync').create();

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./public'));
});

gulp.task('htmlmin', ['html'], function() {
  return gulp.src('public/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('scss', function() {
    return gulp.src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('cssnano', ['scss'], function() {
    return gulp.src('./public/css/main.css')
        .pipe(cssnano())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('serve', ['html', 'scss'], function() {
    browserSync.init({ server: './public' });

    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/*.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
gulp.task('build', ['cssnano', 'htmlmin']);