
var doCreateNotice = function () {
    var data = {};
    data.title = getElementValue('title');
    data.publicTime = getElementValue('date') + " 00:00:00";
    data.lookUpPersonId = getElementValue('choosePersonId').split(",");
    data.content = getElementValue('content');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    //获取消息ID
    var announcementId = $("#announcementId");
    if(announcementId.length){
        data.announcementId = announcementId.val();
    }else {
        data.announcementId = "";
    }
    //开始提交
    $.ajax({
        url:"/notice/notice_save",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
        if(data.code == 1){
            layerAlert("操作成功");
            if(announcementId.length){
                window.location.href='/notice/notice_manage';
            }else {
                window.location.href='/notice/notice_list';
            }
        }else{
            layerAlert(data.msg,'error');
        }},
        error:function (err) {
            layerAlert('发布失败,网络原因。请稍后重试','error');
            window.location.reload();
        }
    });
};

$('#notice_save').click(function(){doCreateNotice()});

