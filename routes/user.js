
var assert = require('./assert.js');

var user_center = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('user/user_center',JADE_VAR);
};

var change_pass = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('user/change_pass',JADE_VAR);
};



module.exports = {
    user_center:user_center,
    change_pass:change_pass
};
