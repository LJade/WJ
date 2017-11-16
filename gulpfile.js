var gulp  = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');

gulp.task('pug',function(){
   gulp.src('./views/**/*.pug')
       .pipe(pug({
           pretty: true
       }))
       .pipe(gulp.dest('dist'))
});
gulp.task('build',['pug','sassExplain'],function () {
    gulp.src('./public/images/*')
        .pipe(gulp.dest('dist/images'))
})
gulp.task('sassExplain',function(){
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/stylesheets'))
});

gulp.task('sass',function(){
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets'))
});
gulp.task('auto', function () {
    gulp.watch('./sass/*.scss', ['sass'])
});
gulp.task('default', ['sass', 'auto']);