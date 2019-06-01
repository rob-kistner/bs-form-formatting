const { src, dest, watch, parallel, series } = require('gulp')
const sass = require('gulp-sass')
const purgecss = require('gulp-purgecss')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()

const
  html_src =   'src/html/*.html',
  html_dest =  'dist/',
  scss_src =   'src/scss/*.scss',
  scss_dest =  'dist/css',
  scss_watch = 'src/scss/**/*.s(a|c)ss'
  ;

function html() {
  return src(html_src)
    .pipe(dest(html_dest))
    .pipe(browserSync.stream())
}

function scss() {
  return src(scss_src)
    .pipe(sass({outputStyle: 'expanded'}))
      .on("error", sass.logError)
    .pipe(dest(scss_dest))
    .pipe(browserSync.stream())
}

function purge() {
  return src(scss_src)
    .pipe(sass({
        outputStyle: 'compressed'
      }))
      .on("error", sass.logError)
    .pipe(rename({
      suffix: '-purged'
    }))
    .pipe(purgecss({
      content: [html_dest + '*.html']
    }))
    .pipe(dest(scss_dest))
    .pipe(browserSync.stream())
}


function watchers() {
  
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    ui: {
      port: 8080
    },
    notify: false
  })

  watch(html_src, html)
  watch(scss_watch, scss)
  watch('dist/**/*.*').on('change', browserSync.reload)
}

exports.html       = html
exports.scss       = scss
exports.purge      = purge
exports.watchers   = watchers

exports.default = series(parallel(html, scss), watchers)
