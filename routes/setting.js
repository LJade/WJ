var assert = require('./assert.js');

var app_create = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    JADE_VAR.appInfo = {
        "id": "",
        "name": "",
        "uploaderName": "",
        "uploadTime": ""
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
    if (req.query.edit === 'true') {
        //这里为编辑
        Promise.all([depAll]).then(function (results) {
            var depInfo = JSON.parse(results[0]);
            if (depInfo.code === 1) {
                JADE_VAR.pId = req.query.pId;
                JADE_VAR.curId = req.query.curId;
                //从所有的列表中获取到
                var parentName = "";
                var name = "";
                depInfo.dat.forEach(function (dep) {
                    if (parseInt(dep.id) === parseInt(req.query.pId)) {
                        parentName = dep.label;
                    }

                    if (parseInt(dep.id) === parseInt(req.query.curId)) {
                        name = dep.label;
                    }
                });
                if (parentName && name) {
                    JADE_VAR.depInfo = {
                        label:name,
                        sortNum:0
                    };
                    JADE_VAR.depName = parentName;
                    res.render('setting/organization_create', JADE_VAR);
                } else {
                    res.render('error/error', {"message": "获取部门信息失败"});
                }
            } else {
                res.render('error/error', {"message": depInfo.msg});
            }
        }).catch(function(error){
            assert.processError(error,res);
        });
    } else {
        depAll.then(function (results) {
            JADE_VAR.pId = req.query.pId;
            JADE_VAR.depName = '';
            console.log(req.query);
            JSON.parse(results).dat.forEach(function (dep) {
                if (parseInt(dep.id) === parseInt(req.query.pId)) {
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
        }).catch(function(error){
            assert.processError(error,res);
        })
    }
};

var organization_save = function (req, res, next) {
    var id = req.body.id;
    if (id === '' || !id) {
        delete req.body.id
    }
    assert.apiRequest('post', '/department/save', req).then(function (results) {
        var result = JSON.parse(results);
        if (result.code === 1) {
            res.redirect("/setting/organization_manage");
        } else {
            res.render('error/error', {message: result.msg})
        }
    }).catch(function(error){
        assert.processError(error,res);
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
            res.render('error/error', {"message": userInfo.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
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
    }).catch(function(error){
        assert.processError(error,res);
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
    var getAllUser = assert.apiRequest("get", '/department/allDeptAndUser', req);
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
                JADE_VAR.depAll = assert.makeZTreeData([usersList.dat.tree], []);
                JADE_VAR.lookUpPersonId = "";
                res.render('setting/role_create', JADE_VAR);
            }
        }).catch(function(error){
            assert.processError(error,res);
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
                JADE_VAR.depAll = assert.makeZTreeData([userList.dat.tree], []);
                JADE_VAR.roleInfo = roleInfo.dat;
                JADE_VAR.lookUpPersonId = roleInfo.dat.userIds;
                res.render('setting/role_create', JADE_VAR);
            }
        }).catch(function(error){
            assert.processError(error,res);
        });
    }
};

var role_permission = function (req, res, next) {
    assert.apiRequest('get', '/privilege/role/detail', req).then(function (results) {
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var role_save = function (req, res, next) {
    var moduleIds = req.body.moduleIds;
    var urlPath = '/privilege/role/save';
    if (moduleIds) {
        urlPath = '/privilege/role/saveModule';
    }
    assert.apiRequest("post", urlPath, req).then(function (results) {
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var location_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('setting/location_manage', JADE_VAR);
};

var log_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    if(req.query.date){
        req.query.opDate = req.query.date;
    }
    assert.apiRequest("get","/userLog/list",req).then(function (results) {
        var logRes = JSON.parse(results);
        if(logRes.code === 1){
            JADE_VAR.logList = logRes.dat.details;
            JADE_VAR.rowsCount = logRes.dat.rowsCount;
            res.render('setting/log_manage', JADE_VAR);
        }else{
            res.render('error/error', {message:logRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })

};

var app_permission = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get', '/clientExe/iconList', req).then(function (results) {
        var appListRes = JSON.parse(results);
        if (appListRes.code === 1) {
            JADE_VAR.apps = appListRes.dat;
            res.render('setting/app_permission', JADE_VAR);
        } else {
            res.render('error/error', {message: appListRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
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
    if (id) {
        assert.apiRequest('get', '/thirdPart/detail', req).then(function (results) {
            var webInfoRes = JSON.parse(results);
            if (webInfoRes.code === 1) {
                JADE_VAR.webInfo = webInfoRes.dat;
                JADE_VAR.edit = true;
                res.render('setting/contact_addpage', JADE_VAR);
            } else {
                res.render('error/error', {message: webInfoRes.msg});
                return;
            }
        }).catch(function(error){
            assert.processError(error,res);
        })
    } else {
        res.render('setting/contact_addpage', JADE_VAR);
    }
};

var contact_config = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //首先获取人员和部门信息
    var getAllUser = assert.apiRequest("get", '/department/allDeptAndUser', req);
    //获取子系统
    var getConfigDetail = assert.apiRequest('get', '/thirdPart/allTree', req);
    //对数据进行处理
    Promise.all([getAllUser,getConfigDetail]).then(function (results) {
        var allUserInfoRes = JSON.parse(results[0]);
        var contactDetailRes = JSON.parse(results[1]);
        if(allUserInfoRes.code === 1 && contactDetailRes.code === 1){
            //所有数据请求正常
            JADE_VAR.userList = allUserInfoRes.dat.list;
            JADE_VAR.depAll = assert.makeZTreeData([allUserInfoRes.dat.tree], []);
            JADE_VAR.contactInfo = contactDetailRes.dat;
            res.render('setting/contact_config', JADE_VAR);
        }else{
            res.render("error/error", {message:"数据请求错误"});
        }
    }).catch(function(error){
        assert.processError(error,res);
    });
};

var user_delete = function (req, res, next) {
    req = assert.getArrPost(req, 'userIds');
    assert.apiRequest('post', '/privilege/user/delete', req).then(function (results) {
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
    });
};

var user_save = function (req, res, next) {
    var roleIds = req.body.roleIds;
    var deptIds = req.body.deptIds;
    if(!roleIds || deptIds === "" || roleIds === "" || !deptIds){
        res.render('error/error', {message: "部门或角色不能为空!"});
        return;
    }
    req.body.roleIds = req.body.roleIds ?  String(req.body.roleIds) : "";
    req.body.id = req.body.userId;
    delete req.body.userId;
    assert.apiRequest('post', '/privilege/user/save', req).then(function (results) {
        var result = JSON.parse(results);
        if (result.code === 1) {
            res.redirect("/setting/user_manage");
        } else {
            res.render('error/error', {message: result.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
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
        }).catch(function(error){
            assert.processError(error,res);
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
        }).catch(function(error){
            assert.processError(error,res);
        });
    }
};

var contact_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get', "/thirdPart/list", req).then(function (results) {
        var webList = JSON.parse(results);
        if (webList.code === 1) {
            JADE_VAR.webLists = webList.dat;
            JADE_VAR.rowsCount = webList.dat.length;
            res.render("setting/contact_manage", JADE_VAR);
        } else {
            res.render('error/error', {message: webList.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    });
};

var contact_delete = function (req, res, next) {
    assert.apiRequest('post', '/thirdPart/delete', req).then(function (results) {
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var contact_save = function (req, res, next) {
    assert.apiRequest('post', '/thirdPart/save', req).then(function (results) {
        var saveRes = JSON.parse(results);
        if (saveRes.code === 1) {
            res.redirect('/setting/contact_manage');
        } else {
            res.render("error/error", {message: saveRes.m})
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var app_manage = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest('get', '/clientExe/list', req).then(function (results) {
        var appListRes = JSON.parse(results);
        if (appListRes.code === 1) {
            JADE_VAR.apps = appListRes.dat;
            res.render('setting/app_manage', JADE_VAR);
        } else {
            res.render('error/error', {message: appListRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var data_service = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    assert.apiRequest("get", "/api/apiList", req).then(function (results) {
        results = JSON.stringify({
            "msg": "请求成功",
            "code": 1,
            "dat":
                [
                    {
                        "id": 1,
                        "name": "智慧港航",
                        "sortNum": 0,
                        "descText": "智慧港航是一个很大的工程",
                        "indexUrl": "https://www.baidu.com"
                    }
                ]
        });
        var resultsRes = JSON.parse(results);
        if (resultsRes.code === 1) {
            var apiList = resultsRes.dat;
            JADE_VAR.apis = apiList;
            JADE_VAR.rowsCount = apiList.length;
            res.render("setting/data_service", JADE_VAR);
        } else {
            res.render("error/error", {message: resultsRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var data_service_config = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    var getApiInfo = assert.apiRequest("get", "/api/detail", req);
    var getApiList = assert.apiRequest("get", "/api/allList", req);
    Promise.all([getApiInfo, getApiList]).then(function (results) {
        results = [];
        results[0] = JSON.stringify({
            "msg": "请求成功",
            "code": 1,
            "dat":
                {
                    "id": 1,
                    "name": "智慧港航",
                    "sortNum": 0,
                    "descText": "智慧港航是一个很大的工程",
                    "indexUrl": "https://www.baidu.com",
                    "clientKey": "uyhashdy123klhahf",
                    "clientSecret": "354313541",
                    "apis": "1,4,26,6",
                    "openStatus":"open"
                }
        });
        results[1] = JSON.stringify({
            "msg": "请求成功",
            "code": 1,
            "dat":
                [
                    {
                        "id": 1,
                        "name": "智慧港航"
                    },
                    {
                        "id": 4,
                        "name": "妈卖批啊"
                    },
                    {
                        "id": 6,
                        "name": "哈航哈"
                    },
                    {
                        "id": 26,
                        "name": "去吧去吧"
                    }
                ]
        });
        var apiInfoRes = JSON.parse(results[0]);
        var apiListRes = JSON.parse(results[1]);
        if (apiInfoRes.code === 1 && apiListRes.code === 1) {
            JADE_VAR.apiInfo = apiInfoRes.dat;
            JADE_VAR.apiList = apiListRes.dat;
            res.render("setting/data_service_config", JADE_VAR);
        } else {
            res.render("error/error", {message: apiInfoRes.msg + apiListRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var data_service_delete = function (req, res, next) {
    assert.apiRequest("post", "/api/delete", req).then(function (results) {
        results = JSON.stringify({code: 1, msg: "成功", dat: null});
        var resulstRes = JSON.parse(results);
        if (resulstRes.code === 1) {
            res.send(results);
        } else {
            res.render("error/error", {message: resulstRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var data_service_save = function (req, res, next) {
    console.log(req.body);
    assert.apiRequest("post", "/api/save", req).then(function (results) {
        results = JSON.stringify({code: 1, msg: "成功", dat: null});
        var resultsRes = JSON.parse(results);
        if (resultsRes.code === 1) {
            res.redirect("/setting/data_service");
        } else {
            res.render("error/error", {message: resultsRes.msg});
        }
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var log_delete = function (req, res, next) {
    assert.apiRequest("post","/userLog/delete",req).then(function (results) {
        results = JSON.stringify({code:1,msg:"成功",dat:null});
        res.send(results)
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var contact_config_save = function (req, res, next) {
    assert.apiRequest("post","/thirdPart/saveUserPrivilege",req).then(function (results) {
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
    })
};

var approve_send = function (req, res, next) {
    assert.apiRequest("post","/flow/audit",req).then(function (results) {
        results = JSON.stringify({code:1,msg:"操作成功",dat:null});
        var resRes = JSON.parse(results);
        res.send(results);
    }).catch(function(error){
        assert.processError(error,res);
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
    contact_edit: contact_addpage,
    contact_config: contact_config,
    organization_save: organization_save,
    user_delete: user_delete,
    user_save: user_save,
    user_edit: user_edit,
    role_permission: role_permission,
    role_edit: role_edit,
    role_save: role_save,
    contact_manage: contact_manage,
    contact_delete: contact_delete,
    contact_save: contact_save,
    app_manage: app_manage,
    data_service: data_service,
    data_service_config: data_service_config,
    data_service_delete: data_service_delete,
    data_service_save: data_service_save,
    log_delete:log_delete,
    contact_config_save:contact_config_save,
    approve_send:approve_send
};
