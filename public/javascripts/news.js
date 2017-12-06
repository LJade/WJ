
var getElementValue = function(id){
    return $("#"+id).val();
};

var doCreateNews = function () {
    var data = {};
    data.title = getElementValue('title');
    data.publicTime = getElementValue('time') + " 00:00:00";
    data.journalismTypeId = getElementValue('journalismTypeId');
    data.lookUpPersonId = [1,2,3];
    data.content = getElementValue('content');
    var checkInfo = checkValue(data);
    if(checkInfo){
        alert(checkInfo);
        return;
    }
    // 开始提交
    $.ajax({
        url:"/news/news_save",
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
    // $.post("/news/news_save",data,function (data) {
    //     if(data.code == 1){
    //         alert("发布成功");
    //         window.location.reload();
    //     }
    // })
};

$('#save_news').click(function(){doCreateNews()});
