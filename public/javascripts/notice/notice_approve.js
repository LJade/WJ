var noticeApprove = function () {
    var dateInit = function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            laydate.render({
                elem: '#date',
                theme: '#36a4e3'
            });
});
    }

    return {
        init: function () {
            dateInit()
        }
    }
}();
noticeApprove.init();

