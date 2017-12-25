
var assert = require('./assert.js');

var mail_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get",'/department/allDeptAndUser',req).then(function (results) {
        JADE_VAR.allUsers = JSON.parse(results).dat.users;
        JADE_VAR.mailDetail = {
            sendMailId:"",
            receivedUserIdList:"",
            sendName:"",
            title:"",
            content:"",
            sendTime:""
        };
        JADE_VAR.isEdit = true;
        JADE_VAR.sendMailId = "";
        res.render('mail/mail_create',JADE_VAR);
    });
};

var send_mail = function (req, res, next) {
    req = assert.getArrPost(req,'receivedUserIdList');
    assert.apiRequest('post','/mail/save',req).then(function (results) {
        res.send(results);
    });
};

var mail_send = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get",'/mail/sendMailList',req).then(function (results) {
        JADE_VAR.mails = JSON.parse(results).dat.details;
        JADE_VAR.rowsCount = JSON.parse(results).dat.rowsCount;
        res.render('mail/mail_send',JADE_VAR);
    });
};

var mail_receive = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(req.query.date){
        req.query.sendTime = req.query.date;
        delete req.query.date;
    }
    assert.apiRequest("get",'/mail/receivedMailList',req).then(function (results) {
        JADE_VAR.mails = JSON.parse(results).dat.details;
        JADE_VAR.rowsCount = JSON.parse(results).dat.rowsCount;
        res.render('mail/mail_receive',JADE_VAR);
    });
};

var mail_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //edit
    var isEdit = false;
    if( req.query.edit && req.query.edit === 'true'){
        isEdit = true;
    }
    //获取信息
    var mailsInfo = assert.apiRequest("get",'/mail/detail',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([mailsInfo,getAllUser]).then(function (results) {
        var mailInfo = JSON.parse(results[0]);
        var allUsers = JSON.parse(results[1]);
        if (mailInfo.code === 1) {
            JADE_VAR.mailDetail = mailInfo.dat;
            JADE_VAR.sendMailId =mailInfo.dat.sendMailId;
            JADE_VAR.lookUpPersonIds = mailInfo.dat.receivedUserIdList  === null ? '' : mailInfo.dat.receivedUserIdList;
            JADE_VAR.allUsers = allUsers.dat.users;
            JADE_VAR.isEdit = isEdit;
            res.render('mail/mail_create', JADE_VAR);
        } else {
            res.render('error/error', JADE_VAR);
        }
    });
};

var receive_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'receivedMailIdList');
    assert.apiRequest('post','/mail/deleteReceivedMail',req).then(function (results) {
        res.send(results);
    });

};

var send_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'sendMailIdList');
    assert.apiRequest('post','/mail/deleteSendMail',req).then(function (results) {
        res.send(results);
    });
};



module.exports = {
    mail_create:mail_create,
    mail_send:mail_send,
    mail_receive:mail_receive,
    send_mail:send_mail,
    mail_detail:mail_detail,
    send_delete:send_delete,
    receive_delete:receive_delete
};
