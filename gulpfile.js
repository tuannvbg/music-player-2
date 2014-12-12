(function () {
    'use strict';

    var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint');

    // JSHint
    gulp.task('lint', function() {
        return gulp.src()
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    });

    // Uglify
    gulp.task('compress', function() {
      gulp.src(['app/app.js', 'app/config.js', 'app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
    });

})();