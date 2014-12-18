(function () {
    'use strict';

    var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint');

    var jsFiles = [
        'assets/components/angular/angular.js',
        'assets/components/angular-route/angular-route.js',
        'assets/components/ng-deezer-sdk/deezer.js',
        'app/app.js',
        'app/config.js',
        'app/**/*.js'];

    // JSHint
    gulp.task('lint', function() {
        gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    });

    // LESS
    gulp.task('less', function() {
        gulp.src('assets/less/style.less')
            .pipe(less())
            .pipe(gulp.dest('assets/css'));
    });

    // Uglify
    gulp.task('compress', function() {
      gulp.src(jsFiles)
        .pipe(concat('app.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
    });

    // Watch
    gulp.task('watch', function() {
        watch('assets/less/**/*.less', function(){
            gulp.start('less');
        });

        watch(['app/app.js', 'app/config.js', 'app/**/*.js'], function(){
            gulp.start('compress');
            livereload();
        });
    });

    gulp.task('build', ['lint', 'compress', 'less']);
    gulp.task('default', ['compress', 'less', 'watch']);

})();