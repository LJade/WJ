var getElementValue = function(id){
    return $("#"+id).val();
};

var doCreateDocument = function () {
    var data = {};
    data.title = getElementValue('title');
    data.creator = getElementValue('creator');
    data.lookUpPersonId = [1,2,3];
    data.content = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        alert(checkInfo);
        return;
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
                alert("发布成功");
                window.location.reload();
            }},
        error:function (err) {
            console.log(err);
        }
    });
};

$('#save_document').click(function(){doCreateDocument()});
