//清空localstorage
$(".diskFileName").on('click',function (e) {
    var key = $(this).attr("data-key");
    var isDir = $(this).attr("data-isDir");
    var type = $("#type").val();
    var pkey = $(this).attr("data-pkey");
    var dirname = $(this).attr("data-dirName");
    var curPath = $("#curPath").text();
    //根据type加载不同的网盘
    var netdiskUrl = '/netdisk/company_disk?pkey=';
    if(type === '2'){
        netdiskUrl = '/netdisk/company_disk_parson?pkey='
    }

    var pathInfo = window.sessionStorage.getItem("pathInfo");
    if(!pathInfo){
        pathInfo = {}
    }else{
        pathInfo = JSON.parse(pathInfo);
    }
    pathInfo[key] = {};
    pathInfo[key].pkey = pkey;
    pathInfo[key].name = dirname;
    pathInfo[key].curPath = curPath + "/" + dirname;

    window.sessionStorage.setItem("pathInfo",JSON.stringify(pathInfo));

    if(parseInt(isDir) === 1){
        window.location.href = netdiskUrl+key;
    }else{
        layerAlert("点击查看文件详情",'ok');
    }
});

function initCurPath(){
    var key = $("#pkey").val();
    var pathInfo = window.sessionStorage.getItem("pathInfo");
    if(!pathInfo){
        pathInfo = {};
        pathInfo[key] = {
            pkey:"0",
            name:"",
            curPath:""
        };
        window.sessionStorage.setItem("pathInfo",JSON.stringify(pathInfo));
    }else{
        pathInfo = JSON.parse(pathInfo);
    }
    //从pathInfo中直接提取基本信息
    if(pathInfo[key]){
        if(key !== "0"){
            $("#curPath").text((pathInfo[pathInfo[key].pkey].curPath + "/" + pathInfo[key].name).replace("//","/"));
        }else{
            $("#curPath").text("/")
        }
    }
}
initCurPath();

function backToTopLevel() {
    var key = $('#pkey').val();
    var pathInfo = window.sessionStorage.getItem("pathInfo");
    var pkey = 0;
    var type = $("#type").val();
    var netdiskUrl = '/netdisk/company_disk?pkey=';
    if(type === '2'){
        netdiskUrl = '/netdisk/company_disk_parson?pkey='
    }
    if(!pathInfo){
        window.location.href = netdiskUrl + pkey;
        return
    }else{
        pathInfo = JSON.parse(pathInfo);
        window.location.href = netdiskUrl + pathInfo[key].pkey;
    }
}

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
            var a = document.createElement("a");
            a.download ="test.mp3";
            a.href = results.dat.url;
            a.click();
        }else{
            layerAlert("下载文件失败："+results.msg,"error");
        }
    },'json')
}

