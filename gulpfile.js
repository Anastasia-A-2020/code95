const { src, dest, watch, parallel, series } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const minifyjs = require("gulp-js-minify");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const srcPath = "src/"; // from where
const distPath = "dist/"; // to where
const path = {
  styles: {
    src: `${srcPath}scss/**/*.scss`,
    dest: `${distPath}css/`,
  },
  scripts: {
    src: `${srcPath}js/**/*.js`,
    dest: `${distPath}js/`,
  },
  html: {
    src: `index.html`,
    dest: distPath,
  },
  img: {
    src: `${srcPath}images/**/*`,
    dest: `${distPath}images/`,
  },
};
function styles() {
  return src(path.styles.src)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat("style.min.css"))
    .pipe(dest(path.styles.dest))
    .pipe(browserSync.stream());
}
function scripts() {
  return src(path.scripts.src)
    .pipe(uglify())
    .pipe(minifyjs())
    .pipe(concat("script.min.js"))
    .pipe(dest(path.scripts.dest))
    .pipe(browserSync.stream());
}
function html() {
  return src(path.html.src)
    .pipe(dest(path.html.dest))
    .pipe(browserSync.stream());
}
function img() {
  return src(path.img.src).pipe(imagemin()).pipe(dest(path.img.dest));
}
function watching() {
  // watch(path.html.src, html);
  watch(path.styles.src, styles);
  watch(path.scripts.src, scripts);
  watch(["./*.html"]).on("change", browserSync.reload);
}
function loadPage() {
  browserSync.init({
    server: { baseDir: "./", port: 3000, keepalive: true },
  });
}
function clear() {
  return del(distPath);
}
const build = series(clear, parallel(scripts, img), styles);
const dev = parallel(watching, loadPage);
exports.build = build;
exports.dev = dev;
exports.default = parallel(build, dev);
