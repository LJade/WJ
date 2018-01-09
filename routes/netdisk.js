
var assert = require('./assert.js');

var company_disk = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.query.type = 1;
    if(!req.query.pkey){
        req.query.pkey = 0;
    }
    assert.apiRequest("get","/netDisk/list",req).then(function (results) {
        results = JSON.stringify({
            "msg": "请求成功",
            "code": 1,
            "dat":
                [
                    {
                        "name": "我的第一个文件夹",
                        "key": "9bf4d2fe947244858c9a93c1813d3d5a",
                        "fileSize": "0",
                        "isDir": 1,
                        "uploadTime": "2018-01-09 17:51:17"
                    },
                    {
                        "name": "图片.png",
                        "key": "9bf4d2fe947244858c9a93c1813d3d5c",
                        "fileSize": "33",
                        "isDir": 0,
                        "uploadTime": "2018-01-02 17:47:19"
                    },
                    {
                        "name": "我的txt.txt",
                        "key": "9bf4d2fe947244858c9a93c1813d3d5c",
                        "fileSize": "33",
                        "isDir": 0,
                        "uploadTime": "2018-01-02 17:47:19"
                    },
                    {
                        "name": "我的第doc.doc",
                        "key": "9bf4d2fe947244858c9a93c1813d3d5c",
                        "fileSize": "33",
                        "isDir": 0,
                        "uploadTime": "2018-01-02 17:47:19"
                    },
                    {
                        "name": "hahahh.mp3",
                        "key": "9bf4d2fe947244858c9a93c1813d3d5c",
                        "fileSize": "33",
                        "isDir": 0,
                        "uploadTime": "2018-01-02 17:47:19"
                    }
                ]
        });
        var diskRes = JSON.parse(results);
        if(diskRes.code === 1){
            //对类型进行解析,返回不同的类名
            var diskList = diskRes.dat;
            diskList.forEach(function (data,index) {
                if(data.isDir === 1){
                    diskList[index].icon_type = 'folder';
                }else{
                    diskList[index].icon_type = 'file';
                    var extArr = data.name.split(".");
                    var ext = "null";
                    if(extArr.length === 2){
                        ext = extArr[1];
                    }
                    if(['png','jpg','jpeg','bpm','gif','ai','psd','pcx','exif'].indexOf(ext) !== -1){
                        diskList[index].icon_type = 'picture';
                    }
                    if(['mp3','flac','wav','wma','ra','ogg','ape','aac','ape'].indexOf(ext) !== -1){
                        diskList[index].icon_type = 'sound';
                    }
                    if(['doc','docx','xlsx','ppt','xls'].indexOf(ext) !== -1){
                        diskList[index].icon_type = 'word';
                    }
                    if(['txt'].indexOf(ext) !== -1){
                        diskList[index].icon_type = 'file';
                    }
                    if(['avi','mp4','mpg4'].indexOf(ext) !== -1){
                        diskList[index].icon_type = 'video';
                    }
                }
            });
            JADE_VAR.diskList = diskList;
            JADE_VAR.pKey = req.query.pkey;
            JADE_VAR.authData = req.session.user.accessToken;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With,WJ-AUTH");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By",' 3.2.1');
            next();
            res.render('netdisk/company_disk',JADE_VAR);
        }else{
            res.render("error/error",{message:diskRes.msg})
        }
    });
};

var company_disk_parson = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    req.query.type = 2;
    if(!req.query.pkey){
        req.query.pkey = 0;
    }
    assert.apiRequest("get","/netDisk/list",req).then(function (results) {
        var diskRes = JSON.parse(results);
        if(diskRes.code === 1){
            JADE_VAR.diskList = diskRes.dat;
            res.render('netdisk/company_disk_parson',JADE_VAR);
        }else{
            res.render("error/error",{message:diskRes.msg})
        }
    });
};

var company_disk_recycle = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    res.render('netdisk/company_disk_recycle',JADE_VAR);
};

var disk_upload_file = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,WJ-AUTH");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.send(200);
};



module.exports = {
    company_disk:company_disk,
    company_disk_recycle:company_disk_recycle,
    company_disk_parson:company_disk_parson,
    disk_upload_file:disk_upload_file
};
