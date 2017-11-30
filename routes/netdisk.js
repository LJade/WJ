
var assert = require('./assert.js');

var company_disk = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('netdisk/company_disk',JADE_VAR);
};

var company_disk_recycle = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('netdisk/company_disk_recycle',JADE_VAR);
};

var mail_receive = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('mail/mail_receive',JADE_VAR);
};



module.exports = {
    company_disk:company_disk,
    company_disk_recycle:company_disk_recycle
};
