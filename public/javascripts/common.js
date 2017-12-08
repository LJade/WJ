window.onload = function () {
    var wrapper = document.getElementById('inner-wrapper');
    if(wrapper){
        wrapper.style.minHeight = document.body.clientHeight - wrapper.offsetHeight +'px';
    }
};

var checkValue = function (data) {
    var keys = Object.keys(data);
    var nullKey = '';
    keys.forEach(function (v,index) {
        console.log(v);
        if(data[v] === "" || data[v] === undefined){
            nullKey = v;
        }
    });
    if(nullKey){
        return nullKey + "不能为空";
    }else{
        return '';
    }
};

layui.use('laydate', function(){
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#date',
        theme: '#36a4e3'
    });
});
