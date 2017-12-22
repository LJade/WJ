
var assert = require('./assert.js');

var message = function(req, res, next) {
    var JADE_VAR = assert.getJADE();
    //获取消息列表
    var messageList = assert.apiRequest("get","/index/messageList",req);
    messageList.then(function (results) {
        var messagesList = JSON.parse(results);
        if(messagesList.code === 1){
            //对数据处理
            var messageTypeCount = [0,0,0];
            var documentMessages = [];
            var newsMessages = [];
            var noticeMessages = [];
            messagesList.dat.details.forEach(function (message) {
                if(message.messageTye === 1){
                    messageTypeCount[0] += 1;
                    documentMessages.push(message);
                }
                if(message.messageTye === 2){
                    messageTypeCount[1] += 1;
                    newsMessages.push(message);
                }
                if(message.messageTye === 3){
                    messageTypeCount[2] += 1;
                    noticeMessages.push(message);
                }
            });
            //找出最后的时间
            JADE_VAR.messageTypeCount = messageTypeCount;
            JADE_VAR.documentMessages = documentMessages;
            JADE_VAR.newsMessages = newsMessages;
            JADE_VAR.noticeMessages = noticeMessages;
            res.render('message/message',JADE_VAR);
        }else{
            res.render("error/error",{message:messagesList.msg});
        }
    });
    res.render('message/message',JADE_VAR);
};



module.exports = {
    message:message
};
