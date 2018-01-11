var formidable = require("formidable");
var assert = require('./assert.js');
var request = require('request');
var fs = require("fs");

var mail_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get",'/department/allDeptAndUser',req).then(function (results) {
        JADE_VAR.allUsers = JSON.parse(results).dat.list;
        JADE_VAR.depAll = assert.makeZTreeData([JSON.parse(results).dat.tree],[]);
        JADE_VAR.mailDetail = {
            sendMailId:"",
            receivedUserIdList:"",
            sendName:"",
            title:"",
            content:"",
            sendTime:""
        };
        JADE_VAR.isEdit = true;
        JADE_VAR.lookUpPersonIds = "";
        JADE_VAR.sendMailId = "";
        res.render('mail/mail_create',JADE_VAR);
    }).catch(function (error) {
        assert.processError(error,res);
    });
};

var send_mail = function (req, res, next) {
    if(!req.session.user){
        res.send(JSON.stringify({code:-1,msg:"登陆信息获取失败"}));
        return;
    }
    var sessionId = req.session.user.accessToken;
    //获取请求上传的文件
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var formData = fields;
        formData.sendTime = new Date().format("isoDateTime").replace("T"," ");
        assert.getNowFormatDate()
        formData.receivedUserIdList = formData.receivedUserIdList.split(",");
        formData = assert.getFileArrPost(formData,"receivedUserIdList");
        var allRequests = [];
        for(var file in files){
            allRequests.push(assert.fileUpload(sessionId,files[file]))
        }
        Promise.all(allRequests).then(function (results) {
            results.forEach(function (resultUpload,index) {
                var uploadRes = JSON.parse(resultUpload);
                if(uploadRes.code === 1){
                    var key = "fileList["+index+"]";
                    formData[key] = uploadRes.dat.key;
                }
            });
            //然后汇总所有数据 请求接口
            req.body  = formData;
            assert.apiRequest("post",'/mail/save',req).then(function (saveResults) {
                res.send(saveResults);
            }).catch(function (error) {
                assert.processError(error,res);
            });
        }).catch(function (error) {
            assert.processError(error,res);
        });
    });
};

var mail_send = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get",'/mail/sendMailList',req).then(function (results) {
        JADE_VAR.mails = JSON.parse(results).dat.details;
        JADE_VAR.rowsCount = JSON.parse(results).dat.rowsCount;
        res.render('mail/mail_send',JADE_VAR);
    }).catch(function (error) {
        assert.processError(error,res);
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
    }).catch(function (error) {
        assert.processError(error,res);
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
            JADE_VAR.lookUpPersonIds = assert.getLookUpPersonIds(mailInfo.dat.receivedUserInfoList) ;
            JADE_VAR.allUsers = allUsers.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUsers.dat.tree],[]);
            JADE_VAR.isEdit = isEdit;
            res.render('mail/mail_create', JADE_VAR);
        } else {
            res.render('error/error', {message:mailInfo.msg});
        }
    }).catch(function (error) {
        assert.processError(error,res);
    });
};

var receive_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'receivedMailIdList');
    assert.apiRequest('post','/mail/deleteReceivedMail',req).then(function (results) {
        res.send(results);
    }).catch(function (error) {
        assert.processError(error,res);
    });

};

var send_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'sendMailIdList');
    assert.apiRequest('post','/mail/deleteSendMail',req).then(function (results) {
        res.send(results);
    }).catch(function (error) {
        assert.processError(error,res);
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
