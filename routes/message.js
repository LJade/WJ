
var assert = require('./assert.js');

var im = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    // if(!req.session.user){
    //     res.redirect('/login');
    // }
    var IMAccount = req.session.user.IMAccount;
    var IMPwd = req.session.user.IMPwd;
    if(!IMAccount || !IMPwd) {
        res.redirect("/login");
    }else{
        res.cookie("IMAccount",IMAccount);
        res.cookie("IMPwd",IMPwd);
        res.render('IM/message',JADE_VAR);
    }
};



module.exports = {
    im:im
};
