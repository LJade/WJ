var assert = require('./assert.js');
var request  = require('request');

var home = function(req, res, next) {

    var JADE_VAR = assert.getJADE();
    //判断登陆状态
    if(!req.session.user){
        res.redirect("/login");
    }

    //加载用户模块权限
    var getModules = assert.apiRequest("get","/user/myapps",req);
    //awaitList返回的请求信息
    req.query.ifJurisdiction = req.session.user.roleType;
    var nowDate = new Date();
    req.query.date = nowDate.getFullYear() + "-" + nowDate.getMonth();
    var getUserMeet = assert.apiRequest("get","/meeting/awaitList",req);

    //请求数据
    Promise.all([getModules,getUserMeet]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            //组装数据
            var modulesInfo = [];
            if(modules.code !== 1){
                res.redirect("/login");
                return;
            }
            modules.dat.apps.forEach(function (appInfo) {
                if(modulesInfo.indexOf(appInfo.groupName) === -1){
                    modulesInfo.push(appInfo.groupName);
                }
            });
            JADE_VAR.moduleGroups = modulesInfo;
            JADE_VAR.modulesInfo = modules.dat.apps;
            //日历上的会议信息
            var calendarRes = JSON.parse(results[1]);
            if(calendarRes === 1){
                var calendarList = {};
                calendarRes.dat.forEach(function (data) {
                    var meetingDay = data.startTime.split(" ")[0];
                    calendarList[meetingDay] = "会议召开";
                });
                JADE_VAR.mark = JSON.stringify({"2018-01-19":"会议召开"});
            }else{
                JADE_VAR.mark = JSON.stringify({"2018-01-19":"会议召开"});
            }
            //将权限信息写入session
            // req.session.accessManage = JSON.stringify(modules.dat.apps);
            //人物头像
            res.cookie('headIcon',req.session.user.headIcon);
            res.cookie("headName",req.session.user.userName);
            res.render('home/index', JADE_VAR);
        } else {
            JADE_VAR.message = results;
            res.render('error/error', JADE_VAR);
        }
    }).catch(function(error){
        JADE_VAR.messagae = err;
        res.render('error/error', JADE_VAR);
    })
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
