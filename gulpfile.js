let gulp = require('gulp')
let postcss = require('gulp-postcss')
let rename = require('gulp-rename')
let sourcemap = require('gulp-sourcemaps')
let validator = require('gulp-html')
let imagemin = require('gulp-imagemin')
let stylefmt = require('gulp-stylefmt')
let del = require('del')

let paths = {
    css: 'src/css/**/*.css',
    html: 'src/index.html'
}

gulp.task('clean', function () {
    return del(['docs'])
})

gulp.task('images', ['clean'], function () {
    return gulp.src('src/img/**/*')
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('docs/img'))
})

gulp.task('html', ['clean'], function () {
    return gulp.src('src/index.html')
        .pipe(validator({ verbose: true }))  // w3c html validation
        .pipe(gulp.dest('docs/'))
})

gulp.task('css', ['clean'], function () {
    return gulp.src('src/css/base.css')
        .pipe(postcss([
            require('postcss-import'),
            require('postcss-url'),
            require('postcss-cssnext'),
            require('postcss-font-magician'),
            require('css-mqpacker'),
            require('postcss-custom-media'),
            require('postcss-custom-properties'),
            require('postcss-calc'),
            require('postcss-color-function'),
            require('postcss-reporter')
        ]))
        .pipe(stylefmt())
        .pipe(gulp.dest('docs/css'))
})

gulp.task('minify', ['css'], function () {
    return gulp.src(['docs/css/*.css'])
        .pipe(sourcemap.init())
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([require('cssnano')({ autoprefixer: false })]))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('docs/css'))
})

gulp.task('default', ['minify', 'html', 'images'], function () {
    return gulp.src('src/CNAME')
        .pipe(gulp.dest('docs/'))
})
