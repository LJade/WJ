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

    if($('#pageInfo').length){
        layui.use('laypage', function(){
            var layerPage = layui.laypage;
            var url = window.location.href;
            //执行一个laydate实例
            layerPage.render({
                elem: 'pageInfo',
                theme: '#36a4e3',
                limit:10,
                curr:location.hash.replace('#!fenye=', ''),
                count: $('#pageInfo').attr("data-count"),
                hash:'fenye',
                jump:function (obj,first) {
                    if(!first){
                        window.location.href = skipUrl(url,'page',obj.curr) + "#!fenye="+obj.curr;
                    }
                }
            });
        });
    }

    //人物头像
    if($('#headIcon').length){
        $('#headIcon').attr("src",$.cookie("headIcon") ? $.cookie("headIcon") : '/images/avatar.png');
        $('#headName').text($.cookie("headName"));
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

function skipUrl(url,param, val) {
    url = url.split("#")[0];
    if (url.indexOf('?') != -1) {
        if (url.indexOf(param) != -1) {
            var reg = eval('/(' + param + '=)([^&]*)/gi');
            if(val){
                url = url.replace(reg, param + '=' + val);
            }else{
                url = url.replace(reg, "");
            }

        } else {
            url = url + "&" + param + '=' + val;
        }
    } else {
        url = url + '?' + param + '=' + val;
    }
    return url.replace("?&","?").replace("&&","&")
}


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
        case 'setting_user':
            delOption.url = '/setting/user_delete';
            delOption.data.userIds = deleleIDs;
            break;
        case 'setting_app':
            delOption.url = '/setting/app_delete';
            delOption.data.ids = deleleIDs;
            break;
        case 'setting_log':
            delOption.url = '/setting/log_delete';
            delOption.data.ids = deleleIDs;
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
                    fn();
                });
                break;
            case 'ok':
                option.icon = 1;
                layer.msg(message, option , function(){
                    fn();
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

function searchSomething() {
    var url = window.location.href;
    var inputs = $('.inline-group input');
    var selects = $('.inline-group select');
    var params = [];
    inputs.each(function (index,data) {
        var temp = [];
        var key = $(data).attr('id');
        var value = $(data).val();
        if(value){
            temp.push(key);
            temp.push(value);
            params.push(temp);
        }else{
            //没有的时候,如果url中存在该key需要把key去除
            if(url.indexOf(key) != -1){
                url = skipUrl(url,key,"");
            }
        }
    });
    //selects
    selects.each(function (index,select) {
        var temp = [];
        var key = $(select).attr('id');
        var value = $(select).val();
        if(value){
            temp.push(key);
            temp.push(value);
            params.push(temp);
        }else{
            //没有的时候,如果url中存在该key需要把key去除
            if(url.indexOf(key) != -1){
                url = skipUrl(url,key,"");
            }
        }
    });
    //最终结果,组装url
    params.forEach(function (param) {
        url = skipUrl(url,param[0],param[1]);
    });
    window.location.href = url;
}

function initSearchInfo(){
    var href = window.location.href;
    var param = href.split('#')[0].split("?");
    if(param.length == 2){
        var params = param[1].split("&");
        if(params.length > 1){
            params.forEach(function (data) {
                var id = data.split("=")[0];
                var value = data.split("=")[1];
                var querySelect = $('#'+id);
                console.log(id,value);
                if(querySelect.length){
                    querySelect.val(decodeURI(value));
                }
            });
        }else{
            //表示是有一个参数的
            var info = param[1].split("=");
            var id = info[0];
            var value = info[1];
            var querySelect = $('#'+id);
            if(querySelect.length){
                querySelect.val(decodeURI(value));
            }
        }
    }
}

function getIcon(isMe,name) {
    if(isMe){
        return $(".webim-profile-avatar").find("img").attr("src");
    }else{
        var iconInfo = JSON.parse(window.localStorage.getItem("iconInfo"));
        var src = '';
        if(iconInfo.length){
            iconInfo.forEach(function (data) {
                if(data.imAccount === name.name){
                    src = data.headIcon;
                }
            })
        }
        if(src){
            return src;
        }else{
            return name.src;
        }
    }
}

function zTreeLoad() {
    var setting = {
        check: {
            enable: true
        },
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            key: {
                name: "label"
            },
            simpleData: {
                enable: true,
                name: "label",
                title: "label",
                idKey: "id",
                pIdKey: "parentId",
                rootPId: ""
            }
        },
        callback: {
            beforeDblClick: beforeMouseDoubleClick,
            onClick: beforeMouseDown,
            onCheck: checkEvent
        }
    };

    var zNodes = JSON.parse($('#tree').attr('data-node'));
    var stringChecked = $('#deptIds').val();
    var checkedIds = stringChecked === "" ? [] : stringChecked.split(",");
    zNodes.forEach(function (node) {
        node.open = true;
        var index = $.inArray(String(node.id), checkedIds);
        if (index !== -1) {
            node.checked = true
        }
    });

    function checkEvent(e, treeId, treeNode) {
        var stringChecked = $('#deptIds').val();
        var checkedIds = stringChecked === "" ? [] : stringChecked.split(",");
        var index = $.inArray(String(treeNode.id), checkedIds);
        //如果存在相同id的子节点,我们也把他们都选上
        var zTree = $.fn.zTree.getZTreeObj("tree");
        var sameNodes = zTree.getNodesByParam("id",treeNode.id);
        if (treeNode.checked === false) {
            if (index !== -1) {
                checkedIds.splice(index, 1);
                if(sameNodes.length > 1){
                    sameNodes.forEach(function (data) {
                        data.checked = false;
                        zTree.updateNode(data);
                    })
                }
            }
        } else {
            if (index === -1) {
                checkedIds.push(String(treeNode.id));
                if(sameNodes.length > 1){
                    sameNodes.forEach(function (data) {
                        data.checked = true;
                        zTree.updateNode(data);
                    })
                }
            }
        }
        $("#deptIds").val(String(checkedIds));
    }

    function setCheck() {
        var zTree = $.fn.zTree.getZTreeObj('tree');
        type = {"Y": "", "N": ""};
        zTree.setting.check.chkboxType = type;
    }

    function beforeMouseDown(e, treeId, treeNode) {
        $('#tree').attr('data-cur-id', treeNode.id).attr('data-cur-pid', treeNode.parentId);
    }

    function beforeMouseDoubleClick(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        if (treeNode.isParent) {
            zTree.expandNode(treeNode);
            return false;
        } else {
            return true;
        }
    }

    $(document).ready(function () {
        var t = $("#tree");
        t = $.fn.zTree.init(t, setting, zNodes);
        setCheck();
    });
}

function zTreeMultiLoad(id) {
    var setting = {
        check: {
            enable: true
        },
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            key: {
                name: "label"
            },
            simpleData: {
                enable: true,
                name: "label",
                title: "label",
                idKey: "id",
                pIdKey: "parentId",
                rootPId: ""
            }
        },
        callback: {
            beforeDblClick: beforeMouseDoubleClick,
            onClick: beforeMouseDown,
            onCheck: checkEvent,
            beforeCollapse:beforeCollapse
        }
    };

    var zNodes = JSON.parse($('#'+id).attr('data-node'));
    var stringChecked = $('#'+id + "_choose").val();
    var checkedIds = stringChecked === "" ? [] : stringChecked.split(",");
    zNodes.forEach(function (node) {
        node.open = true;
        node.expand = false;
        node.collapse = false;
        var index = $.inArray(String(node.id), checkedIds);
        if (index !== -1) {
            node.checked = true
        }
    });

    function beforeCollapse(treeId, treeNode) {
        return (treeNode.collapse !== false);
    }

    function checkEvent(e, treeId, treeNode) {
        var stringChecked = $('#'+treeId + "_choose").val();
        var checkedIds = stringChecked === "" ? [] : stringChecked.split(",");
        //根据所选类别判断
        var rootType = treeNode.getPath()[0].id;
        var checkedId = rootType + "_" + String(treeNode.id);
        var index = $.inArray(checkedId, checkedIds);
        if (treeNode.checked === false) {
            if (index !== -1) {
                checkedIds.splice(index, 1);
            }
        } else {
            if (index === -1) {
                checkedIds.push(checkedId);
            }
        }
        $("#"+treeId + "_choose").val(String(checkedIds));
    }

    function setCheck(zTree) {
        type = {"Y": "", "N": ""};
        zTree.setting.check.chkboxType = type;
    }

    function beforeMouseDown(e, treeId, treeNode) {
        $('#'+treeId).attr('data-cur-id', treeNode.id).attr('data-cur-pid', treeNode.parentId);
    }

    function beforeMouseDoubleClick(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        if (treeNode.isParent) {
            zTree.expandNode(treeNode);
            return false;
        } else {
            return true;
        }
    }

    $(document).ready(function () {
        if(!id){
            var t = $("#tree");
            tT = $.fn.zTree.init(t, setting, zNodes);
            setCheck(tT);
        }else{
            var t = $("#"+id);
            tT = $.fn.zTree.init(t, setting, zNodes);
            setCheck(tT);
        }
    });
}

function approveSend(type) {
    var result = {
        "flowInstanceId":$("#flowApproveUserId").val(),
        "result": parseInt(type),
        "option": $("#option").val() ? $("#option").val() : "默认通过"
    };
    $.post("/setting/approveSend",result,function (results) {
        if(results.code === 1){
            layerAlert("审批提交成功","ok");
            setTimeout(function () {
                window.location.reload();
            },1000)
        }else{
            layerAlert(results.msg, "error");
        }
    },'json');
}

