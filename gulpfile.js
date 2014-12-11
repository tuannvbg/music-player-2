var gulp = require('gulp'),
    jshint = require('gulp-jshint');

// JSHint
gulp.task('lint', function() {
    return gulp.src()
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});