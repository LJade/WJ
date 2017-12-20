window.onload = function () {
    var wrapper = document.getElementById('inner-wrapper');
    if(wrapper){
        wrapper.style.minHeight = document.body.clientHeight - wrapper.offsetHeight +'px';
    }

    if($('#date').length){
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#date',
                theme: '#36a4e3'
            });
        });
    }

    if($('#addUser').length) {
        var workflowCreate = function () {
            var addUser = function () {
                $('#addUser').on('click',function () {
                    layerShow('modal');
                })
            };

            var addConfirm = function () {
                $('.addConfirm').on('click', function () {
                    layerCloseAll();
                })
            };

            return {
                init: function () {
                    addUser();
                    addConfirm();
                }
            }
        }();
        workflowCreate.init();
    }
};

function layerDate(id) {
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#'+id,
            theme: '#36a4e3'
        });
    });
}

var checkValue = function (data) {
    var keys = Object.keys(data);
    var nullKey = '';
    keys.forEach(function (v,index) {
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

function deleteSomething(modules,typeThing) {
    if(!modules || !typeThing){
        layerAlert("请指定删除的模块");
        return;
    }
    //检查页面是否有选中的check
    var deleleIDs = [];
    var trs = $('.table').find("tbody").find('tr');
    trs.map(function (item,data) {
        var tempCheck = $(data).find("input[type='checkbox']").is(':checked');
        if(tempCheck){
            deleleIDs.push($(data).find("input[type='checkbox']").attr("data-id"));
        }
    });
    //获取到了所有的选中ID
    if(deleleIDs.length === 0){
        layerAlert("没有找到选中的内容,请先选中要删除的内容",'error');
        return;
    }
    //所有的条件已满足,请求删除接口
    var delOption = {
        url:"",
        data:{},
        dataType:'json',
        traditional: true,
        method:'post',
        success:function (results) {
            if(results.code === 1){
                layerAlert(results.msg,'ok');
            }else{
                layerAlert(results.msg,'error');
            }
            window.location.reload();
        },
        error:function (err,error) {
            layerAlert(String(err),'error');
        }
    };
    switch (modules + "_" + typeThing){
        case 'news_news':
            delOption.url = '/news/news_delete';
            delOption.data.journalismIdList = deleleIDs;
            break;
        case 'news_category':
            delOption.url = '/news/category_delete';
            delOption.data.journalismTypeIdList = deleleIDs;
            break;
        case 'notice_notice':
            delOption.url = '/notice/notice_delete';
            delOption.data.announcementIdList = deleleIDs;
            break;
        case 'document_document':
            delOption.url = '/docu/docu_delete';
            delOption.data.CommonalityArticleIdList = deleleIDs;
            break;
        case 'mail_send':
            delOption.url = '/mail/send_delete';
            delOption.data.sendMailIdList = deleleIDs;
            break;
        case 'mail_receive':
            delOption.url = '/mail/receive_delete';
            delOption.data.receivedMailIdList = deleleIDs;
            break;
        case 'order_order':
            delOption.url = '/order/order_delete';
            delOption.data.workOrderApplyIdList = deleleIDs;
            break;
        case 'conference_conference':
            delOption.url = '/conference/con_delete';
            delOption.data.meetingIdList = deleleIDs;
            break;
        case 'conference_meetingRoom':
            delOption.url = '/conference/con_room_delete';
            delOption.data.idList = deleleIDs;
            break;
        case 'workflow_workflow':
            delOption.url = '/workflow/flow_delete';
            delOption.data.id = deleleIDs;
            break;
        default:
            layerAlert("没有要找到待删除的模块",'error');
            break;
    }
    //执行删除请求
    layerComfirm("是否删除选中的内容？", function(){$.ajax(delOption)});
}

function login_out() {
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.confirm('您是否要退出登录？', {
            btn: ['确定', '取消'] //可以无限个按钮
        }, function (index, layero) {
            $.cookie("user", "");
            $.cookie("webim_*", "");
            $.cookie("loginQRID", "");
            $.cookie("IMAccount", "");
            $.cookie("IMPwd", "");
            window.location.href = "/login/login_out";
        }, function (index) {
            console.log("取消登录");
        });
    })
}

function layerAlert(message,messageType,fn,params) {
    if(!messageType){
        messageType = 'ok';
    }
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        var option = {
            icon: 1,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        };
        switch (messageType){
            case 'error':
                option.icon = 2;
                layer.msg(message, option , function(){
                    //do something
                });
                break;
            case 'ok':
                option.icon = 1;
                layer.msg(message, option , function(){

                });
                break;
            case 'confirm':
                layer.confirm(message, {
                    btn: ['确定', '取消']
                }, function (index, layero) {
                    if(params){
                        fn(params);
                    }else{
                        fn();
                    }

                    layerCloseAll();
                }, function (index) {
                    layerCloseAll();
                });
                break;
        }
    })
}

function layerComfirm(message,fn) {
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.confirm(message, {
            btn: ['确定', '取消'], //可以无限个按钮
            time: 99999
        }, function (index, layero) {
            fn();
        }, function (index) {
            layerCloseAll();
        });
    })
}

function layerShow(id) {
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.open({
            type: 1,
            content: $('#'+id)
        });
    })
}

function layerCloseAll() {
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.closeAll();
    })
}

function getElementValue(id){
    if($("#"+id).length){
        return $("#"+id).val();
    }else{
        return "";
    }
}

function getLayerUI() {
    var layerInstence = null;
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layerInstence = layer;
    });
    return layerInstence;
}

function escapeJSON(str) {
    return str.replaceAll('&quot;','"');
}
