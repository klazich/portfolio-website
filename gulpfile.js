let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let del = require('del')

gulp.task('clean', function () {
    return del(['www/css/**/*'])
})

gulp.task('css', ['clean'], function () {
    return gulp.src('css/base.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-font-magician'),
            require('postcss-custom-media'),
            require('postcss-custom-properties'),
            require('postcss-calc'),
            require('postcss-color-function'),
            require('autoprefixer'),
        ]))
        .pipe(gulp.dest('www/css'))
})

gulp.task('minify', ['css'], function () {
    return gulp.src(['www/css/*.css'])
        .pipe(sourcemap.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([require('cssnano')]))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('www/css'))
})

gulp.task('default', ['minify'])
