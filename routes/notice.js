
var assert = require('./assert.js');

var notice_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_list',JADE_VAR);
};

var notice_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_create',JADE_VAR);
};

var notice_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_manage',JADE_VAR);
};

var notice_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_approve',JADE_VAR);
};

var notice_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('notice/notice_detail',JADE_VAR);
};


module.exports = {
    notice_list:notice_list,
    notice_create:notice_create,
    notice_manage:notice_manage,
    notice_approve:notice_approve,
    notice_detail:notice_detail
};
