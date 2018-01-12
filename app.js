var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var debug = false;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret:"123123123",
    resave:false,
    saveUninitialized:true
}));

if(debug){
    app.use(function(req,res,next){
        // console.log('[' + new Date().toString() + ']: ' + req.method + ' ' + req.url + ' body:' + req.body);
        req.session.user = {};
        res.cookie('headIcon',"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epqmKVPg9RrCTia56xA0mC2ia1t82IdOFib2G2fdXSA9l4Q7QdcqWv5Qc0RSSia2jZMiaCXHQVfGF2VzrQ/0");
        res.cookie("headName","哈哈哈");
        req.session.user.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIyIiwiaXNzIjoiV0pKVEoiLCJleHAiOjE1MTU5ODcyNzgsImlhdCI6MTUxNTcyODA3OH0.8R3nyf-ANPsbdwLEECMa26TEgjg70h6juiHS1eyGHbM';
        req.session.user.roleType = 1;
        next();
    });
}

routes(app);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        // res.status(err.status || 500);
        // res.render('error/error', {
        //     message: err.message,
        //     error: err
        // });
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://%s:%s', host, port);
});
module.exports = app;
