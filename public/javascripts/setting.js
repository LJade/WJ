function createNewDep() {
    var curNode = $('#tree').attr("data-cur-id");
    if(curNode !== undefined){
        window.location.href = '/setting/organization_create?pId='+curNode;
    }else{
        layerAlert('请先选择一个部门进行操作','error');
    }
}

function editNewDep() {
    var curNode = $('#tree').attr("data-cur-id");
    var curPId = $('#tree').attr("data-cur-pid");
    if(curNode !== undefined){
        window.location.href = '/setting/organization_create?pId='+curNode + '&curId='+curPId;
    }else{
        layerAlert('请先选择一个部门进行操作','error');
    }
}

function doDeleteDep() {
    var curNode = $('#tree').attr("data-cur-id");
    $.post('/setting/organization_delete',{id:curNode},function (data) {
        if(data.code === 1){
            layerAlert('删除成功');
        }else{
            layerAlert(data.msg,'error');
        }
        window.location.reload();
    },'json');
}

function deleteDep() {
    var curNode = $('#tree').attr("data-cur-id");
    if(curNode !== undefined){
        layerComfirm("是否删除选中的部门",doDeleteDep);
    }else{
        layerAlert('请先选择一个部门进行操作','error');
    }
}