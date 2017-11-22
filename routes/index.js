//获取运行环境
// var env = app.get("env") !== 'development';
var env = false;
var hmConfig = require('../hmConfig.js');
hmConfig.init(env);
var gulpConfig = hmConfig.jade_config;
console.log(gulpConfig);


module.exports = function (app) {



    app.get('/add_application', function(req, res, next) {
        res.render('home/add_application', gulpConfig);
    });
    /** 登录相关路由*/
    app.get('/login', function(req, res, next) {
        res.render('login/login', gulpConfig);
    });
    app.get('/find_pass', function(req, res, next) {
        res.render('login/find_pass', gulpConfig);
    });
    app.get('/change_pass', function(req, res, next) {
        res.render('login/change_pass', gulpConfig);
    });
    app.get('/set_pass', function(req, res, next) {
        res.render('login/set_pass', gulpConfig);
    });
    app.get('/admin_login', function(req, res, next) {
        res.render('login/admin_login', gulpConfig);
    });
    app.get('/register', function(req, res, next) {
        res.render('login/register', gulpConfig);
    });

    /** 系统设置相关路由*/
    app.get('/setting/app_create', function(req, res, next) {
        res.render('setting/app_create', gulpConfig);
    });
    app.get('/setting/region_manage', function(req, res, next) {
        res.render('setting/region_manage', gulpConfig);
    });
    app.get('/setting/organization_manage', function(req, res, next) {
        res.render('setting/organization_manage', gulpConfig);
    });
    app.get('/setting/user_manage', function(req, res, next) {
        res.render('setting/user_manage', gulpConfig);
    });
    app.get('/setting/location_manage', function(req, res, next) {
        res.render('setting/location_manage', gulpConfig);
    });
    app.get('/setting/log_manage', function(req, res, next) {
        res.render('setting/log_manage', gulpConfig);
    });
    /** 新闻相关路由*/
    app.get('/news/news_list', function(req, res,next) {
        res.render('news/news_list', gulpConfig);
    });
    app.get('/news/news_manage', function(req, res, next) {
        res.render('news/news_manage', gulpConfig);
    });
    app.get('/news/news_create', function(req, res, next) {
        res.render('news/news_create', gulpConfig);
    });
    app.get('/news/news_approve', function(req, res, next) {
        res.render('news/news_approve', gulpConfig);
    });
    /** 工单申请相关路由*/
    app.get('/order/order_create', function(req, res, next) {
        res.render('workOrder/order_create', gulpConfig);
    });
    app.get('/order/order_approve', function(req, res, next) {
        res.render('workOrder/order_approve', gulpConfig);
    });
    app.get('/order/order_mine', function(req, res, next) {
        res.render('workOrder/order_mine', gulpConfig);
    });
    app.get('/order/order_detail', function(req, res, next) {
        res.render('workOrder/order_detail', gulpConfig);
    });
    /** 公文相关路由*/
    app.get('/docu/docu_list', function(req, res, next) {
        res.render('document/docu_list', gulpConfig);
    });
    app.get('/docu/docu_create', function(req, res, next) {
        res.render('document/docu_create', gulpConfig);
    });
    app.get('/docu/docu_manage', function(req, res, next) {
        res.render('document/docu_manage', gulpConfig);
    });
    app.get('/docu/docu_approve', function(req, res, next) {
        res.render('document/docu_approve', gulpConfig);
    });
    app.get('/docu/docu_detail', function(req, res, next) {
        res.render('document/docu_detail', gulpConfig);
    });
    /** 公告相关路由*/
    app.get('/notice/notice_list', function(req, res, next) {
        res.render('notice/notice_list', gulpConfig);
    });
    app.get('/notice/notice_create', function(req, res, next) {
        res.render('notice/notice_create', gulpConfig);
    });
    app.get('/notice/notice_manage', function(req, res, next) {
        res.render('notice/notice_manage', gulpConfig);
    });
    app.get('/notice/notice_approve', function(req, res, next) {
        res.render('notice/notice_approve', gulpConfig);
    });
    app.get('/notice/notice_detail', function(req, res, next) {
        res.render('notice/notice_detail', gulpConfig);
    });

    /** 邮件相关路由*/
    app.get('/mail/mail_create', function(req, res, next) {
        res.render('mail/mail_create', gulpConfig);
    });
    app.get('/mail/mail_send', function(req, res, next) {
        res.render('mail/mail_send', gulpConfig);
    });
    app.get('/mail/mail_receive', function(req, res, next) {
        res.render('mail/mail_receive', gulpConfig);
    });

    /** 会议相关路由 */
    app.get('/conference/con_approve', function(req, res, next) {
        res.render('conference/con_approve', gulpConfig);
    });
    app.get('/conference/con_create', function(req, res, next) {
        res.render('conference/con_create', gulpConfig);
    });
    app.get('/conference/con_history', function(req, res, next) {
        res.render('conference/con_history', gulpConfig);
    });
    app.get('/conference/con_summary', function(req, res, next) {
        res.render('conference/con_summary', gulpConfig);
    });
    app.get('/conference/con_sign', function(req, res, next) {
        res.render('conference/con_sign', gulpConfig);
    });
    app.get('/conference/con_apply', function(req, res, next) {
        res.render('conference/con_apply', gulpConfig);
    });
    app.get('/conference/con_room', function(req, res, next) {
        res.render('conference/con_room', gulpConfig);
    });
    app.get('/conference/con_room_resource', function(req, res, next) {
        res.render('conference/con_room_resource', gulpConfig);
    });

    /* 用户相关*/
    app.get('/user/user_center', function(req, res, next) {
        res.render('user/user_center', gulpConfig);
    });
    app.get('/user/change_pass', function(req, res, next) {
        res.render('user/change_pass', gulpConfig);
    });
    /** 首页相关 */
    app.get('/', function(req, res, next) {
        res.render('home/index', gulpConfig);
    });
};
