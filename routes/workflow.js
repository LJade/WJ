
var assert = require('./assert.js');

var workflow_config = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取所有人员列表
    req.query['id'] = 1;
    var getWorkflowInfo = assert.apiRequest("get",'/flow/detail',req);
    //请求数据
    Promise.all([getWorkflowInfo]).then(function (results) {
        if (results) {
            //然后是流程信息
            var workflowInfo = JSON.parse(results[0]);
            JADE_VAR.flow_id = workflowInfo.dat.id;
            JADE_VAR.flow_name = workflowInfo.dat.name;
            if(workflowInfo.dat.nodeInfo === ""){
                JADE_VAR.processData = JSON.stringify({});
            }else{
                var workflowInfoJSON = JSON.parse(workflowInfo.dat.nodeInfo);
                var parseProcessData = [];
                workflowInfoJSON.forEach(function (nodeInfo,index) {
                    var tempNode = {};
                    tempNode.id = nodeInfo.id;
                    tempNode.process_name = nodeInfo.name;
                    tempNode.flow_id = nodeInfo.defineId
                    tempNode.process_to =nodeInfo.processTo;
                    if(nodeInfo.type === 1 ){
                        tempNode.icon = "icon-play";
                    }else{
                        if(nodeInfo.type === 2 ){
                            tempNode.icon = "icon-ok";
                        }else{
                            tempNode.icon = "icon-lock";
                        }
                    }
                    tempNode.style = nodeInfo.ext;
                    parseProcessData.push(tempNode);
                });
                var processData = {};
                processData.total = parseProcessData.length;
                processData.list = parseProcessData;
                JADE_VAR.processData = JSON.stringify(processData);
            }
            //渲染页面
            res.render('workflow/flowDesigner',JADE_VAR);
        } else {
            JADE_VAR.message = results;
            res.render('error/error', JADE_VAR);
        }
    }, function (error, err) {
        JADE_VAR.messagae = err;
        res.render('error/error', JADE_VAR);
    });
};

var workflow_edit = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.body = req.query;
    //获取所有人员列表
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    var getFlowDetail = assert.apiRequest("post","/flow/detail",req);
    //请求数据
    Promise.all([getAllUser,getFlowDetail]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            JADE_VAR.allUsers = modules.dat.users;
            //获取单个节点得配置信息
            var nodeInfoJSON = JSON.parse(results[1]);
            var  chooseNodeInfo = {
                id : req.query.nodeId,
                name: "",
                approveUsersId:'',
                executeCond:'ALL',
                forwardCond:'Y',
                executeHours:0,
                processTo:'',
                editable:true
            };
            if(nodeInfoJSON.code === 1){
                if(nodeInfoJSON.dat.nodeInfo !== ''){
                    var nodeInfo =  JSON.parse(nodeInfoJSON.dat.nodeInfo);
                    nodeInfo.forEach(function (data,index) {
                        if(data.id = req.body.nodeId){
                            chooseNodeInfo = data;
                        }
                    });
                }
            }
            JADE_VAR.nodeInfo = chooseNodeInfo;
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

var node_create = function (req,res,next) {
   assert.apiRequest("post","/flow/addNode",req).then(function (results) {
      res.send(results);
   });
};

var workflow_manage = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("post","/flow/list",req).then(function (results) {
        var flowsListInfo = JSON.parse(results);
        if(flowsListInfo.code == 1){
            JADE_VAR.flowsList = flowsListInfo.dat.details;
            JADE_VAR.flowsListTotal = flowsListInfo.dat.totalPage;
        }else{
            JADE_VAR.flowsList = [];
            JADE_VAR.flowsListTotal = 0;
        }
    });
    res.render('workflow/workflow_manage',JADE_VAR);
};

var flowDesigner = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.header("Access-Control-Allow-Origin", "*");
    res.render('workflow/flowDesigner',JADE_VAR);
};

var node_save = function (req,res,next) {
    assert.apiRequest("post","/flow/saveNode",req).then(function (results) {
        res.send(results);
    });
};

var node_info = function (req,res,next) {
    assert.apiRequest("post","/flow/detail",req).then(function (results) {
        var nodeInfoJSON = JSON.parse(results);
        if(nodeInfoJSON.code === 1){
            if(nodeInfoJSON.dat.nodeInfo === ""){
                res.send({"msg":"该节点还没有配置信息，请右键选择节点进行信息配置","code":0,"dat":null});
            }else{
                var nodeInfo =  JSON.parse(nodeInfoJSON.dat.nodeInfo);
                var chooseNodeInfo = {};
                nodeInfo.forEach(function (data,index) {
                    if(data.id = req.body.nodeId){
                        chooseNodeInfo = data;
                    }
                });
                if(chooseNodeInfo){
                    res.send({"msg":"请求成功","code":1,"dat":chooseNodeInfo});
                }else{
                    res.send({"msg":"在流程中没找到对应得信息","code":-1,"dat":null});
                }
            }
        }else{
            res.send(nodeInfoJSON);
        }
    });
};



module.exports = {
    workflow_config:workflow_config,
    workflow_edit:workflow_edit,
    workflow_manage:workflow_manage,
    flowDesigner:flowDesigner,
    node_create:node_create,
    node_save:node_save,
    node_info:node_info
};
