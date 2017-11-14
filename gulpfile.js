var gulp  = require('gulp');
var sass = require('gulp-sass');
//var jade = require('gulp-jade');

// gulp.task('jade',function(){
//    gulp.src('./views/**/*.jade')
//        .pipe(jade({
//            pretty: true
//        }))
//        .pipe(gulp.dest('public'))
// });

gulp.task('sass',function(){
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets'))
});
gulp.task('auto', function () {
    gulp.watch('./sass/*.scss', ['sass'])
});
gulp.task('default', ['sass', 'auto']);