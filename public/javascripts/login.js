//登陆页轮询app扫描
var qrLogin = function(){
    var getResults = false;
    var resCode = '';
    var interval = setInterval(function () {
        if(!getResults){
            var qrCode = $.cookie("loginQRID");
            $.get("/login/qrResult",{qrid:qrCode},function (data) {
                console.log(data);
                if(data.dat.status == 1 && data.dat.code != ""){
                    getResults = true;
                    resCode = data.dat.code;
                    //请求到rescode,就开始执行二维码登陆逻辑
                    $.post("/login/qrLogin",{qrid:qrCode,code:resCode},function (data) {
                        if(data.code == 1){
                            window.location.href = '/';
                        }else{
                            alert("二维码登录失败,请刷新页面");
                            // window.location.reload();
                        }
                    })
                }
            })
        }else{
            window.clearTimeout(interval);
        }
    },2000);
};

qrLogin();

