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
    assert.apiRequest("get",'/journalism/typeList',req).then(function (results) {
        var typeInfo = JSON.parse(results);
        if(typeInfo.code == 1){
            JADE_VAR.typeInfo = typeInfo.dat.details;
        }else{
            JADE_VAR.typeInfo = [];
        }
        console.log(JADE_VAR);
        res.render('news/news_create', JADE_VAR);
    });
};

var news_approve = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //检查登陆
    if(!req.session.user.accessToken){
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
    //检查登陆
    req.session.user = {accessToken: "123123"};
    if (!req.session.user.accessToken) {
        res.redirect("/login");
    }
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
    req.session.user = {};
    req.session.user.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIwIiwiaXNzIjoiV0pKVEoiLCJleHAiOjE1MTI0MDQyMjAsImlhdCI6MTUxMjM4MjYyMH0.TwcGOYeoLKCjV6e7n0HWGHdnBi5oTfTCwJPI_2eWPiA';
    req = assert.getArrPost(req,'lookUpPersonId');
    assert.apiRequest('post','/journalism/save',req).then(function (results) {
        res.send(results);
    });
};

module.exports = {
    news_list: news_list,
    news_manage: news_manage,
    news_create: news_create,
    news_approve: news_approve,
    news_category:news_category,
    save_news:save_news
};
