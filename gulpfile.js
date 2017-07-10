let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let validator = require('gulp-html')
let stylefmt = require('gulp-stylefmt')
let del = require('del')

let op = {
  uncss: {
    html: ['docs/index.html']
  },
  fontmagician: {
    variants: {
      'Roboto Mono': {
        '400': [],
        '400 italic': [],
        '700': []
      },
      Inconsolata: {
        '400': [],
        '700': []
      }
    },
    async: 'fontloader.js'

  },
  cssnano: {
    autoprefixer: false
  }
}

/**
 * Clean tasks
 */
gulp.task('clean:img', function() {
  return del(['docs/img/**/*'])
})

gulp.task('clean:html', function() {
  return del(['docs/*.html'])
})

gulp.task('clean:css', function() {
  return del(['docs/*.css', 'docs/*.map'])
})

gulp.task('clean', function() {
  return del(['docs/**'])
})

/**
 * Javascript tasks
 */
gulp.task('js', ['clean'], function () {
  return gulp.src('src/js/*.js').pipe(gulp.dest('docs/js'))
})

/**
 * Image tasks
 */
gulp.task('images', ['clean'], function() {
  return gulp.src('src/img/**/*').pipe(gulp.dest('docs/img'))
})

/**
 * HTML tasks
 */
gulp.task('html', ['clean'], function() {
  return gulp.src('src/index.html').pipe(gulp.dest('docs'))
})

gulp.task('html:validate', ['html'], function() {
  return gulp.src('docs/index.html').pipe(validator({ verbose: true }))
})

/**
 * CSS tasks
 */
gulp.task('css', ['clean', 'html'], function() {
  let processors = [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-discard-comments'),
    require('postcss-uncss')(op.uncss),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('css-mqpacker'),
    require('postcss-font-magician')(op.fontmagician),
    require('postcss-cssnext'),
    require('postcss-reporter')
  ]

  return gulp
    .src('src/css/styles.css')
    .pipe(postcss(processors))
    .pipe(stylefmt())
    .pipe(gulp.dest('docs/'))
})

/**
 * CSS minification tasks
 */
gulp.task('minify', ['clean', 'css'], function() {
  return gulp
    .src('docs/styles.css')
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([require('cssnano')(op.cssnano)]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/'))
})

/**
 * Watch task
 */
gulp.task('watch', function() {})

/**
 * Default task
 */
gulp.task('default', ['clean', 'minify', 'js', 'images'], function() {
  return gulp.src(['src/CNAME', 'src/manifest.json']).pipe(gulp.dest('docs/'))
})
