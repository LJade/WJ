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
    // var getUserMeet = assert.apiRequest("get","/",req);
    // var getNoticeNum = assert.apiRequest("get","/",req);

    //请求数据
    Promise.all([getModules]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            //组装数据
            var modulesInfo = [];
            modules.dat.apps = [
                {
                    "groupName": "日常办公",
                    "name": "智慧港航",
                    "icon": "default-icon",
                    "id": "256eb2a515f54e1ab52f5a938f8301f5",
                    "openType": 2,
                    "url": "https://www.baidu.com",
                    "extParam": null
                },
                {
                    "groupName": "日常办公",
                    "name": "系统管理",
                    "icon": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0",
                    "id": "sys_manage",
                    "openType": 2,
                    "url": "",
                    "extParam": null
                },
                {
                    "groupName": "日常办公",
                    "name": "新闻",
                    "icon": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0",
                    "id": "news",
                    "openType": 2,
                    "url": "jtj://news/news_list",
                    "extParam": null
                },
                {
                    "groupName": "日常办公",
                    "name": "公告",
                    "icon": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0",
                    "id": "notice",
                    "openType": 2,
                    "url": "jtj://notice/notice_list",
                    "extParam": null
                },
                {
                    "groupName": "日常办公",
                    "name": "公文",
                    "icon": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0",
                    "id": "document",
                    "openType": 2,
                    "url": "jtj://docu/docu_list",
                    "extParam": null
                },
                {
                    "groupName": "日常办公",
                    "name": "邮箱",
                    "icon": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0",
                    "id": "mail",
                    "openType": 2,
                    "url": "jtj://mail/mail_create",
                    "extParam": null
                }
            ];
            modules.dat.apps.forEach(function (appInfo) {
                if(modulesInfo.indexOf(appInfo.groupName) === -1){
                    modulesInfo.push(appInfo.groupName);
                }
            });
            JADE_VAR.moduleGroups = modulesInfo;
            JADE_VAR.modulesInfo = modules.dat.apps;
            //人物头像
            //将权限信息写入session
            req.session.accessManage = JSON.stringify(modules.dat.apps);
            //渲染页面
            res.cookie('headIcon',req.session.user.headIcon);
            res.cookie("headName",req.session.user.userName);
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
