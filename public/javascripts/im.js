var options = {
    apiUrl: WebIM.config.apiURL,
    user: WebIM.config.autoSignInName,
    pwd: WebIM.config.autoSignInPwd,
    appKey: WebIM.config.appkey
};
Demo.conn.open(options);
$(".webim-profile-avatar").find("img").attr("src",$.cookie("headIcon"));
//获取好友列表
Demo.conn.getRoster({
    success: function ( roster ) {
        console.log(roster);
        for ( var i = 0, l = roster.length; i < l; i++ ) {
            var ros = roster[i];
            var contact = [];
            console.log(ros);
            if ( ros.subscription === 'both' || ros.subscription === 'to' ) {
                console.log(ros);
            }
        }
    },
});

var refershIcon = setInterval(function () {
    var contact_list = $('.webim-contact-item');
    if(contact_list.length){
        var contact = [];
        contact_list.each(function (index,data) {
            if(!$(data).parent().hasClass("hide")){
                contact.push($(data).attr("id"));
            }
        });

        //获取到了所有的ID,则开始请求接口
        $.post("/im/getIMAccountIcon",{imAccounts:String(contact)},function (result) {
            //然后执行替换操作
            if(result.code !== 1){
                layerAlert("获取聊天好友头像信息失败",'error');
            }else{
                //开始替换
                result.dat.forEach(function (iconInfo) {
                    console.log(iconInfo);
                    $('#'+iconInfo.imAccount).find(".webim-avatar-icon").find("img").attr("src",iconInfo.headIcon);
                    $('#'+iconInfo.imAccount).find(".webim-contact-username").text(iconInfo.nickname);
                });
                window.localStorage.setItem("iconInfo",JSON.stringify(result.dat));
                clearInterval(refershIcon);
            }
        },'json')
    }else{
        console.log("等待loading");
    }
},50);
