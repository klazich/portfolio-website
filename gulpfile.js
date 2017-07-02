let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let del = require('del')

gulp.task('clean', function () {
    return del(['docs/css/**/*', 'docs/index.html'])
})

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('docs/'))
})

gulp.task('css', ['clean'], function () {
    return gulp.src('src/css/base.css')
        .pipe(postcss([
            //require('postcss-processor-order'),
            require('postcss-import'),
            require('postcss-url'),
            require('postcss-cssnext'),
            require('postcss-font-magician'),
            require('css-mqpacker'),
            require('postcss-custom-media'),
            require('postcss-custom-properties'),
            require('postcss-calc'),
            require('postcss-color-function'),
            require('postcss-browser-reporter'),
            require('postcss-reporter')

        ]))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('minify', ['css'], function () {
    return gulp.src(['docs/css/*.css'])
        .pipe(sourcemap.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([require('cssnano')({autoprefixer: false})]))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('default', ['minify', 'html'])
