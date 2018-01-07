
var assert = require('./assert.js');

var notice_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.publiceTime = req.query.date;
        delete req.query.date;
    }
    //获取list列表信息
    assert.apiRequest("get",'/announcement/lookUpList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
            JADE_VAR.rowsCount = noticeListInfo.dat.rowsCount;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('notice/notice_list',JADE_VAR);
    });

};

var notice_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.announcementId){
        //获取信息
        var getAnnouncement = assert.apiRequest("get",'/announcement/detail',req);
        var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
        Promise.all([getAnnouncement,getAllUser]).then(function (results) {
            var noticeDetailInfo = JSON.parse(results[0]);
            if (noticeDetailInfo.code === 1) {
                JADE_VAR.noticeDetail = noticeDetailInfo.dat;
                JADE_VAR.announcementId = req.query.announcementId;
                JADE_VAR.lookUpPersonIds = noticeDetailInfo.dat.announcementLookUpPersonId  === null ? '' : noticeDetailInfo.dat.announcementLookUpPersonId;
            } else {
                JADE_VAR.noticeDetail = {
                    title: "",
                    publicName: "",
                    publicTime: "",
                    userlist: "",
                    content: ''
                };
                JADE_VAR.announcementId = "";
            }
            var allUsers = JSON.parse(results[1]);
            JADE_VAR.allUsers = allUsers.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUsers.dat.tree],[]);
            if(req.query.edit && req.query.edit === 'true'){
                JADE_VAR.isEdit = true;
            }else{
                JADE_VAR.isEdit = false;
            }
            res.render('notice/notice_create', JADE_VAR);
        });
    }else{
        assert.apiRequest("get",'/department/allDeptAndUser',req).then(function (results) {
            JADE_VAR.allUsers = JSON.parse(results).dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([JSON.parse(results).dat.tree],[]);
            JADE_VAR.noticeDetail = {
                title: "",
                publicName: "",
                publicTime: "",
                userList: "",
                content: ''
            };
            JADE_VAR.announcementId = "";
            JADE_VAR.isEdit = true;
            res.render('notice/notice_create', JADE_VAR);
        })
    }
};

var notice_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.publiceTime = req.query.date;
        delete req.query.date;
    }
    req.query.ifJurisdiction = req.session.user.roleType;
    //获取list列表信息
    assert.apiRequest("get",'/announcement/manageList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
            JADE_VAR.rowsCount = noticeListInfo.dat.rowsCount;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('notice/notice_manage',JADE_VAR);
    });
};

var notice_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.publiceTime = req.query.date;
        delete req.query.date;
    }
    //获取list列表信息
    assert.apiRequest("get",'/announcement/myApproveList',req).then(function (results) {
        var noticeListInfo = JSON.parse(results);
        if(noticeListInfo.code === 1){
            if(noticeListInfo.dat.details.length === 0) {
                noticeListInfo.dat.details = [
                    {
                        "announcementId": "公告id",
                        "announcementLookUpPersonId": null,
                        "flowApproveUserId": "6",
                        "title": "主题",
                        "publicName": "发布人姓名",
                        "publicTime": "发布时间 2017-11-13",
                        "lookUpPersonId": null,
                        "content": "内容",
                        "approveStatus": "0",
                        "ifJurisdiction": null,
                        "userId": null,
                        "userList": null,
                        "readStatus": null
                    }
                ];
            }
            JADE_VAR.noticesList = noticeListInfo.dat.details;
            JADE_VAR.noticeTotal = noticeListInfo.dat.totalPage;
            JADE_VAR.rowsCount = noticeListInfo.dat.rowsCount;
        }else{
            JADE_VAR.noticesList = [];
            JADE_VAR.noticeTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('notice/notice_approve',JADE_VAR);
    });

};

var notice_save = function (req, res, next) {
    req = assert.getArrPost(req,'lookUpPersonId');
    assert.apiRequest('post','/announcement/save',req).then(function (results) {
        res.send(results);
    });
};

var notice_delete = function (req, res, next) {
    req = assert.getArrPost(req,'announcementIdList');
    assert.apiRequest('post','/announcement/delete',req).then(function (results) {
        res.send(results);
    });
};

var notice_approve_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user || !req.session.user.accessToken){
        res.redirect("/login");
    }
    assert.apiRequest("get","/announcement/myApproveDetail",req).then(function (results) {
        var approveInfoRes = JSON.parse(results);
        if(approveInfoRes.code === 1 && approveInfoRes.dat !== null){
            JADE_VAR.approveInfo = approveInfoRes.dat;
            res.render("notice/notice_approve_detail",JADE_VAR);
        }else{
            res.render("error/error",{message:approveInfoRes.msg});
        }
    })

};

module.exports = {
    notice_list:notice_list,
    notice_create:notice_create,
    notice_manage:notice_manage,
    notice_approve:notice_approve,
    notice_detail:notice_create,
    notice_save:notice_save,
    notice_delete:notice_delete,
    notice_approve_detail:notice_approve_detail
};
