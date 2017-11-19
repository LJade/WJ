
module.exports = function (app) {
    /** 首页相关 */
    app.get('/', function(req, res, next) {
        res.render('home/index');
    });
    app.get('/add_application', function(req, res, next) {
        res.render('home/add_application');
    });
    /** 登录相关路由*/
    app.get('/login', function(req, res, next) {
        res.render('login/login');
    });
    app.get('/find_pass', function(req, res, next) {
        res.render('login/find_pass');
    });
    app.get('/change_pass', function(req, res, next) {
        res.render('login/change_pass');
    });
    app.get('/set_pass', function(req, res, next) {
        res.render('login/set_pass');
    });
    app.get('/admin_login', function(req, res, next) {
        res.render('login/admin_login');
    });
    app.get('/register', function(req, res, next) {
        res.render('login/register');
    });
    /** 新闻相关路由*/
    app.get('/news_list', function(req, res, next) {
        res.render('news/news_list');
    });
    app.get('/news_manage', function(req, res, next) {
        res.render('news/news_manage');
    });
    app.get('/news_create', function(req, res, next) {
        res.render('news/news_create');
    });
    app.get('/news_approve', function(req, res, next) {
        res.render('news/news_approve');
    });
    /** 系统设置相关路由*/
    app.get('/app_create', function(req, res, next) {
        res.render('setting/app_create');
    });
    app.get('/region_manage', function(req, res, next) {
        res.render('setting/region_manage');
    });
    app.get('/user_manage', function(req, res, next) {
        res.render('setting/user_manage');
    });
    app.get('/location_manage', function(req, res, next) {
        res.render('setting/location_manage');
    });
    app.get('/log_manage', function(req, res, next) {
        res.render('setting/log_manage');
    });
    /** 工单申请相关路由*/
    app.get('/order/order_create', function(req, res, next) {
        res.render('workOrder/order_create');
    });
    app.get('/order/order_approve', function(req, res, next) {
        res.render('workOrder/order_approve');
    });
    app.get('/order/order_mine', function(req, res, next) {
        res.render('workOrder/order_mine');
    });
    app.get('/order/order_detail', function(req, res, next) {
        res.render('workOrder/order_detail');
    });
    /** 公文相关路由*/
    app.get('/docu/docu_list', function(req, res, next) {
        res.render('document/docu_list');
    });
    app.get('/docu/docu_create', function(req, res, next) {
        res.render('document/docu_create');
    });
    app.get('/docu/docu_manage', function(req, res, next) {
        res.render('document/docu_manage');
    });
    app.get('/docu/docu_approve', function(req, res, next) {
        res.render('document/docu_approve');
    });
    app.get('/docu/docu_detail', function(req, res, next) {
        res.render('document/docu_detail');
    });
    /** 公告相关路由*/
    app.get('/notice/notice_list', function(req, res, next) {
        res.render('notice/notice_list');
    });
    app.get('/notice/notice_create', function(req, res, next) {
        res.render('notice/notice_create');
    });
    app.get('/notice/notice_manage', function(req, res, next) {
        res.render('notice/notice_manage');
    });
    app.get('/notice/notice_approve', function(req, res, next) {
        res.render('notice/notice_approve');
    });
    app.get('/notice/notice_detail', function(req, res, next) {
        res.render('notice/notice_detail');
    });
};
