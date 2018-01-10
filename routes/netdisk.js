var formidable = require("formidable");
var assert = require('./assert.js');
var request = require('request');
var fs = require("fs");

var company_disk = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.query.type = 1;
    if (!req.query.pkey) {
        req.query.pkey = 0;
    }
    //获取其他参数
    assert.apiRequest("get", "/netDisk/list", req).then(function (results) {
        var diskRes = JSON.parse(results);
        if (diskRes.code === 1) {
            //对类型进行解析,返回不同的类名
            var diskList = diskRes.dat;
            diskList.forEach(function (data, index) {
                if (data.isDir === 1) {
                    diskList[index].icon_type = 'file';
                } else {
                    diskList[index].icon_type = 'folder';
                    var extArr = data.name.split(".");
                    var ext = "null";
                    if (extArr.length === 2) {
                        ext = extArr[1];
                    }
                    if (['png', 'jpg', 'jpeg', 'bpm', 'gif', 'ai', 'psd', 'pcx', 'exif'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'picture';
                    }
                    if (['mp3', 'flac', 'wav', 'wma', 'ra', 'ogg', 'ape', 'aac', 'ape'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'sound';
                    }
                    if (['doc', 'docx', 'xlsx', 'ppt', 'xls'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'word';
                    }
                    if (['txt'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'file';
                    }
                    if (['avi', 'mp4', 'mpg4'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'video';
                    }
                    if(diskList[index].fileSize){
                        diskList[index].fileSize = assert.formatNum(String(diskList[index].fileSize))
                    }
                }
            });
            JADE_VAR.diskList = diskList;
            JADE_VAR.pKey = req.query.pkey;
            res.render('netdisk/company_disk', JADE_VAR);
        } else {
            res.render("error/error", {message: diskRes.msg})
        }
    });
};

var company_disk_parson = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.query.type = 2;
    if (!req.query.pkey) {
        req.query.pkey = 0;
    }
    assert.apiRequest("get", "/netDisk/list", req).then(function (results) {
        var diskRes = JSON.parse(results);
        if (diskRes.code === 1) {
            //对类型进行解析,返回不同的类名
            var diskList = diskRes.dat;
            diskList.forEach(function (data, index) {
                if (data.isDir === 1) {
                    diskList[index].icon_type = 'file';
                } else {
                    diskList[index].icon_type = 'folder';
                    var extArr = data.name.split(".");
                    var ext = "null";
                    if (extArr.length === 2) {
                        ext = extArr[1];
                    }
                    if (['png', 'jpg', 'jpeg', 'bpm', 'gif', 'ai', 'psd', 'pcx', 'exif'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'picture';
                    }
                    if (['mp3', 'flac', 'wav', 'wma', 'ra', 'ogg', 'ape', 'aac', 'ape'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'sound';
                    }
                    if (['doc', 'docx', 'xlsx', 'ppt', 'xls'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'word';
                    }
                    if (['txt'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'file';
                    }
                    if (['avi', 'mp4', 'mpg4'].indexOf(ext) !== -1) {
                        diskList[index].icon_type = 'video';
                    }
                    if(diskList[index].fileSize){
                        diskList[index].fileSize = assert.formatNum(String(diskList[index].fileSize))
                    }
                }
            });
            JADE_VAR.diskList = diskList;
            JADE_VAR.pKey = req.query.pkey;
            JADE_VAR.authData = req.session.user.accessToken;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With,WJ-AUTH");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By", ' 3.2.1');
            next();
            res.render('netdisk/company_disk_parson', JADE_VAR);
        } else {
            res.render("error/error", {message: diskRes.msg})
        }
    });
};

var company_disk_recycle = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('netdisk/company_disk_recycle', JADE_VAR);
};

var disk_upload_file = function (req, res, next) {
    var sessionId = req.session.user.accessToken;
    //获取请求上传的文件
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var formData = fields;
        formData.file = {
            value:fs.createReadStream(files.file.path),
                options:{
                filename:files.file.name,
                    contentType:files.file.type
            }
        };
        request.post({
            url: assert.API_HOST + "/netDisk/upload",
            headers: {'WJ-AUTH': sessionId},
            formData: formData
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                res.send(JSON.stringify({code:-1,msg:String(err)}))
            }else{
                res.send(body);
            }
        });
    });
};

var delete_file = function (req, res, next) {
    assert.apiRequest("post","/netDisk/delete",req).then(function (results) {
        res.send(results);
    })
};

var new_folder = function (req, res, next) {
    assert.apiRequest("post","/netDisk/createDir",req).then(function (results) {
        res.send(results);
    })
};

var download_file = function (req, res, next) {
    assert.apiRequest("get","/netDisk/download",req).then(function (results) {
        res.send(results);
    })
};

module.exports = {
    company_disk: company_disk,
    company_disk_recycle: company_disk_recycle,
    company_disk_parson: company_disk_parson,
    disk_upload_file: disk_upload_file,
    delete_file:delete_file,
    new_folder:new_folder,
    download_file:download_file
};
