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

function refershTree(roleId) {
    $.get("/setting/role_permission",{roleId:roleId},function (data) {
        if(data.code === 1){
            var zNode = data.dat.moduleIds;
            $('#deptIds').val(zNode);
            zTreeLoad();
        }
    },'json')
}


$('.user-list li').on('click', function (e) {
    if ($(this).hasClass('active')) {
        return;
    } else {
        $('.user-list li').removeClass("active");
        $('#chooseRole').val($(this).attr("data-role-id"));
        $('#chooseRole').attr("data-type",$(this).attr("data-type"));
        $('#chooseRole').attr("data-users",$(this).attr("data-users"));
        $('#chooseRole').attr("data-name",$(this).attr("data-name"));
        $(this).addClass('active');
        //刷新右侧权限
        refershTree($(this).attr("data-role-id"));
    }
    e.stopPropagation();//阻止冒泡
});

$('#editRole').on('click',function (e) {
    var chooseRole = $('#chooseRole');
    var chooseRoleId = chooseRole.val();
    var chooseRoleType = chooseRole.attr("data-type");
    if(chooseRoleId){
        if(chooseRoleType && parseInt(chooseRoleType) !== 1 && parseInt(chooseRoleType) !== 2){
            window.location.href = '/setting/role_edit?edit=true&roleId='+chooseRoleId;
        }else{
            layerAlert("该角色不能被编辑","error");
        }
    }else{
        layerAlert("请在下方先选中一个角色","error")
    }
});