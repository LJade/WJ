
var assert = require('./assert.js');

var workflow_config = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workflow/workflow_config',JADE_VAR);
};

var workflow_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workflow/workflow_create',JADE_VAR);
};
var workflow_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workflow/workflow_manage',JADE_VAR);
};

var flowDesigner = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.header("Access-Control-Allow-Origin", "*");
    res.render('workflow/flowDesigner',JADE_VAR);
}



module.exports = {
    workflow_config:workflow_config,
    workflow_create:workflow_create,
    workflow_manage:workflow_manage,
    flowDesigner:flowDesigner
};
