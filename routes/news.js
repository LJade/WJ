
var assert = require('./assert.js');

var news_list = function(req, res, next) {

    var JADE_VAR = assert.getJADE();
    //检查登陆
    req.session.user = {accessToken:"123123"};
    if(!req.session.user.accessToken){
        res.redirect("/login");
    }
    //获取list列表信息
    assert.apiRequest("get","/journalism/list",req).then(function (results) {
        var newsList =  JSON.parse(results);
        if(newsList.code != 1){
            newsList.dat = [];
        }
        //TODO 新闻列表需要再前台显示
        JADE_VAR.newsList = newsList.dat;
        res.render('news/news_list',JADE_VAR);
    })

};

var news_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('news/news_manage',JADE_VAR);
};

var del

var news_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('news/news_create',JADE_VAR);
};

var news_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('news/news_approve',JADE_VAR);
};


module.exports = {
    news_list:news_list,
    news_manage:news_manage,
    news_create:news_create,
    news_approve:news_approve
};
