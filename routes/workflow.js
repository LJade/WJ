
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
                    tempNode.flow_id = workflowInfo.dat.id;
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
                console.log(parseProcessData);
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
    var getFlowDetail = assert.apiRequest("post","/flow/nodeDetail",req);
    //请求数据
    Promise.all([getAllUser,getFlowDetail]).then(function (results) {
        if (results) {
            var modules = JSON.parse(results[0]);
            JADE_VAR.allUsers = modules.dat.users;
            //获取单个节点得配置信息
            var nodeInfoJSON = JSON.parse(results[1]);
            if(nodeInfoJSON.code === 1){
                JADE_VAR.isRead = false;
                JADE_VAR.nodeInfo = nodeInfoJSON.dat;
                res.render('workflow/workflow_create',JADE_VAR);
            }else{
                res.send(nodeInfoJSON.msg);
            }
        } else {
            JADE_VAR.message = results;
            res.send("请求接口出错，请稍后再试")
        }
    }, function (error, err) {
        res.send("请求接口出错，错误为："+  error +"请稍后再试")
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

var workflow_save = function (req, res, next) {
    var workflowInfo = JSON.parse(req.body.process_info);
    //装扮下参数
    req.body.id = req.body.flow_id;
    var paramsList = [];
    /*
    *
    * {"49":{"top":189,"type":1,"left":243,"process_to":["50"]},"50":{"top":55,"type":2,"left":595,"process_to":["51","52"]},"51":{"top":160,"type":2,"left":952,"process_to":["52"]},"52":{"top":344,"type":3,"left":620,"process_to":[]}}
    * */
    Object.keys(workflowInfo).forEach(function (data,index) {
       var temp = {
           "id": data,
           "name":workflowInfo[data].name.trim(),
           "type":workflowInfo[data].type,
           "ext":"width:150px;height:50px;line-height:50px;color:#0e76a8;left:"+workflowInfo[data].left+"px;top:"+workflowInfo[data].top+"px;",
           "processTo":String(workflowInfo[data].process_to)
       }
       paramsList.push(temp);
    });
    console.log(paramsList);
    req.body.nodeInfo = JSON.stringify(paramsList);
    delete req.body.flow_id;
    delete req.body.process_info;
    assert.apiRequest("post","/flow/saveDefine",req).then(function (results) {
        res.send(results);
    });
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
    var JADE_VAR = assert.getJADE();
    req.body = req.query;
    assert.apiRequest("post","/flow/nodeDetail",req).then(function (results) {
        var nodeInfoJSON = JSON.parse(results);
        if(nodeInfoJSON.code === 1){
            JADE_VAR.nodeInfo = nodeInfoJSON.dat;
            JADE_VAR.isRead = true;
            //渲染页面
            res.render('workflow/workflow_create',JADE_VAR);
        }else{
            res.send("获取节点详情失败");
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
    node_info:node_info,
    workflow_save:workflow_save
};
