function addFiles() {
    var inputFiles = $(document).find('input[type="file"]');
    var countFile = inputFiles.length;
    //然后构建filenode
    var divStr = '<div class="form-control fileUpload"><label class="control-label" for="file">上传附件:</label><input class="form-control" type="file" name="fileList[' + countFile + ']"><span style="margin-left: 10px;" onclick="deleteAddFile('+countFile+')">删除</span></div>'
    //然后将div插入到文档中去
    $(".fileDIv").append(divStr);
}

function deleteAddFile(index) {
    $(".fileDIv").find(".fileUpload").eq(index).remove();
}


function sendMail() {
    var chooseParsonIds = $('#choosePersonId').val();
    $("#approver").val(chooseParsonIds);
    var form = new FormData(document.getElementById("mailSave"));
    $.ajax({
        url:"/mail/send_mail",
        type:"post",
        data:form,
        processData:false,
        contentType:false,
        success:function(data){
            var resObj = JSON.parse(data);
            if(resObj.code === 1){
                layerAlert("发送成功","ok");
                setTimeout(function () {
                    window.location.href = "/mail/mail_send";
                },1000)
            }else{
                layerAlert("发送失败："+resObj.msg,"error");
            }
        },
        error:function(e){
            layerAlert("网络错误，请稍后再试","error");
        }
    });
}

