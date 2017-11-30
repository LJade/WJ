
var assert = require('./assert.js');

var docu_list = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_list',JADE_VAR);
};

var docu_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('document/docu_create',JADE_VAR);
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


module.exports = {
    docu_list:docu_list,
    docu_create:docu_create,
    docu_manage:docu_manage,
    docu_approve:docu_approve,
    docu_detail:docu_detail
};
