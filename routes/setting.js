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
    var depAll = assert.apiRequest('get','/department/allDept',req);
    if(req.query.deptId){
        //这里为编辑
        var depDetail = assert.apiRequest('get','/department/detail',req);
        Promise.all([depAll,depDetail]).then(function (results) {
            var depInfo = JSON.parse(results[1]);
            var allDep = JSON.parse(results[0]);
            if(depInfo.code === 1){
                JADE_VAR.depInfo = depInfo.dat;
                JADE_VAR.allDep = allDep.dat;
            }else{
                res.render('error/error',{"message":depInfo.msg});
            }
        });
    }else{
        depAll.then(function (results) {
            JADE_VAR.depId = '';
            JADE_VAR.depInfo = {
                name:"",
                parentId:"",
                sortNum:""
            };
            JADE_VAR.allDep = JSON.parse(results).dat;
            res.render('setting/organization_create',JADE_VAR);
        })
    }
};

var organization_save = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_create',JADE_VAR);
};

var organization_edit = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_edit',JADE_VAR);
};

var user_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取所有用户
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([getAllUser]).then(function (results) {
       var userInfo = JSON.parse(results[0]);
       if(userInfo.code === 1){
           JADE_VAR.users = userInfo.dat.users;
           res.render('setting/user_manage',JADE_VAR);
       }else{
           res.render('error/error',{"message":userInfo.msg});
       }
    });
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
    contact_config:contact_config,
    organization_save:organization_save,
};
