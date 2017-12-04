
var assert = require('./assert.js');

var notice_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/announcement/lookUpList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
        }
        res.render('notice/notice_list',JADE_VAR);
    });

};

var notice_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_create',JADE_VAR);
};

var notice_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    req.query.ifJurisdiction = 1;
    //获取list列表信息
    assert.apiRequest("get",'/announcement/manageList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
        }
        res.render('notice/notice_manage',JADE_VAR);
    });
};

var notice_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/announcement/myApproveList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
        }
        res.render('notice/notice_approve',JADE_VAR);
    });

};

var notice_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    console.log(123123);
    req.body.announcementId = req.query.announcementId;
    //获取list列表信息
    assert.apiRequest("POST",'/announcement/detail',req).then(function (results) {
        console.log(123123);
        var noticeDetailInfo = JSON.parse(results);
        if(noticeDetailInfo.code === 1){
            JADE_VAR.noticeDetail = noticeDetailInfo.dat;
            JADE_VAR.announcementId = req.query.announcementId;
        }else{
            JADE_VAR.noticeDetail = {
                title:"",
                publicName:"",
                publicTime:"",
                userlist:"",
                content:''
            };
            JADE_VAR.announcementId = req.query.announcementId;
        }
        console.log(JADE_VAR);
        res.render('notice/notice_create',JADE_VAR);
    });
};

var notice_save = function (req, res, next) {
    assert.apiRequest('post','/announcement/save',req).then(function (results) {
        res.send(results);
    });
};


module.exports = {
    notice_list:notice_list,
    notice_create:notice_create,
    notice_manage:notice_manage,
    notice_approve:notice_approve,
    notice_detail:notice_detail,
    notice_save:notice_save
};
