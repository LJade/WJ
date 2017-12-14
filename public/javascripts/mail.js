var doCreateMail = function () {
    var data = {};
    data.title = getElementValue('title');
    data.sendTime = getElementValue('date') + ' 00:00:00';
    data.receivedUserIdList = getElementValue('choosePersonId').split(",");
    data.content = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    // 开始提交
    $.ajax({
        url:"/mail/send_mail",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/mail/mail_send';
            }},
        error:function (err) {
            window.location.reload();
        }
    });
};

$('#send_mail').click(function(){doCreateMail()});

