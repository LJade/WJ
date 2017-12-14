var assert = require('./assert.js');

var app_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/app_create',JADE_VAR);
};

var region_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/region_manage',JADE_VAR);
};

var organization_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_manage',JADE_VAR);
};

var organization_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_create',JADE_VAR);
};

var organization_edit = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_edit',JADE_VAR);
};

var user_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/user_manage',JADE_VAR);
};

var role_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/role_create',JADE_VAR);
};

var role_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/role_manage',JADE_VAR);
};

var location_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/location_manage',JADE_VAR);
};

var log_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/log_manage',JADE_VAR);
};

var app_permission = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/app_permission',JADE_VAR);
};

var contact_addpage = function (req,res,next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/contact_addpage',JADE_VAR);
};

var contact_config = function (req,res,next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/contact_config',JADE_VAR);
};

module.exports = {
    app_create:app_create,
    region_manage:region_manage,
    organization_manage:organization_manage,
    organization_create:organization_create,
    organization_edit:organization_edit,
    user_manage:user_manage,
    role_create:role_create,
    role_manage:role_manage,
    location_manage:location_manage,
    log_manage:log_manage,
    app_permission:app_permission,
    contact_addpage:contact_addpage,
    contact_config:contact_config
};
