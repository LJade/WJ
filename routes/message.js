
var assert = require('./assert.js');

var im = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(!req.session.user){
        res.redirect('/login');
    }
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

var getIMAccountIcon = function (req, res, next) {
    req.query = req.body;
    assert.apiRequest("get",'/user/contacts',req).then(function (results) {
        res.header('Content-Type',"application/json");
        res.send(results);
    }).catch(function (error) {
        assert.processError(error,res);
    })
};



module.exports = {
    im:im,
    getIMAccountIcon:getIMAccountIcon
};
