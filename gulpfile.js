const gulp = require('gulp')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const sourcemap = require('gulp-sourcemaps')
const validator = require('gulp-html')
const htmlmin = require('gulp-htmlmin')
const stylefmt = require('gulp-stylefmt')
const del = require('del')

// pkg and plugin options
let op = {
  uncss: {
    html: ['dist/index.html']
  },
  cssnano: {
    autoprefixer: false
  },
  reporter: {
    clearReportedMessages: true
  }
}

/**
 * Cleaning tasks
 */

gulp.task('clean', function() {
  return del(['dist/**'])
})

/**
 * Font tasks
 */

gulp.task('fonts', ['clean'], function() {
  return gulp.src('src/font/**/*').pipe(gulp.dest('dist/font'))
})

/**
 * HTML tasks
 */

gulp.task('html', ['clean'], function() {
  return gulp.src('src/index.html').pipe(htmlmin()).pipe(gulp.dest('dist'))
})

gulp.task('html:validate', ['html'], function() {
  return gulp.src('dist/index.html').pipe(validator({ verbose: true }))
})

/**
 * Image tasks
 */

gulp.task('img', ['clean'], function() {
  return gulp
    .src(['src/img/**/*', '!src/img/org/**'])
    .pipe(gulp.dest('dist/img'))
})

/**
 * Javascript tasks
 */

gulp.task('js', ['clean'], function() {
  return gulp.src('src/js/*.js').pipe(gulp.dest('dist/js'))
})

/**
 * CSS tasks
 */

// PostCSS
gulp.task('css:postcss', ['clean', 'html'], function() {
  let processors = [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-discard-comments'),
    require('postcss-uncss')(op.uncss),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('css-mqpacker'),
    require('postcss-cssnext'),
    require('postcss-reporter')(op.reporter)
  ]

  return gulp
    .src('src/css/styles.css')
    .pipe(postcss(processors))
    .pipe(stylefmt())
    .pipe(gulp.dest('dist/css'))
})

// CSS minification task
gulp.task('css:minify', ['clean', 'css:postcss'], function() {
  return gulp
    .src('dist/css/styles.css')
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([require('cssnano')(op.cssnano)]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist/css'))
})

/**
 * Default task
 */

gulp.task(
  'default',
  ['clean', 'css:postcss', 'css:minify', 'html', 'js', 'img', 'fonts'],
  function() {
    return gulp.src(['src/manifest.json']).pipe(gulp.dest('dist/'))
  }
)
