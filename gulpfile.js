var gulp = require('gulp');
var gulpif = require('gulp-if');
var mustache = require("gulp-mustache");
var prettyHtml = require('gulp-pretty-html');
var less = require('gulp-less');
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var spritesmith = require('gulp.spritesmith');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function isProd() {
	return process.env === 'production';
}

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: "./dist"
		},
		port: 3000,
		open: true,
		notify: false
	});
});

gulp.task('mustache', function() {
	gulp.src('./src/templates/*.mustache')
		.pipe(mustache('./src/data.json', {extension: '.html'}, {}))
		.pipe(prettyHtml())
		.pipe(gulp.dest("./dist"))
		.pipe(reload({stream:true}));
});

gulp.task('scripts', function() {
	gulp.src([
		'./src/js/jquery/*.js',
		'./src/js/plugins/*.js',
		'./src/js/main.js',
	])
		.pipe(concat('bundle.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(isProd(), uglify()))
		.pipe(gulp.dest('./dist/js'))
		.pipe(reload({stream:true}));
});

gulp.task('images', function () {
	gulp.src('./src/img/**/*.*')
		.pipe(gulp.dest('./dist/img/'));
});

gulp.task('fonts', function () {
	gulp.src('./src/fonts/*.*')
		.pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('less', function () {
	gulp.src('./src/less/main.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(rename(function (path) {
			path.basename = "styles";
		}))
		.pipe(gulp.dest('./temp/css'))
		.pipe(reload({stream:true}));
});

gulp.task('styles', ['less'], function () {
	gulp.src([
		'./src/vendor/*.css',
		'./temp/css/*.css'
	])
		.pipe(concat('bundle.css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(reload({stream:true}));
});

gulp.task('sprite', function() {
	var spriteData =
		gulp.src('./src/img/icons/*.png')
			.pipe(plumber())
			.pipe(spritesmith({
				algorithm: 'diagonal',
				imgName: 'sprite.png',
				cssName: 'sprite.scss',
				cssFormat: 'scss',
				cssVarMap: function (sprite) {
					sprite.name = 'icon-' + sprite.name;
				},
				imgPath: '../img/sprite.png'
			}));

	spriteData.img.pipe(gulp.dest('./dist/img/'));
	spriteData.css.pipe(gulp.dest('./src/scss/'));

	return spriteData;
});

gulp.task('watcher', function() {
	gulp.watch('src/*.json', ['mustache']);
	gulp.watch('src/**/*.mustache', ['mustache']);
	gulp.watch('src/**/*.js', ['scripts']);
	gulp.watch('src/**/*.less', ['styles']);
});

gulp.task('build', [
	'mustache',
	'images',
	'sprite',
	'fonts',
	'styles',
	'scripts'
]);

gulp.task('default', [
	'mustache',
	'sprite',
	'styles',
	'scripts',
	'browserSync',
	'watcher'
]);