var assert = require('./assert.js');

var message = function (req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取消息列表
    var messageList = assert.apiRequest("get", "/index/messageList", req);
    messageList.then(function (results) {
        var messagesList = {
            code:1,
            dat:{
                details:[]
            }
        };
        try {
            messagesList = JSON.parse(results);
        }catch(e){
            console.log("接口请求错误");
        }
        if (messagesList.code === 1) {
            //对数据处理
            var messageTypeCount = [0, 0, 0];
            var documentMessages = [];
            var newsMessages = [];
            var noticeMessages = [];
            messagesList.dat.details.forEach(function (message) {
                if (message.messageType === 1) {
                    messageTypeCount[0] += 1;
                    documentMessages.push(message);
                }
                if (message.messageType === 2) {
                    messageTypeCount[1] += 1;
                    newsMessages.push(message);
                }
                if (message.messageType === 3) {
                    messageTypeCount[2] += 1;
                    noticeMessages.push(message);
                }
            });
            //找出最后的时间
            JADE_VAR.messageTypeCount = messageTypeCount;
            JADE_VAR.documentMessages = documentMessages;
            JADE_VAR.newsMessages = newsMessages;
            JADE_VAR.noticeMessages = noticeMessages;
            res.render('message/message', JADE_VAR);
        } else {
            res.render("error/error", {message: messagesList.msg});
        }
    }).catch(function (error) {
        assert.processError(error,res);
    });
};

var test = function (req, res, next) {
    var depInfo = [{
        "id": 1,
        "name": "吴江交通局",
        "parentId": 0,
        "children": [
            {
                "id": 2,
                "name": "信息科",
                "parentId": 1,
                "children": [
                    {
                        "id": 3,
                        "name": "保卫处1",
                        "parentId": 2,
                        "children": [],
                        "users": [
                            {
                                "id": 0,
                                "name": "卢"
                            }
                        ]
                    }
                ],
                "users": []
            }
        ],
        "users": [
            {
                "id": 0,
                "name": "卢"
            }
        ]
    }];

    var results = assert.makeZTreeData(depInfo,[]);
};


module.exports = {
    message: message,
    test: test
};
