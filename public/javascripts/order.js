
var doCreateOrder = function () {
    var data = {};
    data.indexNumber = getElementValue('indexNumber');
    data.informationName = getElementValue('informationName');
    data.departmentId = 1;
    data.informationType = getElementValue('informationType');
    data.businessCreateTime = getElementValue('businessCreateTime') + ' 00:00:00';
    data.takeEffectTime = getElementValue('takeEffectTime') + ' 00:00:00';
    data.abolishTime = getElementValue('abolishTime') + ' 00:00:00';
    data.content = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    var workOrderApplyId = $("#workOrderApplyId");
    if(workOrderApplyId.length && workOrderApplyId.val() !== ""){
        data.workOrderApplyId = workOrderApplyId.val();
    }
    // 开始提交
    $.ajax({
        url:"/order/save_order",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/order/order_mine';
            }},
        error:function (err) {
            window.location.reload();
        }
    });
};

layerDate('businessCreateTime');
layerDate('takeEffectTime');
layerDate('abolishTime');
$('#save_order').click(function(){doCreateOrder()});

