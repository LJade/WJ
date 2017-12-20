var assert = require('./assert.js');
var request = require('request');
var qr = require('qr-image');
var md5 = require('md5');

var login = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/login', JADE_VAR);
};

var admin_login = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/admin_login', JADE_VAR);
};

var find_pass = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/find_pass', JADE_VAR);
};

var change_pass = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/change_pass', JADE_VAR);
};

var set_pass = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/set_pass', JADE_VAR);
};

var register = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('login/register', JADE_VAR);
};

var doLogin = function (req, res, next) {

    req = assert.coverParams(req,"body",['account','pwd']);
    req.body.pwd = md5(req.body.pwd);
    assert.apiRequest("post", "/user/ptlogin", req).then(function (results) {
        var loginInfo = JSON.parse(results);
        console.log(loginInfo.dat.accessToken);
        if (loginInfo.code == 1) {
            req.session.user = {
                userName: req.params.account,
                accessToken: loginInfo.dat.accessToken,
                headIcon: loginInfo.dat.headIcon,
                IMAccount:loginInfo.dat.imAccount,
                IMPwd:loginInfo.dat.imPass,
                roleType:loginInfo.dat.roleType
            };
        }
        res.redirect("/");
    })
};

var do_set_pass = function (req, res, next) {
    assert.apiRequest("post", "/login/set_pass", req.body).then(function (results) {
        res.send(results)
    })
};

var qrCodeImg = function (req, res, next) {
    assert.apiRequest("get", "/user/qrCode", req).then(function (results) {
        try {
            var qrInfo = JSON.parse(results);
            if (qrInfo.code == 1) {
                var img = qr.image(qrInfo.dat.qrid, {size: 10});
                req.session.loginQRID = qrInfo.dat.qrid;
                res.cookie('loginQRID',qrInfo.dat.qrid,'/');
                res.writeHead(200, {'Content-Type': "image/png"});
                img.pipe(res);
            } else {
                var img = qr.image(qrInfo.msg, {size: 10});
                res.writeHead(200, {'Content-Type': "image/png"});
                img.pipe(res);
            }
        } catch (e) {
            console.log(e);
            res.writeHead(414, {'Content-Type': 'text/html'});
            res.end('<h1>404 get qrCode failed!!!</h1>');
        }
    })
};

var qrResult = function (req, res, next) {

    assert.apiRequest("get", "/user/qrResult", req).then(function (results) {
        res.header("Content-Type","application/json; charset=utf-8");
        res.send(results)
    })
};

var sms_send = function (req, res, next) {
    assert.apiRequest("post", "/login/sms_send", req.body).then(function (results) {
        res.send(results)
    })
};

var qrLogin = function (req, res, next) {
    assert.apiRequest("get", "/user/qrlogin", req).then(function (results) {
        var loginInfo = JSON.parse(results);
        if(loginInfo.code == 1){
            res.session.user = {
                userName:req.params.account,
                accessToken:loginInfo.dat.accessToken,
                headIcon:loginInfo.dat.headIcon
            };
        }
        res.redirect("/")
    })
};

var withoutLoginCodeSend = function (req, res, next) {
    //通过手机号获取短信验证码
    var mobile = req.body.mobile;
    var timeStr = req.body.timeStr;
    var sign = req.body.sign;
    var action = req.body.action;

    assert.validateRequest(req.body, function (code, message) {
        if (code == 1) {
            /*进行验证码请求逻辑*/
            var data = {
                mobile: mobile,
                send_type: "mobileLogin"
            };
            assert.apiParseRequest('post', '/functions/sendSMS', data).then(function (results) {
                if (results.error) {
                    res.send({code: results.code, message: results.error});
                } else {
                    res.send({code: 200, message: "发送成功"});
                }
            }, function (err, error) {
                res.send({code: 101, message: "请求发送失败"});
            })
        } else {
            res.send({code: 400, message: message});
        }
    })
};

var login_out = function (req, res, next) {
    req.session.user = "";
    req.session.modules = "";
    res.redirect("/login");
};

module.exports = {
    login: login,
    admin_login: admin_login,
    find_pass: find_pass,
    set_pass: set_pass,
    register: register,
    change_pass: change_pass,
    doLogin: doLogin,
    withOutLoginCodeSend: withoutLoginCodeSend,
    sms_send: sms_send,
    do_set_pass: do_set_pass,
    qrCode: qrCodeImg,
    qrResult: qrResult,
    qrLogin: qrLogin,
    login_out:login_out
};
