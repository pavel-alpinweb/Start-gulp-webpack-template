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
const iconfont = require('gulp-iconfont');
const consolidate  = require('gulp-consolidate');
const async = require('async');

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
    },
    icons: {
        src: './src/assets/images/icons/*.svg',
        dest: './build/assets/images/icons/*.svg'
    },
    fonts: {
        src: './src/assets/fonts/*.*',
        dest: './build/assets/fonts'
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

function Iconfont(done) {
    let iconStream = gulp.src(paths.icons.src)
      .pipe(iconfont({ 
          fontName: 'myfont',
          normalize:true,
          prependUnicode: true,
          fontHeight: 1001
        }));
   
    async.parallel([
      function handleGlyphs (cb) {
        iconStream.on('glyphs', function(glyphs, options) {
          gulp.src('./src/assets/styles/layout/myfont.css')
            .pipe(consolidate('lodash', {
              glyphs: glyphs,
              fontName: 'myfont',
              fontPath: '../fonts/',
              className: 'myfont'
            }))
            .pipe(gulp.dest('./src/assets/styles/'))
            .on('finish', cb);
        });
      },
      function handleFonts (cb) {
        iconStream
          .pipe(gulp.dest(paths.fonts.dest))
          .on('finish', cb);
      }
    ], done);   
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.scripts = scripts;
exports.watch = watch;
exports.server = server;
exports.Iconfont = Iconfont;

// default
gulp.task('default', gulp.series(
    clean,
    gulp.parallel(Iconfont, styles, templates, scripts),
    gulp.parallel(watch, server)
));