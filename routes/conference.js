
var assert = require('./assert.js');

var con_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_approve',JADE_VAR);
};

var con_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_create',JADE_VAR);
};

var con_history = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_history',JADE_VAR);
};

var con_summary = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_summary',JADE_VAR);
};

var con_sign = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_sign',JADE_VAR);
};

var con_apply = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_apply',JADE_VAR);
};

var con_room = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_room',JADE_VAR);
};

var con_room_resource = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('conference/con_room_resource',JADE_VAR);
};



module.exports = {
    con_approve:con_approve,
    con_create:con_create,
    con_history:con_history,
    con_summary:con_summary,
    con_sign:con_sign,
    con_apply:con_apply,
    con_room:con_room,
    con_room_resource:con_room_resource
};
