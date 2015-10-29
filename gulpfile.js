var gulp = require("gulp"),
    sass = require("gulp-sass"),
    htmlmin = require("gulp-htmlmin"),
    watch = require("gulp-watch"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    bower = require("gulp-bower"),
    minifyCss = require("gulp-minify-css"),
    uncss = require("gulp-uncss"),
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
  // don't include './' in front in unCSSTask
  unCSSTask: {
    src: "www/css/style.css",
    html: "src/*.html",
    dest: "www/css"
  },
  minifyCSS: {
    src: "./www/css/style.css",
    newName: "style.min.css",
    dest: "./www/css"
  },
  concatJS: {
    concat: "script.js"
  },
  uglifyJS: {
    src: "./www/js/script.js",
    newName: "script.min.js"
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
    src: [],
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

// minifies html 
gulp.task("minifyHTML", function() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.html.dest));
});

// compiles sass to css
gulp.task("sassToCSS", function() {
  return gulp.src(paths.sassToCSS.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.sassToCSS.dest));
});

// removes unused css rules
gulp.task("unCSS", ["sassToCSS"], function() {
  return gulp.src(paths.unCSSTask.src)
    .pipe(uncss({
      html: paths.unCSSTask.html
    }))
    .pipe(gulp.dest(paths.unCSSTask));
});

// minifies css
gulp.task("minifyCSS", function() {
  return gulp.src(paths.minifyCSS.src)
    .pipe(minifyCss())
    .pipe(rename(paths.minifyCss.newName))
    .pipe(gulp.dest(paths.minifyCss.dest));
});

// concat javascript
gulp.task("concatJS", function() {
  return gulp.src(paths.js.src)
    .pipe(concat(paths.concatJS.concat))
    .pipe(gulp.dest(paths.js.dest));
});

// uglify javascript and rename
gulp.task("uglifyJS", ["concatJS"], function() {
  return gulp.src(paths.uglifyJS.src)
    .pipe(uglify())
    .pipe(rename(paths.uglifyJS.newName))
    .pipe(gulp.dest(paths.js.dest));
});

// watch for changes
gulp.task("watch", function() {
  gulp.watch(paths.moveAssets.src, ["moveAssets"]);
  gulp.watch(paths.html.src, ["minifyHTML"]);
  gulp.watch(paths.scss.watch, ["sassToCSS"]);
  gulp.watch(paths.js.src, ["concatJS"]);
});

// The default task (called when you run `gulp` from cli)
gulp.task("build", ["moveAssets", "bower", "minifyHTML", "sassToCSS", "unCSS", "minifyCSS", "concatJS", "uglifyJS"]); /*compresses html, css, js*/
gulp.task("default", ["moveAssets", "bower", "moveHTML", "sassToCSS", "unCSS", "concatJS", "watch"]);
