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
var workflow = require("./workflow")
var myMessage = require('./my_message')

module.exports = function (app) {

    /** 登录相关路由*/
    app.get('/login', login.login);
    app.get('/find_pass', login.find_pass);
    app.get('/change_pass', login.change_pass);
    app.get('/set_pass', login.set_pass);
    app.get('/admin_login', login.admin_login);
    app.get('/login/qrCode', login.qrCode);
    app.get('/login/qrResult', login.qrResult);
    app.post('/login/qrLogin', login.qrLogin);
    app.get('/register', login.register);
    app.post('/doLogin',login.doLogin);
    app.post("/set_pass",login.do_set_pass);
    app.post("/sms_send",login.sms_send);
    app.get("/login/login_out",login.login_out);

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
    app.get('/setting/app_permission', setting.app_permission);
    app.get('/setting/contact_addpage', setting.contact_addpage);
    app.get('/setting/contact_config', setting.contact_config);
    app.post('/setting/organization_save',setting.organization_save);
    app.post('/setting/user_delete',setting.user_delete);
    app.post('/setting/user_save',setting.user_save);
    app.get('/setting/user_edit',setting.user_edit);
    app.get('/setting/role_permission',setting.role_permission);
    app.get('/setting/role_edit',setting.role_edit);


    /** 新闻相关路由*/
    app.get('/news/news_list', news.news_list);
    app.get('/news/news_manage', news.news_manage);
    app.get('/news/news_create', news.news_create);
    app.get('/news/news_approve', news.news_approve);
    app.get('/news/news_category', news.news_category);
    app.post('/news/news_save', news.save_news);
    app.post('/news/news_delete',news.news_delete);
    app.post('/news/category_delete',news.category_delete);
    app.get('/news/category_create',news.category_create);
    app.post('/news/category_save',news.category_save);
    app.get('/news/category_edit',news.category_edit);
    app.post('/news/category_edit',news.category_update);
    app.get('/news/news_detail',news.news_detail);

    /** 工单申请相关路由*/
    app.get('/order/order_create', order.order_create);
    app.get('/order/order_approve', order.order_approve);
    app.get('/order/order_mine', order.order_mine);
    app.get('/order/approve_detail', order.approve_detail);
    app.post('/order/save_order',order.save_order);
    app.post('/order/order_delete',order.order_delete);
    app.get('/order/order_detail',order.order_detail);

    /** 公文相关路由*/
    app.get('/docu/docu_list', document.docu_list);
    app.get('/docu/docu_create', document.docu_create);
    app.get('/docu/docu_manage', document.docu_manage);
    app.get('/docu/docu_approve', document.docu_approve);
    app.get('/docu/approve_detail', document.approve_detail);
    app.post('/docu/docu_save', document.docu_save);
    app.post('/docu/docu_delete', document.docu_delete);
    app.get('/docu/docu_detail',document.docu_detail);

    /** 公告相关路由*/
    app.get('/notice/notice_list', notice.notice_list);
    app.get('/notice/notice_create', notice.notice_create);
    app.get('/notice/notice_manage', notice.notice_manage);
    app.get('/notice/notice_approve', notice.notice_approve);
    app.get('/notice/notice_detail', notice.notice_detail);
    app.post('/notice/notice_save', notice.notice_save);
    app.post('/notice/notice_delete',notice.notice_delete);

    /** 邮件相关路由*/
    app.get('/mail/mail_create', mail.mail_create);
    app.get('/mail/mail_send', mail.mail_send);
    app.get('/mail/mail_receive', mail.mail_receive);
    app.post('/mail/send_mail',mail.send_mail);
    app.get('/mail/mail_detail',mail.mail_detail);
    app.post('/mail/send_delete',mail.send_delete);
    app.post('/mail/receive_delete',mail.receive_delete);

    /** 会议相关路由 */
    app.get('/conference/con_approve',conference.con_approve);
    app.get('/conference/con_create', conference.con_create);
    app.get('/conference/con_history', conference.con_history);
    app.get('/conference/con_summary', conference.con_summary);
    app.get('/conference/con_summary_detail', conference.con_summary_detail);
    app.get('/conference/con_sign', conference.con_sign);
    app.get('/conference/con_apply', conference.con_apply);
    app.get('/conference/con_room_create',conference.con_room_create);
    app.get('/conference/con_room_edit',conference.con_room_edit);
    app.get('/conference/con_room_resource', conference.con_room_resource);
    app.get('/conference/con_room', conference.con_room);
    app.post('/conference/con_save',conference.con_save);
    app.post('/conference/con_delete',conference.con_delete);
    app.get('/conference/con_detail',conference.con_detail);
    app.post('/conference/con_room_delete',conference.con_room_delete);
    app.post('/conference/con_room_save',conference.con_room_save);
    app.get('/conference/con_room_detail',conference.con_room_detail);

    /** 用户相关 **/
    app.get('/user/user_center', user.user_center);
    app.get('/user/change_pass', user.change_pass);

    /** 用户聊天 **/
    app.get('/im',message.im);

    /** 网盘相关 */
    app.get('/netdisk/company_disk', netdisk.company_disk);
    app.get('/netdisk/company_disk_recycle', netdisk.company_disk_recycle);

    /** 流程配置相关 */
    app.get('/workflow/workflow_config', workflow.workflow_config);
    app.get('/workflow/workflow_edit', workflow.workflow_edit);
    app.get('/workflow/workflow_manage', workflow.workflow_manage);
    app.get('/flowDesigner',workflow.flowDesigner);
    app.post('/workflow/node_create',workflow.node_create);
    app.post('/workflow/node_save',workflow.node_save);
    app.get('/workflow/node_info',workflow.node_info);
    app.post('/workflow/workflow_save',workflow.workflow_save);
    app.get('/workflow/workflow_detail',workflow.workflow_detail);
    app.get('/workflow/workflow_new',workflow.workflow_new);
    app.post('/workflow/workflow_new',workflow.workflow_new);
    app.post('/workflow/flow_delete',workflow.workflow_delete);

    /** 个人消息页面*/
    app.get('/message',myMessage.message);

    /** 首页相关 */
    app.get('/', home.home);
    app.get('/add_application', home.add_application);
    app.get('/version', home.version);
    app.get('/statistics', home.statistics);
    app.get('/start', home.startPage);
};
