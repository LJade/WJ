
var assert = require('./assert.js');

var order_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.isEdit = true;
    JADE_VAR.orderDetail = {
        workOrderApplyId:"",
        indexNumber:"",
        informationType:"",
        informationName:"",
        departmentId:"",
        businessCreateTime:"",
        takeEffectTime:"",
        abolishTime:"",
        content:""
    };
    JADE_VAR.workOrderApplyId = "";
    res.render('workOrder/order_create',JADE_VAR);
};

var order_approve = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(req.query.date){
        req.query.businessCreateTime = req.query.date;
        delete req.query.date;
    }
    assert.apiRequest("get",'/workOrderApply/myApproveList',req).then(function (results) {
        JADE_VAR.orders = JSON.parse(results).dat.details;
        JADE_VAR.rowsCount = JSON.parse(results).dat.rowsCount;
        if(JADE_VAR.orders.length === 0){
            JADE_VAR.orders = [{
                "workOrderApplyId": "98",
                "indexNumber": "312",
                "publicName": "芦苇",
                "informationType": "请假",
                "informationName": "我的病假申请",
                "departmentId": "1,2",
                "businessCreateTime": "2017-11-13",
                "takeEffectTime": "2017-11-14",
                "abolishTime": "2017-11-15",
                "flowApproveUserId": "5",
                "content": "我生病了，要请假呀",
                "approveStatus": "1",
                "userId": null,
                "departmentList": null
            }];
            JADE_VAR.rowsCount = 1;
        }
        res.render('workOrder/order_approve',JADE_VAR);
    });

};

var order_mine = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(req.query.date){
        req.query.businessCreateTime = req.query.date;
        delete req.query.date;
    }
    assert.apiRequest("get",'/workOrderApply/list',req).then(function (results) {
        JADE_VAR.orders = JSON.parse(results).dat.details;
        JADE_VAR.rowsCount = JSON.parse(results).dat.rowsCount;
        res.render('workOrder/order_mine',JADE_VAR);
    });
};

var approve_detail = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('workOrder/order_detail',JADE_VAR);
};

var save_order = function (req, res, next) {
    assert.apiRequest('post','/workOrderApply/save',req).then(function (results) {
        res.send(results);
    })
};

var order_delete = function (req, res, next) {
    req = assert.getArrPost(req,'workOrderApplyIdList');
    console.log(req.body);
    assert.apiRequest('post','/workOrderApply/delete',req).then(function (results) {
        console.log(results);
        res.send(results);
    });
};

var order_detail = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //edit
    var isEdit = false;
    if( req.query.edit && req.query.edit === 'true'){
        isEdit = true;
    }
    //获取信息
    var ordersInfo = assert.apiRequest("get",'/workOrderApply/detail',req);
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    Promise.all([ordersInfo,getAllUser]).then(function (results) {
        var orderInfo = JSON.parse(results[0]);
        var allUsers = JSON.parse(results[1]);
        if (orderInfo.code === 1) {
            JADE_VAR.orderDetail = orderInfo.dat;
            JADE_VAR.flowApproveUserId =orderInfo.dat.flowApproveUserId;
            JADE_VAR.lookUpPersonIds = orderInfo.dat.departmentId  === null ? '' : orderInfo.dat.departmentId;
            JADE_VAR.allUsers = allUsers.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUsers.dat.tree],[]);
            JADE_VAR.isEdit = isEdit;
            res.render('workOrder/order_create', JADE_VAR);
        } else {
            res.render('error/error', JADE_VAR);
        }
    });
};

module.exports = {
    order_create:order_create,
    order_approve:order_approve,
    order_mine:order_mine,
    approve_detail:approve_detail,
    save_order:save_order,
    order_delete:order_delete,
    order_detail:order_detail
};
