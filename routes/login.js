var assert = require('./assert.js');
var request  = require('request');

var login = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/login',JADE_VAR);
};

var admin_login = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/admin_login',JADE_VAR);
};

var find_pass = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/find_pass',JADE_VAR);
};

var change_pass = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/change_pass',JADE_VAR);
};

var set_pass = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/set_pass',JADE_VAR);
};

var register = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/register',JADE_VAR);
};



var doLogin = function(req,res,next){
    assert.apiRequest("post","/login/test",req.body).then(function (results) {res.send(results)})
};

var do_set_pass = function (req,res,next) {
    assert.apiRequest("post","/login/set_pass",req.body).then(function (results) {res.send(results)})
};

var sms_send = function (req,res,next) {
    assert.apiRequest("post","/login/sms_send",req.body).then(function (results) {res.send(results)})
};

var withoutLoginCodeSend = function(req,res,next){
    //通过手机号获取短信验证码
    var mobile = req.body.mobile;
    var timeStr = req.body.timeStr;
    var sign = req.body.sign;
    var action = req.body.action;

    assert.validateRequest(req.body, function (code,message) {
        if(code == 1){
            /*进行验证码请求逻辑*/
            var data = {
                mobile:mobile,
                send_type:"mobileLogin"
            };
            assert.apiParseRequest('post','/functions/sendSMS',data).then(function (results) {
                if(results.error){
                    res.send({code:results.code,message:results.error});
                }else{
                    res.send({code:200,message:"发送成功"});
                }
            }, function (err,error) {
                res.send({code:101,message:"请求发送失败"});
            })
        }else{
            res.send({code:400,message:message});
        }
    })
};

module.exports = {
    login:login,
    admin_login:admin_login,
    find_pass:find_pass,
    set_pass:set_pass,
    register:register,
    change_pass:change_pass,
    doLogin:doLogin,
    withOutLoginCodeSend:withoutLoginCodeSend,
    sms_send:sms_send,
    do_set_pass:do_set_pass
};
