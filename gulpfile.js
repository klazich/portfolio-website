let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let validator = require('gulp-html')
let imagemin = require('gulp-imagemin')
let stylefmt = require('gulp-stylefmt')
let del = require('del')

gulp.task('clean:img', () => {
  del(['docs/img'])
})

gulp.task('clean:html', () => {
  del(['docs/*.html'])
})

gulp.task('clean:css', () => {
  del(['docs/*.css', 'docs/*.map'])
})

gulp.task('clean', ['clean:img', 'clean:html', 'clean:css'])

gulp.task('images', ['clean:img'], function() {
  let plugins = [
    imagemin.jpegtran({ progressive: true }),
    imagemin.optipng({ optimizationLevel: 1 }),
    imagemin.svgo({ plugins: [{ removeViewBox: true }] })
  ]
  return gulp
    .src('src/img/**')
    .pipe(imagemin(plugins, { verbose: true }))
    .pipe(gulp.dest('docs/img'))
})

gulp.task('html', ['clean:html'], function() {
  return gulp
    .src('src/index.html')
    .pipe(validator({ verbose: true })) // w3c html validation
    .pipe(gulp.dest('docs/'))
})

gulp.task('css', ['html', 'clean:css'], function() {
  let processors = [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-discard-comments'),
    require('postcss-uncss')({ html: ['docs/index.html'] }),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('css-mqpacker'),
    require('postcss-font-magician'),
    require('postcss-cssnext'),
    //require('postcss-calc'),
    require('postcss-reporter')
  ]
  return gulp
    .src('src/css/styles.css')
    .pipe(postcss(processors))
    .pipe(stylefmt())
    .pipe(gulp.dest('docs/'))
})

gulp.task('minify', ['css'], function() {
  return gulp
    .src('docs/styles.css')
    .pipe(sourcemap.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([require('cssnano')({ autoprefixer: false })]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('docs/'))
})

gulp.task('default', ['minify'], function() {
  return gulp.src('src/CNAME').pipe(gulp.dest('docs/'))
})
