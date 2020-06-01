/// <binding />
const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const jsmin = require('gulp-jsmin');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
var deporder = require('gulp-deporder');

function appjs() {
    return src('source/**/*.js')
        .pipe(deporder())
        .pipe(concat('basiscore.min.js'))
        .pipe(jsmin())
        .pipe(dest('wwwroot'));
}

function libjs() {
    return src(['node_modules/alasql/dist/alasql.min.js'], { sourcemaps: true })
        .pipe(dest('wwwroot', { sourcemaps: true }));
}

function watch_js() {
    return watch('source/**/*.js', appjs);
}

exports.appjs = appjs;
exports.libjs = libjs;
exports.watch = watch_js;
