
var assert = require('./assert.js');

var mail_create = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('mail/mail_create',JADE_VAR);
};

var mail_send = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('mail/mail_send',JADE_VAR);
};

var mail_receive = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('mail/mail_receive',JADE_VAR);
};



module.exports = {
    mail_create:mail_create,
    mail_send:mail_send,
    mail_receive:mail_receive
};
