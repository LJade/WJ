var doCreateDocument = function () {
    var data = {};
    data.title = getElementValue('title');
    data.publicTime = getElementValue('date') + ' 00:00:00';
    data.lookUpPersonId = getElementValue('choosePersonId').split(",");
    data.content = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    //检查是否是修改
    var commonalityArticleId = $('#commonalityArticleId');
    if(commonalityArticleId.length && commonalityArticleId.val() !== ''){
        data.commonalityArticleId = commonalityArticleId.val();
    }
    // 开始提交
    $.ajax({
        url:"/docu/docu_save",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/docu/docu_manage';
            }},
        error:function (err) {
            window.location.reload();
        }
    });
};

$('#save_document').click(function(){doCreateDocument()});

