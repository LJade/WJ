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
    var nowDate = new Date().format('isoDate').substr(0,7);
    req.query.date = nowDate;
    var getUserMeet = assert.apiRequest("get","/meeting/awaitList",req);

    //请求数据
    Promise.all([getModules,getUserMeet]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            //组装数据
            var modulesInfo = {};
            modulesInfo.groupArr = [];
            modulesInfo.groupNameArr = [];
            if(modules.code !== 1){
                res.redirect("/login");
                return;
            }
            modules.dat.apps.forEach(function (appInfo) {
                if(modulesInfo.groupNameArr.indexOf(appInfo.groupName) === -1){
                    modulesInfo.groupNameArr.push(appInfo.groupName);
                    modulesInfo.groupArr.push({groupId:appInfo.groupId,groupName:appInfo.groupName});
                }
            });
            JADE_VAR.moduleGroups = modulesInfo;
            //那些没有应用的groups
            var noAppGroups = [];
            modules.dat.groups.forEach(function (groupInfo) {
                if(modulesInfo.groupNameArr.indexOf(groupInfo.groupName) === -1){
                    noAppGroups.push(groupInfo);
                }
            });
            JADE_VAR.modulesInfo = modules.dat.apps;
            JADE_VAR.noAppGroups = noAppGroups;
            //日历上的会议信息
            var calendarRes = JSON.parse(results[1]);
            var meetingDay = {"2018-01-19":"会议召开"};
            if(calendarRes === 1){
                var calendarList = {};
                calendarRes.dat.forEach(function (data) {
                    meetingDay = data.startTime.split(" ")[0];
                    calendarList[meetingDay] = "会议召开";
                });
                JADE_VAR.mark = JSON.stringify(meetingDay);
            }else{
                JADE_VAR.mark = JSON.stringify(meetingDay);
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
        assert.processError(error,res);
    })
};

var add_application = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get","/user/myappsAll",req).then(function (results) {
        var appsRes = JSON.parse(results);

    });
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
