
var assert = require('./assert.js');

var order_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workOrder/order_create',JADE_VAR);
};

var order_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workOrder/order_approve',JADE_VAR);
};

var order_mine = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workOrder/order_mine',JADE_VAR);
};

var order_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workOrder/order_detail',JADE_VAR);
};


module.exports = {
    order_create:order_create,
    order_approve:order_approve,
    order_mine:order_mine,
    order_detail:order_detail
};
