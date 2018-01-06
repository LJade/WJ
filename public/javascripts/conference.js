var doCreateCon = function () {
    var data = {};
    data.title = getElementValue('title');
    data.startTimeString = getElementValue('startTimeString') + ' 00:00:00';
    data.endTimeString = getElementValue('endTimeString') + ' 00:00:00';
    data.meetingCreateUserId = getElementValue('selectCreateIds');
    data.withConferencePeopleId = getElementValue('selectJoinIds');
    data.meetingRoomId = getElementValue('meetingRoomId');
    data.summaryPeopleId = getElementValue('selectSummaryIds');
    data.meetingContent = getElementValue('detail');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    // 开始提交
    $.ajax({
        url:"/conference/con_save",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/conference/con_apply';
            }},
        error:function (err) {
            window.location.reload();
        }
    });
};

var doCreateConRoom = function () {
    var data = {};
    data.name = getElementValue('name');
    data.accommodatePeopleNumber = parseInt(getElementValue('accommodatePeopleNumber'));
    data.meetingRoomResource = getElementValue('meetingRoomResource');
    var checkInfo = checkValue(data);
    if(checkInfo){
        layerAlert(checkInfo,'error');
        return;
    }
    //判断是否是修改
    var roomID = $("#roomId");
    if(roomID.length && roomID.val() !== ''){
        data.id = roomID.val();
    }
    // 开始提交
    $.ajax({
        url:"/conference/con_room_save",
        data:data,
        method:"POST",
        traditional: true,
        dataType:'json',
        success:function (data) {
            if(data.code == 1){
                layerAlert("发布成功");
                window.location.href = '/conference/con_room';
            }},
        error:function (err) {
            window.location.reload();
        }
    });
};

layerDate('startTimeString');
layerDate('endTimeString');
$('#save_con').click(function(){doCreateCon()});
$('#save_room').click(function(){doCreateConRoom()});

