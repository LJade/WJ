var assert = require('./assert.js');

var news_list = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken: "123123"};
    if (!req.session.user.accessToken) {
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get", "/journalism/lookUpList", req).then(function (results) {
        var newsList = JSON.parse(results);
        if (newsList.code != 1) {
            JADE_VAR.newsList = [];
        } else {
            JADE_VAR.newsList = newsList.dat.details;
            JADE_VAR.rowsCount = newsList.dat.rowsCount;
            JADE_VAR.totalPage = newsList.dat.totalPage;
        }
        res.render('news/news_list', JADE_VAR);
    })

};

var news_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken: "123123"};
    if (!req.session.user.accessToken) {
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get", "/journalism/list", req).then(function (results) {
        var newsList = JSON.parse(results);
        if (newsList.code != 1) {
            JADE_VAR.newsList = [];
        } else {
            JADE_VAR.newsList = newsList.dat.details;
            JADE_VAR.rowsCount = newsList.dat.rowsCount;
            JADE_VAR.totalPage = newsList.dat.totalPage;
        }
        res.render('news/news_manage', JADE_VAR);
    })
};

var news_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取分类
    var typeList =  assert.apiRequest("get",'/journalism/typeList',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([getAllUser,typeList]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            JADE_VAR.allUsers = modules.dat.users;
            var typeInfo = JSON.parse(results[1]);
            if(typeInfo.code == 1) {
                JADE_VAR.typeInfo = typeInfo.dat.details;
            }
        }else{
            JADE_VAR.typeInfo = [];
        }
        JADE_VAR.isRead = true;
        JADE_VAR.isEdit = true;
        JADE_VAR.journalismId = '';
        res.render('news/news_create', JADE_VAR);
    });
};

var news_detail = function (req, res, next) {

    var JADE_VAR = assert.getJADE();
    //检查新闻ID是否存在
    var journalismId = req.query.journalismId;
    if(!journalismId){
        res.render('error/error',{message:"没有找到对应的新闻ID"});
        return;
    }
    var isEdit = false;
    var edit = req.query.edit;
    if(edit && edit == 'true'){
        isEdit = true;
    }
    //获取分类
    var detailInfo =  assert.apiRequest("get",'/journalism/detail',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    var typeList =  assert.apiRequest("get",'/journalism/typeList',req);
    Promise.all([getAllUser,detailInfo,typeList]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            JADE_VAR.allUsers = modules.dat.users;
            var newsInfo = JSON.parse(results[1]);
            var typeInfo = JSON.parse(results[2]);
            JADE_VAR.typeInfo = typeInfo.dat.details;
            if(newsInfo.code == 1) {
                JADE_VAR.newsInfo = newsInfo.dat;
                JADE_VAR.journalismId = req.query.journalismId;
                JADE_VAR.lookUpPersonIds = String(newsInfo.dat.lookUpPersonId  === null ? '' : newsInfo.dat.lookUpPersonId);
                JADE_VAR.isRead = false;
                JADE_VAR.isEdit = isEdit;
                res.render('news/news_create', JADE_VAR);
            }else{
                res.render('error/error',{message:"获取新闻详情错误"});
            }
        }else{
            res.render('error/error',{message:"获取新闻详情错误"});
        }
    });
};

var news_approve = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user || !req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get",'/journalism/myApproveList',req).then(function (results) {
        var documentListInfo = JSON.parse(results);
        if(documentListInfo.code == 1){
            JADE_VAR.newsList = documentListInfo.dat.details;
            JADE_VAR.newsTotal = documentListInfo.dat.totalPage;
        }else{
            JADE_VAR.newsList = [];
            JADE_VAR.newsTotal = 0;
        }
        res.render('news/news_approve', JADE_VAR);
    });
};

var news_category = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取list列表信息
    assert.apiRequest("get", "/journalism/typeList", req).then(function (results) {
        var newsList = JSON.parse(results);
        if (newsList.code != 1) {
            JADE_VAR.typeList = [];
        } else {
            JADE_VAR.typeList = newsList.dat.details;
            JADE_VAR.rowsCount = newsList.dat.rowsCount;
            JADE_VAR.totalPage = newsList.dat.totalPage;
        }
        res.render('news/news_category', JADE_VAR);
    })
};

var save_news = function (req, res, next) {
    req = assert.getArrPost(req,'lookUpPersonId');
    var journalismId = req.body.journalismId;
    if(journalismId){
        //表示是修改
        assert.apiRequest('post','/journalism/update',req).then(function (results) {
            res.send(results);
        });
    }else{
        assert.apiRequest('post','/journalism/save',req).then(function (results) {
            res.send(results);
        });
    }

};

var news_delete = function (req, res, next) {
    req = assert.getArrPost(req,'journalismIdList');
    assert.apiRequest('post','/journalism/delete',req).then(function (results) {
        res.send(results);
    });
};

var category_delete = function (req, res, next) {
    req = assert.getArrPost(req,'journalismTypeIdList');
    assert.apiRequest('post','/journalism/typeDelete',req).then(function (results) {
        res.send(results);
    });
};

var category_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.isRead = true;
    res.render('news/category_create',JADE_VAR);
};

var category_save = function (req, res, next) {
    assert.apiRequest('post','/journalism/saveType',req).then(function (results) {
        res.send(results);
    });
};

var category_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.isRead = false;
    assert.apiRequest('get','/journalism/typeDetail',req).then(function (results) {
        var result = JSON.parse(results);
        if(result.code === 1){
            JADE_VAR.title = result.dat.typeName;
            JADE_VAR.journalismTypeId = result.dat.id;
        }else{
            JADE_VAR.title = '';
            JADE_VAR.journalismTypeId = req.query.journalismTypeId
        }
        res.render('news/category_create',JADE_VAR);
    });
};

var category_update = function (req, res, next) {
    assert.apiRequest('post','/journalism/typeUpdate',req).then(function (results) {
        res.send(results);
    });
};


module.exports = {
    news_list: news_list,
    news_manage: news_manage,
    news_create: news_create,
    news_approve: news_approve,
    news_category:news_category,
    save_news:save_news,
    news_delete:news_delete,
    category_delete:category_delete,
    category_create:category_create,
    category_save:category_save,
    category_edit:category_edit,
    category_update:category_update,
    news_detail:news_detail
};
