
var assert = require('./assert.js');

var news_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('news/news_list',JADE_VAR);
};

var news_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('news/news_manage',JADE_VAR);
};

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
