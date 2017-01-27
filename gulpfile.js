//gulp.js config

var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    minify = require('gulp-minify'),
    sass = require('gulp-sass'),
    htmlclean = require('gulp-htmlclean'),
    preprocess = require('gulp-preprocess'),
    pkg = require('./package.json');

//file location
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() != 'production'),
    source = 'source/',
    dest = 'build/',
    images = {
        in: source + 'images/*.*',
        out: dest + 'images/'
    },
    html = {
        in: source + '*.html',
        watch: [source + '*.html'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version
        }
    },
    templates = {
        in: source + 'templates/*.*',
        watch: [source + 'templates/**/*'],
        out: dest,
        context: {
            devBuild: devBuild,
            author: pkg.author,
            version: pkg.version
        }
    },
    css = {
        in: source + 'scss/*.*',
        watch: [source + 'scss/**/*'],
        out: dest + 'css/'
    },
    js = {
        in: source + 'scripts/*.*',
        watch: [source + 'scripts/*'],
        out: dest + 'scripts/'
    };

//images task
gulp.task('images', function () {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out));
});

//build HTML files
gulp.task('html', function () {
    return gulp.src(html.in)
        .pipe(preprocess({context: html.context}))
        .pipe(htmlclean())
        .pipe(gulp.dest(html.out));
});

//build TEMPLATE files
gulp.task('templates', function () {
    return gulp.src(templates.in)
        .pipe(preprocess({context: html.context}))
        .pipe(htmlclean())
        .pipe(gulp.dest(html.out));
});

//build css files
gulp.task('sass', function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

//build js files
gulp.task('js', function () {
    return gulp.src(js.in)
    // .pipe(minify({
    //     ignoreFiles: [
    //     '*.min.js'
    //     ]
    // }))
        .pipe(gulp.dest(js.out));
});

//default task
gulp.task('default', ['html', 'templates', 'sass', 'js', 'images'], function () {

    //html changes
    gulp.watch(html.watch, ['html']);
    gulp.watch(html.watch, ['templates']);

    //sass changes
    gulp.watch(css.watch, ['sass']);

    //js changes
    gulp.watch(js.watch, ['js']);

    //images changes
    gulp.watch(images.in, ['images']);
});