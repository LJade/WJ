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
    //接收参数获取用户填写信息,请求注册或登陆接口
    var mobile = req.query.mobile;
    var timeStr = req.query.timeStr;
    var sign = req.query.sign;
    var action = req.query.action;
    var codeAjax = req.query.code;
    var password = req.query.password;
    var username = req.query.username;

    assert.validateRequest(req.query,function (code,message) {
        if(code == 1){
            //正确的请求方式
            /**
             * 开始进行数据请求,根据mobile和username的参数值是否为空来确定是何种登陆方式
             */
            if(username){
                //用户名不为空则默认为账号密码登陆
                if(!password){
                    res.send({code:101,message:"密码不能为空"});
                    return;
                }
                //开始请求数据
                assert.apiParseRequest('get','/login',{username:username,password:password}).then(function (results) {
                    if(results.error){
                        res.send({code:results.code,message:results.error});
                    }else{
                        //res.session.userId = results.objectId;
                        res.send({code:200,message:"请求成功",data:{userId:results.objectId}});
                    }
                }, function (body,error) {
                    console.log(body,error);
                    res.send(error);
                })
            }else{
                if(mobile){
                    if(!code){
                        res.send({code:102,message:"验证码不能为空"});
                        return;
                    }
                    //请求数据
                    assert.apiParseRequest('post','/functions/mobileFastLogin',{mobile:mobile,code:codeAjax}).then(function (results) {
                        if(results.error){
                            res.send({code:results.code,message:results.error});
                        }else{
                            //res.session.userId = results.objectId;
                            res.send({code:200,message:"请求成功",data:{userId:results.result.objectId}});
                        }
                    } ,function (body,error) {
                        console.log(body,error);
                        res.send(error);
                    })
                }else{
                    res.send({code:103,message:"提交数据错误"});
                }
            }
        }else{
            res.send({code:400,message:message});
        }
    })
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
    withOutLoginCodeSend:withoutLoginCodeSend
};
