'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const { src, dest, series, watch } = gulp;

/*
 * Moves HTML to the destination. 
 */
const _moveHTML = function() {
    return src('./src/*.html')
        .pipe(dest('./public'));
}

 /*
  * Takes HTML files from the source,
  * minifies them, and puts them in the destination.
  */
const _minifyHTML = series(_moveHTML, function() {
    return src('./public/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./public'));
})

/*
 *  Converts the SASS to CSS, injects a sourcemap, 
 *  and outputs a CSS file named 'style.css' to the
 *  destination.   
 */
const _sassToCSS = function() {
    return src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(dest('./public/css'))
        .pipe(browserSync.stream());
}

/*
 *  Takes the CSS file from the public directory,
 *  adds vendor prefixes to appropriate properties,
 *  minifies the file, and outputs a CSS file named
 *  '*.min.css' to the destination. 
 */
const _minifyCSS = series(_sassToCSS, function() {
    return src('./public/css/style.css')
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename('style.min.css'))
        .pipe(dest('./public/css'));
});

/*
 *  Takes ES6 code from the source,
 *  injects a source map, transpiles it
 *  to ES5, and outputs the file to the destination. 
 */
const _es6ToJS = function() {
    return src('./src/js/app.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(dest('./public/js'))
        .pipe(browserSync.stream());
}

/*
 * Takes the JS code from the source, minifies it,
 * renames it to '*.min.js', and outputs the file 
 * to the destination.
 */
const _minifyJS = series(_es6ToJS, function() {
    return src('./public/js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(dest('./public/js'));
});

const dev = function() {
    browserSync.init({ 
        server: './public',
        open: false, // don't open tab in browser
        ui: false
    });

    watch('./src/*.html', {ignoreInitial: false}, _moveHTML)
    .on('change', browserSync.reload);
    watch('./src/scss/**/*.scss', {ignoreInitial: false}, _sassToCSS);
    watch('./src/js/**/*.js', {ignoreInitial: false}, _es6ToJS);
};

const build = series(_minifyHTML, _minifyCSS, _minifyJS)

module.exports = {
    dev, 
    build
};