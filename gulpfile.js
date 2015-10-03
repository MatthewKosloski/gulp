var gulp = require("gulp"),
    sass = require("gulp-sass"),
    htmlmin = require("gulp-htmlmin"),
    watch = require("gulp-watch"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    bower = require("gulp-bower"),
    minifyCss = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename");

var paths = {
  moveAssets: {
    src: "./assets/**/*",
    dest: "www"
  },
  sassToCSS: {
    src: "./src/scss/style.scss",
    dest: "./www/css"
  },
  minifyCSS: {
    src: "./www/css/style.css",
    new: "script.min.css"
  },
  concatJS: {
    concat: "script.js"
  },
  uglifyJS: {
    src: "./www/js/script.js",
    new: "script.min.js"
  },
  bower: {
    dest: "src/lib"
  },
  html: {
    src: "./src/*.html",
    dest: "www"
  },
  scss: {
    src: "./src/scss/style.scss", 
    dest: "./www/css",
    watch: [
      "./src/scss/*.scss", 
      "./src/scss/_*.scss"
    ]
  },
  js: {
    src: [
      "./src/lib/jquery/dist/jquery.js",
      "./src/js/**/*.js"
    ],
    dest: "./www/js/"
  }
};

// move contents of assets folder to www
gulp.task("moveAssets", function(){
  return gulp.src(paths.moveAssets.src)
    .pipe(gulp.dest(paths.moveAssets.dest));
});

// move html to www folder (not minified)
gulp.task("moveHTML", function(){
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
});

// put bower components in lib folder
gulp.task("bower", function() {
  return bower()
    .pipe(gulp.dest(paths.bower.dest));
});

// minify html 
gulp.task("minifyHTML", function() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.html.dest));
});

// sass => css
gulp.task("sassToCSS", function() {
  return gulp.src(paths.sassToCSS.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.sassToCSS.dest));
});

// minify css
gulp.task("minifyCSS", ["sassToCSS"], function() {
  return gulp.src(paths.minifyCSS.src)
    .pipe(minifyCss())
    .pipe(rename(paths.minifyCSS.new))
    .pipe(gulp.dest(paths.scss.dest));
});

// concat javascript
gulp.task("concatJS", function() {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat(paths.concatJS.concat))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dest));
});

// uglify javascript and rename
gulp.task("uglifyJS", ["concatJS"], function() {
  return gulp.src(paths.uglifyJS.src)
    .pipe(uglify())
    .pipe(rename(paths.uglifyJS.new))
    .pipe(gulp.dest(paths.js.dest));
});

// watch for changes
gulp.task("watch", function() {
  gulp.watch(paths.html.src, ["minifyHTML"]);
  gulp.watch(paths.scss.watch, ["minifyCSS"]);
  gulp.watch(paths.js.src, ["concatJS"]);
});

// The default task (called when you run `gulp` from cli)
gulp.task("build", ["moveAssets", "bower", "minifyHTML", "sassToCSS", "minifyCSS", "concatJS", "uglifyJS"]); /*compresses html, css, js*/
gulp.task("default", ["moveAssets", "bower", "moveHTML", "sassToCSS", "concatJS", "watch"]);
