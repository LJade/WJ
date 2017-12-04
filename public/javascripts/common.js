window.onload = function () {
    var wrapper = document.getElementById('inner-wrapper');
    if(wrapper){
        wrapper.style.minHeight = document.body.clientHeight - wrapper.offsetHeight +'px';
    }
};

var checkValue = function (data) {
    var keys = Object.keys(data);
    var nullKey = '';
    keys.forEach(function (v) {
        if(data[v] == ""){
            nullKey = v;
            return v + '不能为空';
        }
    });
    return '';
};

layui.use('laydate', function(){
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#date',
        theme: '#36a4e3'
    });
});
