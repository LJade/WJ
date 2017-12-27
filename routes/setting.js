var assert = require('./assert.js');

var app_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.appInfo = {
        "id":"",
        "name":"",
        "uploaderName":"",
        "uploadTime":""
    };
    JADE_VAR.edit = false;
    res.render('setting/app_create', JADE_VAR);
};

var region_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/region_manage', JADE_VAR);
};

var organization_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var depAll = assert.apiRequest('get', '/department/allDept', req);
    depAll.then(function (results) {
        var depAllInfo = JSON.parse(results);
        if (depAllInfo.code !== 1) {
            res.render('error/error', {message: depAllInfo.msg});
        } else {
            JADE_VAR.depAll = JSON.stringify(depAllInfo.dat);
            res.render('setting/organization_manage', JADE_VAR);
        }
    });

};

var organization_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var depAll = assert.apiRequest('get', '/department/allDept', req);
    if (req.query.curId) {
        //这里为编辑
        Promise.all([depAll]).then(function (results) {
            var depInfo = JSON.parse(results[0]);
            JADE_VAR.pId = req.query.pId;
            JADE_VAR.curId = req.query.curId;
            if (depInfo.code === 1) {
                //从所有的列表中获取到
                JADE_VAR.depName = '';
                JADE_VAR.depInfo = {
                    label: "",
                    sortNum: ""
                };
                depInfo.dat.forEach(function (dep) {
                    if (dep.id === parseInt(req.query.pId)) {
                        JADE_VAR.depName = dep.label;
                    }
                    if (dep.id === parseInt(req.query.curId)) {
                        JADE_VAR.depInfo.label = dep.label;
                        JADE_VAR.depInfo.sortNum = 0;
                    }
                });
                if (JADE_VAR.depName) {
                    res.render('setting/organization_create', JADE_VAR);
                } else {
                    res.render('error/error', {"message": "获取部门信息失败"});
                }
            } else {
                res.render('error/error', {"message": depInfo.msg});
            }
        });
    } else {
        depAll.then(function (results) {
            JADE_VAR.pId = req.query.pId;
            JADE_VAR.depName = '';
            JSON.parse(results).dat.forEach(function (dep) {
                if (dep.id === parseInt(req.query.pId)) {
                    JADE_VAR.depName = dep.label;
                }
            });
            JADE_VAR.depInfo = {
                label: "",
                sortNum: ""
            };
            if (JADE_VAR.depName) {
                res.render('setting/organization_create', JADE_VAR);
            } else {
                res.render('error/error', {"message": "获取部门信息失败"});
            }
        })
    }
};

var organization_save = function (req, res, next) {
    var id = req.body.id;
    if (id === '') {
        delete req.body.id
    }
    assert.apiRequest('post', '/department/save', req).then(function (results) {
        var result = JSON.parse(results);
        if (result.code === 1) {
            res.redirect("/setting/organization_manage");
        } else {
            res.render('error/error', {message: result.msg})
        }
    })
};

var organization_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/organization_edit', JADE_VAR);
};

var user_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取所有用户
    var getAllUser = assert.apiRequest("get", '/privilege/user/list', req);
    var getAllRoleType = assert.apiRequest('get', '/privilege/role/list', req);
    Promise.all([getAllUser, getAllRoleType]).then(function (results) {
        var userInfo = JSON.parse(results[0]);
        var roleList = JSON.parse(results[1]);
        if (userInfo.code === 1 && roleList.code === 1) {
            JADE_VAR.users = userInfo.dat.details;
            JADE_VAR.roleList = roleList.dat;
            JADE_VAR.rowsCount = userInfo.dat.rowsCount;
            res.render('setting/user_manage', JADE_VAR);
        } else {
            console.log(userInfo,roleList);
            res.render('error/error', {"message": "获取信息失败"});
        }
    });
};

var user_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render("setting/user_create", JADE_VAR);
};

var role_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/role_create', JADE_VAR);
};

var role_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取角色的list
    var roleList = assert.apiRequest('get', '/privilege/role/list', req);
    var modulesList = assert.apiRequest('get', '/privilege/module/list', req);
    Promise.all([roleList, modulesList]).then(function (results) {
        var rolesList = JSON.parse(results[0]);
        var modulesList = JSON.parse(results[1]);
        if (rolesList.code === 1 && modulesList.code === 1) {
            JADE_VAR.rolesList = rolesList.dat;
            console.log(modulesList.dat);
            JADE_VAR.modulesList = JSON.stringify(modulesList.dat);
            res.render('setting/role_manage', JADE_VAR);
        } else {
            res.render('error/error', {message: rolesList.msg + "   " + modulesList.msg});
        }
    })
};


var role_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var roleId = req.query.roleId ? req.query.roleId : "";
    var edit = !!req.query.edit;
    var roleInfo = {
        id: "",
        name: "",
        modulesId: ""
    };
    var getAllUser = assert.apiRequest("get",'/department/allDeptAndUser',req);
    if (!roleId) {
        //表示是新增
        JADE_VAR.roleInfo = roleInfo;
        JADE_VAR.roleId = roleId;
        JADE_VAR.edit = true;
        //获取角色列表
        Promise.all([getAllUser]).then(function (results) {
            var usersList = JSON.parse(results[0]);
            if (usersList.code !== 1) {
                res.render("error/error", {message: usersList.msg})
            } else {
                //获取部门树和角色list
                JADE_VAR.userList = usersList.dat.list;
                JADE_VAR.depAll = assert.makeZTreeData([usersList.dat.tree],[]);
                res.render('setting/role_create', JADE_VAR);
            }
        });
    } else {
        //表示是编辑
        JADE_VAR.roleInfo = roleInfo;
        JADE_VAR.roleId = roleId;
        JADE_VAR.edit = edit;
        //获取角色详情
        var getRoleDetail = assert.apiRequest('get', '/privilege/role/detail', req);
        //获取角色列表
        Promise.all([getAllUser, getRoleDetail]).then(function (results) {
            var userList = JSON.parse(results[0]);
            var roleInfo = JSON.parse(results[1]);
            if (userList.code !== 1 || roleInfo.code !== 1) {
                res.render("error/error", {message: roleList.msg})
            } else {
                //获取部门树和角色list
                JADE_VAR.userList = userList.dat.list;
                JADE_VAR.depAll = JSON.stringify(assert.makeZTreeData([userList.dat.tree],[]));
                JADE_VAR.roleInfo = roleInfo.dat;
                res.render('setting/role_create', JADE_VAR);
            }
        });

    }
};

var role_permission = function (req, res, next) {
    assert.apiRequest('get', '/privilege/role/detail', req).then(function (results) {
        res.send(results);
    })
};

var role_save = function (req, res, next) {
    var moduleIds = req.body.moduleIds;
    var urlPath = '/privilege/role/save';
    if(moduleIds){
        urlPath = '/privilege/role/saveModule';
    }
    assert.apiRequest("post", urlPath, req).then(function (results) {
        res.send(results);
    })
};

var location_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/location_manage', JADE_VAR);
};

var log_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/log_manage', JADE_VAR);
};

var app_permission = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get','/clientExe/iconList',req).then(function (results) {
        var appListRes = JSON.parse(results);
        if(appListRes.code === 1){
            JADE_VAR.apps = appListRes.dat;
            res.render('setting/app_permission',JADE_VAR);
        }else{
            res.render('error/error',{message:appListRes.msg});
        }
    });
};

var contact_addpage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var id = req.query.id;
    //表示新增
    JADE_VAR.webInfo = {
        "id": "",
        "name": "",
        "sortNum": "",
        "descText": "",
        "indexUrl": ""
    };
    JADE_VAR.edit = false;
    if(id){
        assert.apiRequest('get','/thirdPart/detail',req).then(function (results) {
            var webInfoRes = JSON.parse(results);
            if(webInfoRes.code === 1){
                JADE_VAR.webInfo = webInfoRes.dat;
                JADE_VAR.edit = true;
                res.render('setting/contact_addpage', JADE_VAR);
            }else{
                res.render('error/error',{message:webInfoRes.msg});
                return;
            }
        })
    }else{
        res.render('setting/contact_addpage', JADE_VAR);
    }
};

var contact_config = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/contact_config', JADE_VAR);
};

var user_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'userIds');
    assert.apiRequest('post', '/privilege/user/delete', req).then(function (results) {
        res.send(results);
    });
};

var user_save = function (req, res, next) {
    req.body.roleIds = String(req.body.roleIds);
    req.body.id = req.body.userId;
    delete req.body.userId;
    assert.apiRequest('post', '/privilege/user/save', req).then(function (results) {
        var result = JSON.parse(results);
        if (result.code === 1) {
            res.redirect("/setting/user_manage");
        } else {
            res.render('error/error', {message: result.msg});
        }
    });
};

var user_edit = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var userId = req.query.userId ? req.query.userId : "";
    var edit = !!req.query.edit;
    var userInfo = {
        id: "",
        name: "",
        loginAccount: "",
        roleIds: "",
        deptIds: ""
    };
    var roleList = assert.apiRequest('get', '/privilege/role/list', req);
    var depAll = assert.apiRequest('get', '/department/allDept', req);
    if (!userId) {
        //表示是新增
        JADE_VAR.userInfo = userInfo;
        JADE_VAR.userId = userId;
        JADE_VAR.edit = true;
        //获取角色列表
        Promise.all([roleList, depAll]).then(function (results) {
            var roleList = JSON.parse(results[0]);
            var depList = JSON.parse(results[1]);
            if (roleList.code !== 1 || depList.code !== 1) {
                res.render("error/error", {message: roleList.msg})
            } else {
                //获取部门树和角色list
                JADE_VAR.rolesList = roleList.dat;
                JADE_VAR.depAll = JSON.stringify(depList.dat);
                res.render('setting/user_create', JADE_VAR);
            }
        });
    } else {
        //表示是编辑
        JADE_VAR.userInfo = userInfo;
        JADE_VAR.userId = userId;
        JADE_VAR.edit = edit;
        //获取用户详情
        var getUserDetail = assert.apiRequest('get', '/privilege/user/detail', req);
        //获取角色列表
        Promise.all([roleList, depAll, getUserDetail]).then(function (results) {
            var roleList = JSON.parse(results[0]);
            var depList = JSON.parse(results[1]);
            var userInfoAPI = JSON.parse(results[2]);
            if (roleList.code !== 1 || depList.code !== 1 || userInfoAPI.code !== 1) {
                res.render("error/error", {message: roleList.msg})
            } else {
                //获取部门树和角色list
                JADE_VAR.rolesList = roleList.dat;
                JADE_VAR.depAll = JSON.stringify(depList.dat);
                JADE_VAR.userInfo = userInfoAPI.dat;
                res.render('setting/user_create', JADE_VAR);
            }
        });

    }
};

var contact_manage = function (req, res, next){
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get',"/thirdPart/list",req).then(function (results) {
        var webList = JSON.parse(results);
        if(webList.code === 1){
            JADE_VAR.webLists = webList.dat;
            JADE_VAR.rowsCount = webList.dat.length;
            res.render("setting/contact_manage",JADE_VAR);
        }else{
            res.render('error/error',{message:webList.msg});
        }
    });
};

var contact_delete = function (req, res,next) {
    assert.apiRequest('post','/thirdPart/delete',req).then(function (results) {
        res.send(results);
    })
};

var contact_save = function (req, res, next) {
    assert.apiRequest('post','/thirdPart/save',req).then(function (results) {
        var saveRes = JSON.parse(results);
        if(saveRes.code === 1){
            res.redirect('/setting/contact_manage');
        }else{
            res.render("error/error",{message:saveRes.m})
        }
    })
};


var app_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get','/clientExe/list',req).then(function (results) {
        var appListRes = JSON.parse(results);
        if(appListRes.code === 1){
            JADE_VAR.apps = appListRes.dat;
            res.render('setting/app_manage',JADE_VAR);
        }else{
            res.render('error/error',{message:appListRes.msg});
        }
    })
};

module.exports = {
    app_create: app_create,
    region_manage: region_manage,
    organization_manage: organization_manage,
    organization_create: organization_create,
    organization_edit: organization_edit,
    user_manage: user_manage,
    role_create: role_create,
    role_manage: role_manage,
    location_manage: location_manage,
    log_manage: log_manage,
    app_permission: app_permission,
    contact_addpage: contact_addpage,
    contact_edit:contact_addpage,
    contact_config: contact_config,
    organization_save: organization_save,
    user_delete: user_delete,
    user_save: user_save,
    user_edit: user_edit,
    role_permission: role_permission,
    role_edit: role_edit,
    role_save: role_save,
    contact_manage:contact_manage,
    contact_delete:contact_delete,
    contact_save:contact_save,
    app_manage:app_manage

};
