var path = require('path');
//此方法除了提供配置参数，还提供参数切换功能
var hmConfig = function () {
    // 文件相关===================================

    // 路径相关===================================
    var DIST_PATH = "./dist";
    var SASS_PATH = "./sass";

    var PUG_PATH = "./views";

    var DIST_PLUGINS_PATH = "./dist/assets/plugins";
    var DIST_CSS_PATH = "./dist/assets/css";
    var DIST_JS_PATH = "./dist/assets/js";
    var DIST_IMAGES_PATH = "./dist/assets/images";
    // 这个html路径就限制了html文件只能放在那个层级
    var DIST_HTML_PATH = "./dist/html";

    var DEV_PLUGINS_PATH = "public/plugins";
    var DEV_CSS_PATH = "public/stylesheets";
    var DEV_JS_PATH = "public/javascripts";
    var DEV_IMAGES_PATH = "public/images";
    var DEV_HTML_PATH = "public/html";
    var DEV_TESTFILES_PATH = "./test/TestFiles";

    // 其他配置======================================
    // 这个后缀就无形中规定css和js最好都要压缩
    var COMPRESSED_SUFFIX = ".min";//压缩文件后缀

    // 插件位置,用于把bower的组件移动构建（生成环境使用）
    /**
     * version:版本
     * paths:需要拷贝的文件
     */
    //提供jade模板引擎的参数
    var jade = {
        __PLUGINS_PATH__: "../" + path.relative(DEV_HTML_PATH,DEV_PLUGINS_PATH).replace("\\","/"),
        __CSS_PATH__: "../" + path.relative(DEV_HTML_PATH,DEV_CSS_PATH).replace("\\","/"),
        __JS_PATH__: "../" + path.relative(DEV_HTML_PATH,DEV_JS_PATH).replace("\\","/"),
        __IMAGES_PATH__: "../" + path.relative(DEV_HTML_PATH ,DEV_IMAGES_PATH).replace("\\","/"),
        __COMPRESSED_SUFFIX__:""
    };
    var jade_config = {
        __PLUGINS_PATH__:  path.relative(DEV_HTML_PATH,DEV_PLUGINS_PATH),
        __CSS_PATH__:  path.relative(DEV_HTML_PATH,DEV_CSS_PATH),
        __JS_PATH__: path.relative(DEV_HTML_PATH,DEV_JS_PATH),
        __IMAGES_PATH__:  path.relative(DEV_HTML_PATH ,DEV_IMAGES_PATH),
    };
    //提供给gulp的参数
    var gulp = {
        sassPath: SASS_PATH,
        cssPath: DEV_CSS_PATH,
        compressedSuffix: COMPRESSED_SUFFIX,
        cleanPathArr: [
            DEV_CSS_PATH,
            DEV_HTML_PATH,
            DEV_TESTFILES_PATH
        ],
        pugPath: PUG_PATH,
        htmlPath: DEV_HTML_PATH
    };

    //切换模式
    function switchMode(env) {
        if (env) {
            // jade模板引擎使用参数================
            jade.__PLUGINS_ROOT__ = "../../public/plugins";
            jade.__CSS_PATH__ = "../../public/stylesheets";
            jade.__JS_PATH__ = "../../public/javascripts";
            jade.__IMAGES_PATH__ = "../../public/images";
            jade.__COMPRESSED_SUFFIX__ = COMPRESSED_SUFFIX;

            // gulp配置参数====================
            gulp.cssPath = DIST_CSS_PATH;
            gulp.devJsPath = DEV_JS_PATH;
            gulp.distJsPath = DIST_JS_PATH;
            gulp.devImagePath = DEV_IMAGES_PATH;
            gulp.distImagePath = DIST_IMAGES_PATH;
            gulp.htmlPath = DIST_HTML_PATH;
            gulp.distPath = DIST_PATH;

            gulp.distPluginsPath = DIST_PLUGINS_PATH;
            gulp.devPluginsPath = DEV_PLUGINS_PATH;

            //需要清理的路径
            gulp.cleanPathArr = [DIST_PATH];

        }
    }
    return {
        init: function(env){
            switchMode(env);
        },
        jade: jade,
        gulp: gulp,
        jade_config:jade_config
    };
}();


module.exports = hmConfig;








