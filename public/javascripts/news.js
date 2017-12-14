
var doCreateNews = function () {
    var data = {};
    data.title = getElementValue('title');
    data.publicTime = getElementValue('date') + " 00:00:00";
    data.journalismTypeId = getElementValue('journalismTypeId');
    data.lookUpPersonId = getElementValue('choosePersonId').split(",");
    data.content = getElementValue('content');
    var checkInfo = checkValue(data);
    if(checkInfo !== ''){
        layerAlert(checkInfo,'error');
        return;
    }
    // 开始提交
    var journalismId = $('#journalismId');
    console.log(journalismId.val() !== '');
    if(journalismId.val() !== ''){
        data.journalismId = journalismId.val();
    }
    $.ajax({
        url:"/news/news_save",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/news/news_list';
            }},
        error:function (err) {
            console.log(err);
        }
    });
};

var doCreateNewsCategory = function () {
    var data = {};
    data.typeName = getElementValue('title');
    var checkInfo = checkValue(data);
    if(checkInfo !== ''){
        layerAlert(checkInfo,'error');
        return;
    }
    // 开始提交
    var journalismTypeId = $('#journalismTypeId');
    if(journalismTypeId.length){
        data.journalismTypeId = journalismTypeId.val();
        $.ajax({
            url:"/news/category_edit",
            data:data,
            method:"POST",
            traditional: true,
            dataType:'json',
            success:function (data) {
                if(data.code == 1){
                    layerAlert("修改分类成功");
                    window.location.href = '/news/news_category';
                }},
            error:function (err) {
                console.log(err);
            }
        });
    }else{
        $.ajax({
            url:"/news/category_save",
            data:data,
            method:"POST",
            traditional: true,
            dataType:'json',
            success:function (data) {
                if(data.code == 1){
                    layerAlert("添加分类成功");
                    window.location.href = '/news/news_category';
                }},
            error:function (err) {
                console.log(err);
            }
        });
    }

};

$('#save_news').click(function(){doCreateNews()});
$('#save_news_category').click(function(){doCreateNewsCategory();});

