
var assert = require('./assert.js');

var workflow_config = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.header("Access-Control-Allow-Origin", "*");
    res.render('workflow/flowDesigner',JADE_VAR);
};

var workflow_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取所有人员列表
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    //请求数据
    Promise.all([getAllUser]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            JADE_VAR.allUsers = modules.dat.users;
            //渲染页面
            res.render('workflow/workflow_create',JADE_VAR);
        } else {
            JADE_VAR.message = results;
            res.render('error/error', JADE_VAR);
        }
    }, function (error, err) {
        JADE_VAR.messagae = err;
        res.render('error/error', JADE_VAR);
    });
};
var workflow_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workflow/workflow_manage',JADE_VAR);
};

var flowDesigner = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.header("Access-Control-Allow-Origin", "*");
    res.render('workflow/flowDesigner',JADE_VAR);
};



module.exports = {
    workflow_config:workflow_config,
    workflow_create:workflow_create,
    workflow_manage:workflow_manage,
    flowDesigner:flowDesigner
};
