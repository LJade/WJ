window.onload = function () {
    var wrapper = document.getElementById('inner-wrapper');
    wrapper.style.minHeight = document.body.clientHeight - wrapper.offsetHeight +'px';
}

layui.use('laydate', function(){
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#date',
        theme: '#36a4e3'
    });
});
