var getElementValue = function(id){
    return $("#"+id).val();
};

var doCreateDocument = function () {
    var data = {};
    data.title = getElementValue('title');
    data.creator = getElementValue('creator');
    data.lookUpPersonId = getElementValue('review');
    data.content = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        alert(checkInfo);
        return;
    }
    //开始提交
    $.post("/docu/docu_save",data,function (data) {
        if(data.code == 1){
            alert("发布成功");
            window.location.reload();
        }
    })
};

$('#save_document').click(function(){doCreateDocument()});

