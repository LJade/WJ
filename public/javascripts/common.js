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

function login_out() {
    alert(123123123);
    if(confirm("您是否要退出登录")){
        $.cookie("user","");
        $.cookie("webim_*","");
        $.cookie("loginQRID","");
        $.cookie("IMAccount","");
        $.cookie("IMPwd","");
        window.location.href = "/login/login_out";
    }
}
