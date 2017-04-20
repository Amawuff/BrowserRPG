//get required packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    htmlhint = require('gulp-htmlhint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    imagemin = require('gulp-imagemin'),
    htmlreplace = require('gulp-html-replace'),
    sourcemaps = require('gulp-sourcemaps');

// Define the default task and add the watch task to it.
gulp.task('default', ['watch']);

// Reports any syntax issues in the source js.
gulp.task('jshint', function() {
    // Find all the js files in source.
    return gulp.src('source/js/**/*.js')
        // Give them to jshint.
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Reports any syntax issues in the source js.
gulp.task('htmlhint', function() {
    // Find all the js files in source.
    return gulp.src('source/**/*.html')
        // Give them to jshint.
        .pipe(htmlhint())
        .pipe(htmlhint.reporter('htmlhint-stylish'));
});



// Compiles SCSS to CSS, Concats and Uglify.
gulp.task('build-css', function() {
    // Find all the scss files in source.
    return gulp.src('source/scss/**/*.scss')
        // Process original sources for sourcemap
        .pipe(sourcemaps.init())
        // Give them to sass.
        .pipe(sass())
        // Concat.
        .pipe(concat('styles.min.css'))
        //uglify css
        .pipe(uglifycss())
        // Add the map to modified source.
        .pipe(sourcemaps.write())
        // Send results to dist
        .pipe(gulp.dest('dist/css'))

});

// Concats JS and  Uglify.
gulp.task('build-js', function() {
    // Find all the js files in source.
    return gulp.src('source/javascript/**/*.js')
        // Process original sources for sourcemap
        .pipe(sourcemaps.init())
        // Concat.
        .pipe(concat('bundle.min.js'))
        //uglify js
        .pipe(uglify())
        // Add the map to modified source.
        .pipe(sourcemaps.write())
        // Send results to dist
        .pipe(gulp.dest('dist/js'))


});

// Build HTML
gulp.task('build-html', function() {
    // Find all the html files in source.
    return gulp.src('source/*.html')
        //Change any css/js references to use bundled/uglified versions 
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/bundle.min.js'
        }))
        // Move to dist.
        .pipe(gulp.dest('dist'))
});

// Optimize Images using imagemin
gulp.task('build-images', function() {
    // Find all images in Source
    return gulp.src('source/assets/images/**/*.{png,gif,jpg,svg}')
        //imagemin
        .pipe(imagemin(), { verbose: true })
        // Send results to dist
        .pipe(gulp.dest('dist/assets/images'))
})

// Command to execute all build commands
gulp.task('build-all', ['build-js', 'build-css', 'build-images', 'build-html']);

// Configure which files to watch and what tasks to use on file changes.
gulp.task('watch', function() {
    // Watch for JS.
    gulp.watch('source/js/**/*.js', ['build-js', 'jshint']);
    // Watch for SCSS.
    gulp.watch('source/scss/**/*.scss', ['build-css']);
    // Watch for Images.
    gulp.watch('source/assets/images/**/*.{png,gif,jpg,svg}', ['build-images']);
    // Watch for HTML.
    gulp.watch('source/**/*.html', ['build-html', 'htmlhint']);
});
