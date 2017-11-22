/**
 * Created by admin on 2016/4/19.
 */
var gulp=require('gulp');

//引入gulp组件
var sass = require('gulp-sass'),            // less
    minifycss = require('gulp-minify-css'), // CSS压缩
    rename = require('gulp-rename'),        // 重命名
    autoprefixer = require('gulp-autoprefixer'),//自动前缀
    uglify = require('gulp-uglify'),           // js压缩
    clean = require('gulp-clean'),          //清空文件夹
    notify = require('gulp-notify'),
    pug = require('gulp-pug'),
    g_data = require('gulp-data'),
    swig = require('gulp-swig'),
    g_replace = require('gulp-replace');

//工具
var argv=require('yargs').argv,//用于获取命令行参数
    _ =require('lodash'),//用于数组处理
    path=require('path');//用于路径处理

// 配置参数
var evr = argv.p || !argv.d; //生产环境为true，开发环境为false，默认为true
var mod = argv.m || 'all';//模块明，默认为全部
var hmConfig = require('./hmConfig.js');
hmConfig.init(evr);
var gulpConfig = hmConfig.gulp;

gulp.task('get_help',function () {
    console.log(' gulp build          文件打包');
    console.log(' gulp clean          文件清理');
    console.log(' gulp lessExplain    less解析');
    console.log(' gulp jsUglify       js混淆');
    console.log(' gulp imageCompress  图片压缩');
    console.log(' gulp pugExplain    jade解析');
    console.log(' gulp pugExplainRev jade解析并进行静态资源替换');
    console.log(' gulp pluginsMove    插件文件转移');
    console.log(' gulp bowerMove      bower插件移动');
    console.log(' gulp get_help           gulp参数说明');
    console.log(' gulp watch          实时监控文件改变');
    console.log(' gulp testOnce       执行一次js单元测试');
    console.log(' gulp testAndWatch   执行js单元测试并持续观察');

});

gulp.task('build',['clean'], function() {
    // 将你的默认的任务代码放在这
    if (evr) {
        return gulp.start('pugExplainRev','pluginsMove');
    }
    return gulp.start('sassExplain','pugExplain');
});

//清理文档
gulp.task('clean', function() {
    return gulp.src(gulpConfig.cleanPathArr, {read: false})
        .pipe(clean());
});

//css解析压缩
gulp.task('sassExplain', function(){
    if (evr) {
        return gulp.src(gulpConfig.sassPath+'/**/*.scss')
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(rename({suffix: gulpConfig.compressedSuffix}))
            .pipe(minifycss())
            //.pipe(rev())                  //加上MD5后缀
            //.pipe(gulp.dest(gulpConfig.cssPath))
            //.pipe(rev.manifest())         //- 生成一个rev-manifest.json
            .pipe(gulp.dest(gulpConfig.cssPath));
    }
    return gulp.src(gulpConfig.sassPath+'/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(gulpConfig.cssPath));
});

//js压缩
gulp.task('jsUglify', function() {
    if (evr) {
        return gulp.src(gulpConfig.devJsPath+'/**/*.js')
            .pipe(rename({suffix: gulpConfig.compressedSuffix}))
            .pipe(uglify())
            //.pipe(rev())
            //.pipe(gulp.dest(gulpConfig.distJsPath))
            //.pipe(rev.manifest())         //- 生成一个rev-manifest.json
            .pipe(gulp.dest(gulpConfig.distJsPath));
    }
});

//图片压缩
gulp.task('imageCompress', function() {
    if (evr) {
        return gulp.src(gulpConfig.devImagePath+'/**/*')
        //.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        //.pipe(rev())
        //.pipe(gulp.dest(gulpConfig.distImagePath))
        //.pipe(rev.manifest())
            .pipe(gulp.dest(gulpConfig.distImagePath));
    }
});

//模板引擎实践
gulp.task('pugExplain', function() {
    return gulp.src(gulpConfig.pugPath+"/**/*.pug")
        .pipe(pug({pretty: true,locals:hmConfig.jade}))
        .pipe(g_replace("__CSS_PATH__",hmConfig.jade.__CSS_ROOT__))
        .pipe(g_replace("__JS_PATH__",hmConfig.jade.__JS_ROOT__))
        .pipe(g_replace("__IMAGES_PATH__",hmConfig.jade.__IMAGES_ROOT__))
        .pipe(g_replace("__COMPRESSED_SUFFIX__",hmConfig.jade.__COMPRESSED_SUFFIX__))
        .pipe(gulp.dest(gulpConfig.htmlPath));
});

gulp.task('pugExplainRev',['sassExplain','jsUglify','imageCompress','pugExplain'], function() {
    //if (evr) {
    //    return gulp.src([gulpConfig.distPath+"/**/*.json",gulpConfig.htmlPath+"/**/*.html"])
    //        .pipe(revCollector())
    //        .pipe(gulp.dest(gulpConfig.htmlPath));
    //}
});

//自定义插件移动
gulp.task('pluginsMove', function() {
    if (evr) {
        return gulp.src(gulpConfig.devPluginsPath+"/**/*")
            .pipe(gulp.dest(gulpConfig.distPluginsPath));
    }
});
// =======================================================================
// 看守，实时刷新，只有开发环境有效
gulp.task('watch', function() {
    if (!evr) {
        // 看守所有.less档
        gulp.watch(gulpConfig.sassPath+'/**/*.scss', function(file) {
            return gulp.src(path.relative("./",file.path),{base:gulpConfig.sassPath})
                .pipe(sass())
                .pipe(autoprefixer())
                .pipe(gulp.dest(gulpConfig.cssPath))
                .pipe(notify('Update success!'));
        });
        // 看守所有.jade档
        gulp.watch(gulpConfig.pugPath+"/**/*.pug", function(file) {
            gulp.src(path.relative("./",file.path),{base:gulpConfig.pugPath})
                .pipe(pug({pretty: true,locals:hmConfig.jade}))
                .pipe(gulp.dest(gulpConfig.htmlPath))
                .pipe(notify('Update success!'));
        });
    }else{
        console.log('生成环境不提供监控功能。请尝试：gulp watch -d');
    }
});