var login = require("./login.js");
var setting = require("./setting.js");
var news = require('./news.js');
var order = require("./order.js");
var document = require("./document.js");
var notice = require("./notice.js");
var mail = require("./mail.js");
var conference = require("./conference.js");
var user = require("./user.js");
var netdisk = require("./netdisk.js");
var home = require("./home.js");
var message = require("./message.js");

module.exports = function (app) {

    /** 登录相关路由*/
    app.get('/login', login.login);
    app.get('/find_pass', login.find_pass);
    app.get('/change_pass', login.change_pass);
    app.get('/set_pass', login.set_pass);
    app.get('/admin_login', login.admin_login);
    app.get('/register', login.register);
    app.post('/doLogin',login.doLogin);
    app.post("/set_pass",login.do_set_pass);
    app.post("/sms_send",login.sms_send);

    /** 系统设置相关路由*/
    app.get('/setting/app_create', setting.app_create);
    app.get('/setting/region_manage', setting.region_manage);
    app.get('/setting/organization_manage',setting.organization_manage);
    app.get('/setting/organization_create', setting.organization_create);
    app.get('/setting/organization_edit', setting.organization_edit);
    app.get('/setting/user_manage', setting.user_manage);
    app.get('/setting/role_create', setting.role_create);
    app.get('/setting/role_manage', setting.role_manage);
    app.get('/setting/location_manage', setting.location_manage);
    app.get('/setting/log_manage', setting.log_manage);

    /** 新闻相关路由*/
    app.get('/news/news_list', news.news_list);
    app.get('/news/news_manage', news.news_manage);
    app.get('/news/news_create', news.news_create);
    app.get('/news/news_approve', news.news_approve);

    /** 工单申请相关路由*/
    app.get('/order/order_create', order.order_create);
    app.get('/order/order_approve', order.order_approve);
    app.get('/order/order_mine', order.order_mine);
    app.get('/order/order_detail', order.order_detail);

    /** 公文相关路由*/
    app.get('/docu/docu_list', document.docu_list);
    app.get('/docu/docu_create', document.docu_create);
    app.get('/docu/docu_manage', document.docu_manage);
    app.get('/docu/docu_approve', document.docu_approve);
    app.get('/docu/docu_detail', document.docu_detail);

    /** 公告相关路由*/
    app.get('/notice/notice_list', notice.notice_list);
    app.get('/notice/notice_create', notice.notice_create);
    app.get('/notice/notice_manage', notice.notice_manage);
    app.get('/notice/notice_approve', notice.notice_approve);
    app.get('/notice/notice_detail', notice.notice_detail);

    /** 邮件相关路由*/
    app.get('/mail/mail_create', mail.mail_create);
    app.get('/mail/mail_send', mail.mail_send);
    app.get('/mail/mail_receive', mail.mail_receive);

    /** 会议相关路由 */
    app.get('/conference/con_approve',conference.con_approve);
    app.get('/conference/con_create', conference.con_create);
    app.get('/conference/con_history', conference.con_history);
    app.get('/conference/con_summary', conference.con_summary);
    app.get('/conference/con_sign', conference.con_sign);
    app.get('/conference/con_apply', conference.con_apply);
    app.get('/conference/con_room', conference.con_room);
    app.get('/conference/con_room_resource', conference.con_room_resource);

    /** 用户相关 **/
    app.get('/user/user_center', user.user_center);
    app.get('/user/change_pass', user.change_pass);

    /** 用户聊天 **/
    app.get('/im/message',message.message);

    /** 网盘相关 */
    app.get('/netdisk/company_disk', netdisk.company_disk);
    app.get('/netdisk/company_disk_recycle', netdisk.company_disk_recycle);

    /** 首页相关 */
    app.get('/', home.home);
    app.get('/add_application', home.add_application);
    app.get('/version', home.version);
    app.get('/statistics', home.statistics);
    app.get('/start', home.startPage);
};
