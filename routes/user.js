
var assert = require('./assert.js');

var user_center = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get",'/user/info',req).then(function (results) {
        var userRes = JSON.parse(results);
        console.log(results);
        if(userRes.code === 1){
            JADE_VAR.user = userRes.dat;
            res.render('user/user_center',JADE_VAR);
        }else{
            res.render('error/error',{message:userRes.msg});
        }
    }).catch(function (error) {
        assert.processError(error,res);
    });
};

var change_pass = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('user/change_pass',JADE_VAR);
};

var user_save = function (req, res, next) {
    assert.apiRequest('post','/user/editInfo',req).then(function (results) {
        var saveRes = JSON.parse(results);
        if(saveRes.code === 1){
            res.redirect('/user/user_center');
        }else{
            res.render("error/error",{message:saveRes.msg});
        }
    }).catch(function (error) {
        assert.processError(error,res);
    })
}



module.exports = {
    user_center:user_center,
    change_pass:change_pass,
    user_save:user_save
};
