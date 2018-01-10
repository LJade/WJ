var options = {
    apiUrl: WebIM.config.apiURL,
    user: WebIM.config.autoSignInName,
    pwd: WebIM.config.autoSignInPwd,
    appKey: WebIM.config.appkey
};
Demo.conn.open(options);
$(".webim-profile-avatar").find("img").attr("src",$.cookie("headIcon"));

var refershIcon = setInterval(function () {
    var contact_list = $('.webim-contact-item');
    if(contact_list.length){
        var contact = [];
        contact_list.each(function (index,data) {
            if($(data).parent().hasClass("hide") === false){
                contact.push($(data).attr("id"));
            }
        });
        //获取到了所有的ID,则开始请求接口
        if(contact.length > 0){
            $.post("/im/getIMAccountIcon",{imAccounts:String(contact)},function (result) {
                //然后执行替换操作
                if(result.code !== 1){
                    layerAlert("获取聊天好友头像信息失败",'error');
                    clearInterval(refershIcon);
                }else{
                    //开始替换
                    result.dat.forEach(function (iconInfo) {
                        $('#'+iconInfo.imAccount).find(".webim-avatar-icon").find("img").attr("src",iconInfo.headIcon);
                        $('#'+iconInfo.imAccount).find(".webim-contact-username").text(iconInfo.nickname);
                    });
                    window.localStorage.setItem("iconInfo",JSON.stringify(result.dat));
                    clearInterval(refershIcon);
                }
            },'json')
        }else{
            console.log("继续获取");
        }
    }else{
        console.log("等待loading");
    }
},50);

var getNickNameById = function (name) {
    var results = name;
    var iconInfo = window.localStorage.getItem("iconInfo");
    if(iconInfo){
        iconInfo = JSON.parse(iconInfo);
        iconInfo.forEach(function (info) {
            if(info.imAccount === name){
                results = info.nickname;
            }
        })
    }
    return results;
};
