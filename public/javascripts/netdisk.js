$(".diskFileName").on('click',function (e) {
    var pkey = $(this).attr("data-key");
    var isDir = $(this).attr("data-isDir");
    if(parseInt(isDir) === 1){
        window.location.href = '/netdisk/company_disk?pkey='+pkey
    }else{
        layerAlert("点击查看文件详情",'ok');
    }
});

function uploadFileToDisk() {
    var pkey = $("#pkey").val();
    if(pkey === undefined){
        layerAlert("获取上传父目录失败",'error');
        return false;
    }
    //先点击文件选择
    $("#uploadFile").click();
}

$('#uploadFile').on('change',function () {
    //开启上传模式
    var uploadForm = $("#uploadForm");
    uploadForm.submit();

});