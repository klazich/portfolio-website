let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let validator = require('gulp-html')
let htmlmin = require('gulp-htmlmin')
let stylefmt = require('gulp-stylefmt')
let del = require('del')

// pkg and plugin options
let op = {
  uncss: {
    html: ['www/index.html']
  },
  cssnano: {
    autoprefixer: false
  },
  htmlmin: {
    collapseWhitespace: true
  },
  import: {
    plugins: [require('stylelint')]
  },
  reporter: {
    clearReportedMessages: true
  }
}

/**
 * Cleaning tasks
 */

gulp.task('clean', function() {
  return del(['www/**'])
})

/**
 * Font tasks
 */

gulp.task('fonts', ['clean'], function() {
  return gulp.src('src/font/**/*').pipe(gulp.dest('www/font'))
})

/**
 * HTML tasks
 */

gulp.task('html', ['clean'], function() {
  return (gulp
      .src('src/index.html')
      //.pipe(htmlmin(op.htmlmin))
      .pipe(gulp.dest('www')) )
})

gulp.task('html:validate', ['html'], function() {
  return gulp.src('www/index.html').pipe(validator({ verbose: true }))
})

/**
 * Image tasks
 */

gulp.task('img', ['clean'], function() {
  return gulp
    .src(['src/img/**/*', '!src/img/org/**'])
    .pipe(gulp.dest('www/img'))
})

/**
 * Javascript tasks
 */

gulp.task('js', ['clean'], function() {
  return gulp.src('src/js/*.js').pipe(gulp.dest('www/js'))
})

/**
 * CSS tasks
 */

// PostCSS
gulp.task('css:postcss', ['clean', 'html'], function() {
  let processors = [
    require('postcss-import'),
    // require('stylelint'),
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
    .pipe(gulp.dest('www/css'))
})

// CSS minification task
gulp.task('css:minify', ['clean', 'css:postcss'], function() {
  return gulp
    .src('www/css/styles.css')
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([require('cssnano')(op.cssnano)]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('www/css'))
})

/**
 * Default task
 */

gulp.task(
  'default',
  ['clean', 'css:postcss', 'css:minify', 'html', 'js', 'img', 'fonts'],
  function() {
    return gulp.src(['src/manifest.json']).pipe(gulp.dest('www/'))
  }
)
