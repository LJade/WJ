
module.exports = function (app) {
    /* GET home page. */
    app.get('/', function(req, res, next) {
        res.render('home/index');
    });
    app.get('/add_application', function(req, res, next) {
        res.render('home/add_application');
    });
    app.get('/login', function(req, res, next) {
        res.render('login/login');
    });
    app.get('/register', function(req, res, next) {
        res.render('register/register');
    });
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
    app.get('/app_create', function(req, res, next) {
        res.render('setting/app_create');
    });
    app.get('/region_manage', function(req, res, next) {
        res.render('setting/region_manage');
    });
};
