const gulp = require('gulp');
const pug = require('gulp-pug');

const path = {
    root: '.build',
    templates: {
        pages: 'src/views/pages/*.pug',
        src: 'src/views/**/*.pug',
        dest: 'build/'
    }
}

//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(path.root));
}

exports.templates = templates;