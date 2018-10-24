const gulp = require('gulp');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const del = require('del');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();

const paths = {
    root: 'build',
    templates: {
        pages: './src/views/pages/*.pug',
        src: './src/views/**/*.pug',
        dest: './build/'
    },
    styles: {
        main: './src/assets/styles/main.scss',
        src: './src/assets/styles/**/*.scss',
        dest: './build/assets/styles'
    },
    scripts: {
        src: './src/assets/scripts/*.js',
        dest: './build/assets/scripts/'
    }
}

//clean
function clean() {
    return del(paths.root);   
}

//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

// postcss
function styles() {
    return gulp.src(paths.styles.main)
        .pipe(sourcemaps.init())
        .pipe(postcss(require('./postcss.config')))
        .pipe(sourcemaps.write())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
}

// webpack
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

// watch
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

//server
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.scripts = scripts;
exports.watch = watch;
exports.server = server;

// default
gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, scripts),
    gulp.parallel(watch, server)
));