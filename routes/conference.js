
var assert = require('./assert.js');

var con_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_approve',JADE_VAR);
};

var con_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_create',JADE_VAR);
};

var con_history = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/historyMeetingList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
        }
        res.render('conference/con_history',JADE_VAR);
    });
};

var con_summary = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/summaryList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
        }
        res.render('conference/con_summary',JADE_VAR);
    });
};

var con_summary_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/summaryList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
        }
        res.render('conference/con_summary_detail',JADE_VAR);
    });

};

var con_sign = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_sign',JADE_VAR);
};

var con_apply = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //传入管理员信息
    req.query['ifJurisdiction'] = 1;
    //获取list列表信息
    assert.apiRequest("get",'/meeting/meetingList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
        }
        res.render('conference/con_apply',JADE_VAR);
    });
};

var con_room = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/meetingRoomList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            res.render('conference/con_room',JADE_VAR);
        }else{
            res.render("error/error",{message:conferenceListInfo.msg})
        }
    });
};

var con_room_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/create_room',JADE_VAR);
};

var con_room_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get','/meeting/meetingRoomDetail',req).then(function (results) {
        var roomInfo = JSON.parse(results);
        if(roomInfo.code == 1){
            JADE_VAR.roomInfo = roomInfo.dat;
            res.render('/conference/con_room_create',JADE_VAR);
        }else{
            res.render("error/error",{message:roomInfo.msg})
        }
    });
};

var con_room_resource = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/resourceList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.resLists = conferenceListInfo.dat.details;
            JADE_VAR.resTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.resLists = [];
            JADE_VAR.resTotal = 0;
        }
        res.render('conference/con_room_resource',JADE_VAR);
    });
};



module.exports = {
    con_approve:con_approve,
    con_create:con_create,
    con_history:con_history,
    con_summary:con_summary,
    con_sign:con_sign,
    con_apply:con_apply,
    con_room:con_room,
    con_room_resource:con_room_resource,
    con_summary_detail:con_summary_detail,
    con_room_create:con_room_create,
    con_room_edit:con_room_edit
};
