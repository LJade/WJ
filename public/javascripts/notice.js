
var getElementValue = function(id){
    return $("#"+id).val();
};

var doCreateNotice = function () {
    var data = {};
    data.title = getElementValue('title');
    data.publicTime = getElementValue('publicTime');
    data.lookUpPersonId = getElementValue('lookUpPersonId');
    data.content = getElementValue('content');
    var checkInfo = checkValue(data);
    if(checkInfo){
        alert(checkInfo);
        return;
    }
    //开始提交
    // $.ajax({
    //     url:"/news/news_save",
    //     data:data,
    //     method:"POST",
    //     traditional: true,
    //     dataType:'json',
    //     success:function (data) {
    //     if(data.code == 1){
    //         alert("发布成功");
    //         window.location.reload();
    //     }},
    //     error:function (err) {
    //         console.log(err);
    //     }
    // })
    $.post("/notice/notice_save",data,function (data) {
        if(data.code == 1){
            alert("发布成功");
            window.location.reload();
        }
    })
};

$('#notice_save').click(function(){doCreateNotice()});

