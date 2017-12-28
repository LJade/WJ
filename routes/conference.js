
var assert = require('./assert.js');

var con_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();

    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.startTime = req.query.date;
        delete req.query.date;
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/myApproveList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
            if(JADE_VAR.confercences.length === 0) {
                JADE_VAR.confercences = [{
                    "meetingId": "12",
                    "title": "这是一个主题",
                    "startTime": "2017-11-16",
                    "endTime": "2017-11-17",
                    "summaryContent": "会议纪要内容哈哈",
                    "approveStatus": "1",
                    "flowApproveUserId": "56"
                }];
                JADE_VAR.rowsCount = 0;
            }
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_approve',JADE_VAR);
    });
};

var con_approve_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user || !req.session.user.accessToken){
        res.redirect("/login");
    }
    assert.apiRequest("get","/meeting/myApproveDetail",req).then(function (results) {
        var approveInfoRes = JSON.parse(results);
        if(approveInfoRes.code === 1){
            JADE_VAR.approveInfo = approveInfoRes.dat;
            res.render("conference/con_approve_detail",JADE_VAR);
        }else{
            res.render("error/error",{message:approveInfoRes.msg});
        }
    })
};

var con_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取分类
    var meetingRoom =  assert.apiRequest("get",'/meeting/meetingRoomList',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([getAllUser,meetingRoom]).then(function (results) {
        var modules = JSON.parse(results[0]);
        JADE_VAR.allUsers = modules.dat.list;
        JADE_VAR.depAll = assert.makeZTreeData([modules.dat.tree],[]);
        var meetingRoom = JSON.parse(results[1]);
        if(meetingRoom.code == 1) {
            JADE_VAR.meetingRooms = meetingRoom.dat.details;
        }else{
            JADE_VAR.meetingRooms = [];
        }
        JADE_VAR.conferenceDetail = {
            "meetingId": "",
            "title": "",
            "startTime": "",
            "endTime": "",
            "summaryContent": "",
            "meetingCreateUserId": "",
            "withConferencePeopleId": "",
            "meetingRoomName": "",
            "meetingRoomResource": "",
            "summaryPeopleId": "",
            "meetingContent": ""
        };
        JADE_VAR.isEdit = true;
        JADE_VAR.meetingId = "";
        res.render('conference/con_create',JADE_VAR);
    });

};

var con_history = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.startTime = req.query.date;
        delete req.query.date;
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/historyMeetingList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_history',JADE_VAR);
    });
};

var con_summary = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.startTime = req.query.date;
        delete req.query.date;
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/summaryList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_summary',JADE_VAR);
    });
};

var con_summary_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
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
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/meetingSignInList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_sign',JADE_VAR);
    });

};

var con_apply = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.startTime = req.query.date;
        delete req.query.date;
    }
    //传入管理员信息
    req.query['ifJurisdiction'] = req.session.user.roleType;
    //获取list列表信息
    assert.apiRequest("get",'/meeting/meetingList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
        }else{
            JADE_VAR.confercences = [];
            JADE_VAR.confercenceTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_apply',JADE_VAR);
    });
};

var con_room = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/meetingRoomList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.confercences = conferenceListInfo.dat.details;
            JADE_VAR.confercenceTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
            res.render('conference/con_room',JADE_VAR);
        }else{
            res.render("error/error",{message:conferenceListInfo.msg})
        }
    });
};

var con_room_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.roomDetail = {
        id:"",
        name:"",
        accommodatePeopleNumber:"",
        meetingRoomResource:""
    };
    JADE_VAR.isEdit = true;
    res.render('conference/con_create_room',JADE_VAR);
};

var con_room_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get','/meeting/meetingRoomDetail',req).then(function (results) {
        var roomInfo = JSON.parse(results);
        if(roomInfo.code == 1){
            JADE_VAR.roomInfo = roomInfo.dat;
            res.render('/conference/create_room',JADE_VAR);
        }else{
            res.render("error/error",{message:roomInfo.msg})
        }
    });
};

var con_room_resource = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆

    if(!req.session.user){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/meeting/resourceList',req).then(function (results) {
        var conferenceListInfo = JSON.parse(results);
        if(conferenceListInfo.code == 1){
            JADE_VAR.resLists = conferenceListInfo.dat.details;
            JADE_VAR.resTotal = conferenceListInfo.dat.totalPage;
            JADE_VAR.rowsCount = conferenceListInfo.dat.rowsCount;
        }else{
            JADE_VAR.resLists = [];
            JADE_VAR.resTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('conference/con_room_resource',JADE_VAR);
    });
};

var con_save = function (req, res, next) {
    assert.apiRequest('post','/meeting/saveMeeting',req).then(function (results) {
        res.send(results);
    });
};

var con_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'meetingIdList');
    assert.apiRequest('post','/meeting/deleteMeeting',req).then(function (results) {
        res.send(results);
    });
};

var con_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //edit
    var isEdit = false;
    if( req.query.edit && req.query.edit === 'true'){
        isEdit = true;
    }
    //获取信息
    var conferencesInfo = assert.apiRequest("get",'/meeting/meetingDetail',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    var meetingRoom =  assert.apiRequest("get",'/meeting/meetingRoomList',req);
    Promise.all([conferencesInfo,getAllUser,meetingRoom]).then(function (results) {
        var conferenceInfo = JSON.parse(results[0]);
        var allUsers = JSON.parse(results[1]);
        var meetingRooms = JSON.parse(results[2]);
        if (conferenceInfo.code === 1) {
            JADE_VAR.conferenceDetail = conferenceInfo.dat;
            JADE_VAR.meetingId =conferenceInfo.dat.meetingId;
            JADE_VAR.lookUpPersonIds = conferenceInfo.dat.receivedUserIdList  === null ? '' : conferenceInfo.dat.receivedUserIdList;
            JADE_VAR.allUsers = allUsers.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUsers.dat.tree],[]);
            JADE_VAR.meetingRooms = meetingRooms.dat.details;
            JADE_VAR.isEdit = isEdit;
            res.render('conference/con_create', JADE_VAR);
        } else {
            res.render('error/error', JADE_VAR);
        }
    });
};

var con_room_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'idList');
    assert.apiRequest('post','/meeting/deleteMeetingRoom',req).then(function (results) {
        res.send(results);
    });
}

var con_room_save = function (req,res,next) {
    var roomID = req.body.id;
    if(roomID){
        assert.apiRequest('post','/meeting/updateMeetingRoom',req).then(function (results) {
            res.send(results);
        });
    }else{
        assert.apiRequest('post','/meeting/saveMeetingRoom',req).then(function (results) {
            res.send(results);
        });
    }

};

var con_room_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //edit
    var isEdit = false;
    if( req.query.edit && req.query.edit === 'true'){
        isEdit = true;
    }
    assert.apiRequest('get','/meeting/meetingRoomDetail',req).then(function (results) {
        var roomInfo = JSON.parse(results);
        if(roomInfo.code == 1){
            JADE_VAR.roomDetail = roomInfo.dat;
            JADE_VAR.isEdit = isEdit;
            res.render('conference/con_create_room',JADE_VAR);
        }else{
            res.render("error/error",{message:roomInfo.msg})
        }
    });
};

var con_room_resource_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render("conference/con_room_resource_create",JADE_VAR);
};

var con_room_resource_save = function (req, res, next) {
    assert.apiRequest('post',"/meeting/saveResource",req).then(function (results) {
        var resOBj = JSON.parse(results);
        if(resOBj.code === 1){
            res.redirect("/conference/con_room_resource");
        }else{
            res.render("error/error",{message:resOBj.msg});
        }
    })
};

module.exports = {
    con_approve:con_approve,
    con_approve_detail:con_approve_detail,
    con_create:con_create,
    con_history:con_history,
    con_summary:con_summary,
    con_sign:con_sign,
    con_apply:con_apply,
    con_room:con_room,
    con_room_resource:con_room_resource,
    con_room_resource_create:con_room_resource_create,
    con_room_resource_edit:con_room_resource_create,
    con_room_resource_save:con_room_resource_save,
    con_summary_detail:con_summary_detail,
    con_room_create:con_room_create,
    con_room_edit:con_room_edit,
    con_save:con_save,
    con_delete:con_delete,
    con_detail:con_detail,
    con_room_delete:con_room_delete,
    con_room_save:con_room_save,
    con_room_detail:con_room_detail
};
