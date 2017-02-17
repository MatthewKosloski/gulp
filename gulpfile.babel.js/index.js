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
import uglify from 'gulp-uglify';
import config from './config';
import path from 'path';
import pump from 'pump';

// import { create as browserSync } from 'browser-sync'; <- not working
const browserSync = require('browser-sync').create();

const { paths, tasks } = config;
const { src, dest } = paths;

// HTML
gulp.task('html', () => {
    return gulp.src(path.join(src, tasks.html.src))
        .pipe(gulp.dest(dest));
});
gulp.task('htmlmin', ['html'], () => {
  return gulp.src(path.join(src, tasks.htmlmin.src))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dest));
});

// CSS
gulp.task('scss', () => {
    return gulp.src(path.join(src, tasks.scss.src))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(dest, tasks.scss.dest)))
        .pipe(browserSync.stream());
});
gulp.task('cssnano', ['scss'], () => {
    return gulp.src(path.join(src, tasks.cssnano.src))
        .pipe(cssnano())
        .pipe(rename(tasks.cssnano.rename))
        .pipe(gulp.dest(path.join(dest, tasks.cssnano.dest)));
});

// JavaScript
gulp.task('babel', () => {
  return gulp.src(tasks.babel.srcs)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat(tasks.babel.concat))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(dest, tasks.babel.dest)))
    .pipe(browserSync.stream());
});
gulp.task('uglify', ['babel'], (cb) => {
    pump([
        gulp.src(tasks.uglify.src),
        uglify(),
        rename(tasks.uglify.rename),
        gulp.dest(path.join(dest, tasks.uglify.dest))
    ],
    cb
    );
});

gulp.task('serve', ['html', 'scss', 'babel'], () => {
    browserSync.init({ 
        server: './public',
        open: false, // don't open tab in browser
        ui: false
    });

    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/js/**/*.js', ['babel']);
    gulp.watch('./src/*.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
gulp.task('build', ['htmlmin', 'cssnano', 'uglify']);