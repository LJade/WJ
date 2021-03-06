
var assert = require('./assert.js');

var docu_list = function(req, res, next) {
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
    assert.apiRequest("get",'/commonalityArticle/lookUpList',req).then(function (results) {
        var documentListInfo = JSON.parse(results);
        if(documentListInfo.code == 1){
            JADE_VAR.doucments = documentListInfo.dat.details;
            JADE_VAR.documentsTotal = documentListInfo.dat.totalPage;
            JADE_VAR.rowsCount = documentListInfo.dat.rowsCount;
        }else{
            JADE_VAR.doucments = [];
            JADE_VAR.documentsTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('document/docu_list',JADE_VAR);
    });
};

var docu_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();

    assert.apiRequest("get",'/department/allDeptAndUser',req).then(function (results) {
        JADE_VAR.allUsers = JSON.parse(results).dat.list;
        JADE_VAR.depAll = assert.makeZTreeData([JSON.parse(results).dat.tree],[]);
        JADE_VAR.documentDetail = {
            title: "",
            publicName: "",
            publicTime: "",
            content: '',
            commonalityArticleId:''
        };
        JADE_VAR.isEdit = true;
        res.render('document/docu_create', JADE_VAR);
    });
};

var docu_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user){
        res.redirect("/login");
    }
    if(req.query.date){
        req.query.publiceTime = req.query.date;
        delete req.query.date;
    }
    //加入权限判断
    req.query.ifJurisdiction = req.session.user.ifJurisdiction;
    //获取list列表信息
    assert.apiRequest("get",'/commonalityArticle/manageList',req).then(function (results) {
        var documentListInfo = JSON.parse(results);
        if(documentListInfo.code == 1){
            JADE_VAR.doucments = documentListInfo.dat.details;
            JADE_VAR.documentsTotal = documentListInfo.dat.totalPage;
            JADE_VAR.rowsCount = documentListInfo.dat.rowsCount;
        }else{
            JADE_VAR.doucments = [];
            JADE_VAR.documentsTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('document/docu_manage',JADE_VAR);
    });
};

var docu_approve = function(req, res, next) {
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
    assert.apiRequest("get",'/commonalityArticle/myApproveList',req).then(function (results) {
        var documentListInfo = JSON.parse(results);
        if(documentListInfo.code == 1){
            JADE_VAR.doucments = documentListInfo.dat.details;
            JADE_VAR.documentsTotal = documentListInfo.dat.totalPage;
            JADE_VAR.rowsCount = documentListInfo.dat.rowsCount;
        }else{
            JADE_VAR.doucments = [];
            JADE_VAR.documentsTotal = 0;
            JADE_VAR.rowsCount = 0;
        }
        res.render('document/docu_approve',JADE_VAR);
    });
};

var docu_save = function (req, res ,next) {
    req = assert.getArrPost(req,'lookUpPersonId');
    console.log(req.body);
    if(req.body.commonalityArticleId) {
        assert.apiRequest('post','/commonalityArticle/update',req).then(function (results) {
            res.send(results);
        });
    }else{
        assert.apiRequest('post','/commonalityArticle/save',req).then(function (results) {
            res.send(results);
        });
    }
};

var docu_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'CommonalityArticleIdList');
    assert.apiRequest('post','/commonalityArticle/delete',req).then(function (results) {
        res.send(results);
    });
};

var docu_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //edit
    var isEdit = false;
    if( req.query.edit && req.query.edit === 'true'){
        isEdit = true;
    }
    //获取信息
    var documentsInfo = assert.apiRequest("get",'/commonalityArticle/detail',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([documentsInfo,getAllUser]).then(function (results) {
        var documentInfo = JSON.parse(results[0]);
        var allUsers = JSON.parse(results[1]);
        if (documentInfo.code === 1) {
            JADE_VAR.documentDetail = documentInfo.dat;
            JADE_VAR.commonalityArticleId =documentInfo.dat.commonalityArticleId;
            JADE_VAR.lookUpPersonIds = documentInfo.dat.commonalityArticleLookUpPersonId  === null ? '' : documentInfo.dat.commonalityArticleLookUpPersonId;
            JADE_VAR.allUsers = allUsers.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUsers.dat.tree],[]);
            JADE_VAR.isEdit = isEdit;
            res.render('document/docu_create', JADE_VAR);
        } else {
            res.render('error/error', JADE_VAR);
        }
    });
};

var approve_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_detail')
};


module.exports = {
    docu_list:docu_list,
    docu_create:docu_create,
    docu_manage:docu_manage,
    docu_approve:docu_approve,
    approve_detail:approve_detail,
    docu_save:docu_save,
    docu_delete:docu_delete,
    docu_detail:docu_detail
};
