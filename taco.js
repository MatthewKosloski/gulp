'use strict';

import gulp from 'gulp';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import { create as browserSync } from 'browser-sync';

// var browserSync = require('browser-sync').create();

// HTML
gulp.task('html', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./public'));
});
gulp.task('htmlmin', ['html'], () => {
  return gulp.src('public/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});


// CSS
gulp.task('scss', () => {
    return gulp.src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync().stream());
});
gulp.task('cssnano', ['scss'], () => {
    return gulp.src('./public/css/main.css')
        .pipe(cssnano())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./public/css'));
});

// JavaScript
gulp.task('babel', function () {
  return gulp.src(['src/js/app.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync().stream());
});

gulp.task('serve', ['html', 'scss', 'babel'], () => {
    browserSync().init({ server: './public' });

    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/js/**/*.js', ['babel']);
    gulp.watch('./src/*.html', ['html']).on('change', browserSync().reload);
});

gulp.task('default', ['serve']);
gulp.task('build', ['cssnano', 'htmlmin']);