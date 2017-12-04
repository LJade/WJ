
var assert = require('./assert.js');

var message = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('message/message',JADE_VAR);
};



module.exports = {
    message:message
};
