
var assert = require('./assert.js');

var docu_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/commonalityArticle/lookUpList',req).then(function (results) {
        var documentListInfo = JSON.parse(results);
        if(documentListInfo.code == 1){
            JADE_VAR.doucments = documentListInfo.dat.details;
            JADE_VAR.documentsTotal = documentListInfo.dat.totalPage;
        }else{
            JADE_VAR.doucments = [];
            JADE_VAR.documentsTotal = 0;
        }
        res.render('document/docu_list',JADE_VAR);
    });
};

var docu_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();

    assert.apiRequest("get",'/department/allDeptAndUser',req).then(function (results) {
        JADE_VAR.allUsers = JSON.parse(results).dat.users;
        JADE_VAR.noticeDetail = {
            title: "",
            publicName: "",
            publicTime: "",
            userlist: "",
            content: ''
        };
        JADE_VAR.announcementId = "";
        res.render('document/docu_create', JADE_VAR);
    });
};

var docu_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_manage',JADE_VAR);
};

var docu_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_approve',JADE_VAR);
};

var docu_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_detail',JADE_VAR);
};

var docu_save = function (req, res ,next) {
    req = assert.getArrPost(req,'lookUpPersonId');
    assert.apiRequest('post','/commonalityArticle/save',req).then(function (results) {
        res.send(results);
    });

};


module.exports = {
    docu_list:docu_list,
    docu_create:docu_create,
    docu_manage:docu_manage,
    docu_approve:docu_approve,
    docu_detail:docu_detail,
    docu_save:docu_save
};
