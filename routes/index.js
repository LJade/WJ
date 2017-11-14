
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
    app.get('/admin_login', function(req, res, next) {
        res.render('login/admin_login');
    });
    app.get('/register', function(req, res, next) {
        res.render('register/register');
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
};
