let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
var pipeline = require('readable-stream').pipeline;
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
var rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
// const chalk = require('chalk');
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
var concatCss = require('gulp-concat-css');


gulp.task('styles', function () {

    return gulp.src('unminified/css/*.scss')
        .pipe(sass())
        .pipe(cleanCSS({ compatibility: '*' }))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(concatCss("global.css"))

        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({ stream: true }));
});

function runWebpack(options = {}) {

    const webpackConfigWithOptions = Object.assign(webpackConfig, options);


    gulp.src("unminified/js/")
        .pipe(plumber())
        .pipe(webpackStream(webpackConfigWithOptions))
        .pipe(gulp.dest('js'));
}

gulp.task('browser-sync', gulp.parallel('styles', function () {
    browserSync.init({
        server: {
            baseDir: "./",

        },
        open: false
    });
}));

gulp.task('watch', gulp.parallel('browser-sync', function () {
    gulp.watch(["unminified/css/*.scss", "./styles/*.scss"], gulp.parallel('styles'));
    runWebpack({ watch: true, optimization: { minimize: false}, });

}));

gulp.task('uglify', function () {


    return webpackStream(webpackConfig)
        .pipe(gulp.dest('js'));

});

gulp.task('imageCompress', () => {
    return pipeline(
        gulp.src('unminified/images/*'),
        imagemin(),
        gulp.dest('images')
    );
});

gulp.task('clean', function () {
    return gulp.src(['js/*', 'css/*'], { read: false })
        .pipe(clean());

});

gulp.task('deploy', gulp.series('clean', 'styles', 'uglify', function (done) {
    done();
}));

gulp.task('deployAll', gulp.series('clean', 'styles', 'uglify', 'imageCompress', function (done) {
    done();
}));

gulp.task('default', gulp.parallel('styles', 'watch'));

