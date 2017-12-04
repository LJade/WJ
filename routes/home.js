var assert = require('./assert.js');
var request  = require('request');

var home = function(req, res, next) {
    var JADE_VAR = assert.getJADE();

    //判断登陆状态
    if(!req.session.user){
        res.redirect("/login");
    }

    //加载用户模块权限
    var getModules = assert.apiRequest("get","/user/myModule",req);
    var getUserMeet = assert.apiRequest("get","/",req);
    var getNoticeNum = assert.apiRequest("get","/",req);

    //请求数据
    Promise.all([getModules]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            //TODO 需要页面加载的变量
            JADE_VAR.modulesIcon = assert.modulesIcon;
            JADE_VAR.modulesInfo = modules.dat;
            //将权限信息写入session
            req.session.user.accessManage = JSON.stringify(modules.dat);
            //渲染页面
            res.render('home/index', JADE_VAR);
        } else {
            JADE_VAR.message = results;
            res.render('error/error', JADE_VAR);
        }
    }, function (error, err) {
        JADE_VAR.messagae = err;
        res.render('error/error', JADE_VAR);
    });
};

var add_application = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/add_application',JADE_VAR);
};

var version = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/version',JADE_VAR);
};

var statistics = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/statistics',JADE_VAR);
};

var startPage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/start',JADE_VAR);
};


module.exports = {
    home:home,
    add_application:add_application,
    version:version,
    statistics:statistics,
    startPage:startPage
};
