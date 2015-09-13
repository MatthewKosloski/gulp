// "use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    htmlmin = require("gulp-htmlmin"),
    watch = require("gulp-watch"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    bower = require("gulp-bower"),
    minifyCss = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps");

var paths = {
  html: {
    src: "./src/*.html",
    dest: "www"
  },
  scss: {
    src: "./src/scss/style.scss",
    dest: "./www/css"
  },
  js: {
    src: [
      "./src/lib/jquery/dist/jquery.js",
      "./src/js/**/*.js"
    ],
    dest: "./www/js/"
  }
};

// put bower components in lib folder
gulp.task("bower", function() {
  return bower()
    .pipe(gulp.dest("src/lib"));
});

// minify html
gulp.task("htmlmin", function() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.html.dest));
});

// sass to css, minification
gulp.task("sass", function() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest));
});

// sourcemap, concat, uglify javascript
gulp.task("javascript", function() {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dest));
});

// WATCH FOR CHANGES
gulp.task("watch", function() {
  gulp.watch(paths.html.src, ["htmlmin"]);
  gulp.watch(paths.scss.src, ["sass"]);
  gulp.watch(paths.js.src, ["javascript"]);
});


// The default task (called when you run `gulp` from cli)
gulp.task("default", ["bower", "htmlmin", "sass", "javascript", "watch"]);