var gulp  = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('pug',function(){
   gulp.src('./views/**/*.pug')
       .pipe(pug({
           pretty: true
       }))
       .pipe(gulp.dest('dist'))
});
gulp.task('build',['pug','sass'],function () {
    gulp.src('./public/*')
        .pipe(gulp.dest('dist/static'))
})

gulp.task('sass',function(){
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('public/stylesheets'))
});
gulp.task('auto', function () {
    gulp.watch('./sass/*.scss', ['sass'])
});
gulp.task('default', ['sass', 'auto']);