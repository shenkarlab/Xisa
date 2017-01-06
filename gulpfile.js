//gulp.js config

var gulp 		= require('gulp'),
	imagemin 	= require('gulp-imagemin'),
	newer		= require('gulp-newer'),
	ngmin 		= require('gulp-ngmin'),
	sass		= require('gulp-sass'),
	htmlclean 	= require('gulp-htmlclean'),
	preprocess 	= require('gulp-preprocess'),
	pkg			= require('./package.json'); 

//file location
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() != 'production')
	source = 'source/',
	dest   = 'build/',
	images = {
		in: source + 'images/*.*',
		out: dest + 'images/'
	};
	html = {
		in: source + '*.html',
		watch: [source + '*.html', source + 'template/**/*'],
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
    	in: source + 'scripts/*.js',
    	out: dest + 'scripts/*.js'
    };

//images task
gulp.task('images', function(){
	return gulp.src(images.in)
	.pipe(newer(images.out))
	.pipe(imagemin())
	.pipe(gulp.dest(images.out));
});

//build HTML files
gulp.task('html',function() { 
	var page = gulp.src(html.in)
	.pipe(preprocess({context: html.context}));
	if(!devBuild){
		page = page.pipe(htmlclean());
	}
	return page.pipe(gulp.dest(html.out));
});

//build css files
gulp.task('sass', function(){
	return gulp.src(css.in)
	.pipe(sass(css.sassOpts))
	.pipe(gulp.dest(css.out));
});

//build js files
gulp.task('js', function () {
    return gulp.src(js.in)
        .pipe(ngmin({dynamic: true}))
        .pipe(gulp.dest(js.out));
});

//default task
gulp.task('default', ['html','sass','js','images'], function(){

	//html changes
	gulp.watch(html.watch, ['html']);

	//sass changes
	gulp.watch(css.watch, ['sass'])

	//js changes
	gulp.watch(js.in, ['js']);

	//images changes
	gulp.watch(images.in, ['images']);
});