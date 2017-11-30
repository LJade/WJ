var assert = require('./assert.js');
var request  = require('request');

var home = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/index',JADE_VAR);
};

var add_application = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/add_application',JADE_VAR);
};

var version = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/version',JADE_VAR);
};

var statistics = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/statistics',JADE_VAR);
};

var startPage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('home/start',JADE_VAR);
};


module.exports = {
    home:home,
    add_application:add_application,
    version:version,
    statistics:statistics,
    startPage:startPage
};
