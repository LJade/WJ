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
    var uploadForm = new FormData(document.getElementById("uploadForm"));
    $.ajax({
        url:"/netdisk/uploadFile",
        type:"post",
        data:uploadForm,
        processData:false,
        contentType:false,
        success:function(data){
            var resObj = JSON.parse(data);
            if(resObj.code === 1){
                layerAlert("上传文件成功","ok");
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layerAlert("上传文件失败："+resObj.msg,"error");
            }
        },
        error:function(e){
            layerAlert("网络错误，请稍后再试","error");
        }
    });
    // get();//此处为上传文件的进度条
});

function deleteDiskFile(key) {
    function doDelete() {
        $.post("/netdisk/delete_file",{key:key},function (results) {
            if(results){
                layerAlert("删除成功",'ok');
                setTimeout(function () {
                    window.location.reload();
                },1000);
            }
        },'json')
    }
    layerComfirm("确定删除该文件吗？",doDelete)
}

function createNewFolder(pkey) {
    layui.use('layer', function() {
        var $ = layui.jquery, layerIn = layui.layer;
        var layerOpen = layerIn.open({
            type:1,
            content:$('#newFolderDiv')
            ,btn: ['确认', '取消']
            ,yes: function(index, layero){
                doCreate();
            },btn2: function(index, layero){
                layerIn.close(layerOpen);
            }
            ,cancel: function(){
                layerIn.close(layerOpen);
            }
        });
    });


    function doCreate() {
        var name = $('#newFolder').val();
        var type = $('#newFolderType').val();
        if(!name){
            layerAlert("名字不能为空","error");
            return false;
        }
        if(!type) {
            layerAlert("获取添加类型失败","error");
            return false;
        }
        $.post("/netdisk/new_folder",{pkey:pkey,type:type,name:name},function (results) {
            if(results.code === 1){
                layerAlert("添加成功","ok");
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layerAlert("添加失败，原因是："+results.msg ,"error");
                return false;
            }
        },'json')
    }
}


function downloadFile(pkey) {
    $.get("/netdisk/download_file",{key:pkey},function (results) {
        if(results.code === 1){

            // var voiceUrl = results.dat.url;
            // var iframe  = document.createElement("iframe");
            // document.body.appendChild(iframe);
            // iframe.src = voiceUrl;
            // iframe.style.display = "none";
            var a = document.createElement("a");
            a.download ="test.mp3";
            a.href = results.dat.url;
            a.click();
            // 直接下载，用户体验好
            // var a = $("#downloadA");
            // a.attr("href",results.dat.url);
            // a.attr("download",results.dat.name);
            // a.click();
        }else{
            layerAlert("下载文件失败："+results.msg,"error");
        }
    },'json')
}