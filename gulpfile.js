let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let validator = require('gulp-html')
let stylefmt = require('gulp-stylefmt')
let del = require('del')

let op = {
  uncss: {
    html: ['www/index.html']
  },
  cssnano: {
    autoprefixer: false
  }
}

/**
 * Clean tasks
 */
gulp.task('clean:img', function() {
  return del(['www/img/**/*'])
})

gulp.task('clean:html', function() {
  return del(['www/*.html'])
})

gulp.task('clean:css', function() {
  return del(['www/css/*.css', 'www/css/*.map'])
})

gulp.task('clean', function() {
  return del(['www/**'])
})

/**
 * Font tasks
 */
gulp.task('fonts', ['clean'], function () {
  return gulp.src('src/font/**/*').pipe(gulp.dest('www/font'))
})

/**
 * Image tasks
 */
gulp.task('images', ['clean'], function() {
  return gulp.src('src/img/**/*').pipe(gulp.dest('www/img'))
})

/**
 * Javascript tasks
 */
gulp.task('js', ['clean'], function () {
  return gulp.src('src/js/*.js').pipe(gulp.dest('www/js'))
})

/**
 * HTML tasks
 */
gulp.task('html', ['clean'], function() {
  return gulp.src('src/index.html').pipe(gulp.dest('www'))
})

gulp.task('html:validate', ['html'], function() {
  return gulp.src('www/index.html').pipe(validator({ verbose: true }))
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
    require('postcss-cssnext'),
    require('postcss-reporter')
  ]

  return gulp
    .src('src/css/styles.css')
    .pipe(postcss(processors))
    .pipe(stylefmt())
    .pipe(gulp.dest('www/css'))
})

/**
 * CSS minification tasks
 */
gulp.task('minify', ['clean', 'css'], function() {
  return gulp
    .src('www/css/styles.css')
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([require('cssnano')(op.cssnano)]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('www/css'))
})

/**
 * Watch task
 */
gulp.task('watch', function() {})

/**
 * Default task
 */
gulp.task('default', ['clean', 'minify', 'js', 'images', 'fonts'], function() {
  return gulp.src(['src/CNAME', 'src/manifest.json']).pipe(gulp.dest('www/'))
})
