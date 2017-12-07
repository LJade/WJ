var the_flow_id = '4';

/*页面回调执行    callbackSuperDialog
 if(window.ActiveXObject){ //IE
 window.returnValue = globalValue
 }else{ //非IE
 if(window.opener) {
 window.opener.callbackSuperDialog(globalValue) ;
 }
 }
 window.close();
 */
function callbackSuperDialog(selectValue) {
    var aResult = selectValue.split('@leipi@');
    $('#' + window._viewField).val(aResult[0]);
    $('#' + window._hidField).val(aResult[1]);
    //document.getElementById(window._hidField).value = aResult[1];

}
/**
 * 弹出窗选择用户部门角色
 * showModalDialog 方式选择用户
 * URL 选择器地址
 * viewField 用来显示数据的ID
 * hidField 隐藏域数据ID
 * isOnly 是否只能选一条数据
 * dialogWidth * dialogHeight 弹出的窗口大小
 */
function superDialog(URL, viewField, hidField, isOnly, dialogWidth, dialogHeight) {
    dialogWidth || (dialogWidth = 620)
        , dialogHeight || (dialogHeight = 520)
        , loc_x = 500
        , loc_y = 40
        , window._viewField = viewField
        , window._hidField = hidField;
    // loc_x = document.body.scrollLeft+event.clientX-event.offsetX;
    //loc_y = document.body.scrollTop+event.clientY-event.offsetY;
    if (window.ActiveXObject) { //IE
        var selectValue = window.showModalDialog(URL, self, "edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:" + dialogWidth + "px;dialogHeight:" + dialogHeight + "påx;dialogTop:" + loc_y + "px;dialogLeft:" + loc_x + "px");
        if (selectValue) {
            callbackSuperDialog(selectValue);
        }
    } else {  //非IE
        var selectValue = window.open(URL, 'newwindow', 'height=' + dialogHeight + ',width=' + dialogWidth + ',top=' + loc_y + ',left=' + loc_x + ',toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');

    }
}


$(function () {
    var alertModal = $('#alertModal'), attributeModal = $("#attributeModal");
    //消息提示
    mAlert = function (messages, s) {
        if (!messages) messages = "";
        if (!s) s = 20000;
        alertModal.find(".modal-body").html(messages);
        alertModal.modal('toggle');
        setTimeout(function () {
            alertModal.modal("hide")
        }, s);
    };

    //属性设置
    attributeModal.on("hidden", function () {
        $(this).removeData("modal");//移除数据，防止缓存
    });
    ajaxModal = function (url, fn) {
        url += url.indexOf('?') ? '&' : '?';
        url += '_t=' + new Date().getTime();
        attributeModal.find(".modal-body").html('<img src="/images/loading.gif"/>');
        attributeModal.modal({
            remote: url
        });

        //加载完成执行
        if (fn) {
            attributeModal.on('shown', fn);
        }


    }
    //刷新页面
    function page_reload() {
        location.reload();
    }


    /*
     php 命名习惯 单词用下划线_隔开
     js 命名习惯：首字母小写 + 其它首字线大写
     */
    /*步骤数据*/
    var processData = {
        "total": 5,
        "list": [{
            "id": new Date().getTime(),
            "flow_id": "1",
            "process_name": "开始流程",
            "process_to": "",
            "icon": "",
            "style": "width:130px;height:50px;line-height:50px;font-size:16px;color:#0e76a8;left:193px;top:132px;"
        }]
    };

    /*创建流程设计器*/
    var _canvas = $("#flowdesign_canvas").Flowdesign({
        "processData": processData
        /*画面右键*/
        , canvasMenus: {
            "cmAdd": function (t) {
                var mLeft = $("#jqContextMenu").css("left"), mTop = $("#jqContextMenu").css("top");
                mLeft = (parseInt(mLeft.split("px")[0]) - 195) + 'px';
                mTop = (parseInt(mTop.split("px")[0]) - 80) + 'px';
                /*重要提示 end */
                var data = {};
                data.info = {
                    "id": new Date().getTime(),
                    "flow_id": "4",
                    "process_name": "新建节点",
                    "process_to": "",
                    "icon": "icon-ok",
                    "style": "width:150px;height:50px;line-height:50px;color:#0e76a8;left:"+mLeft+";top:"+mTop+";"
                };
                if (!_canvas.addProcess(data.info)){
                    mAlert("添加失败");
                }

            },
            "cmSave": function (t) {
                var processInfo = _canvas.getProcessInfo();//连接信息
                var url = "/workflow/workflow_save";
                console.log(processInfo);
                $.post(url, {"flow_id": the_flow_id, "process_info": processInfo}, function (data) {
                    mAlert(data.msg);
                }, 'json');
            },
            //刷新
            "cmRefresh": function (t) {
                location.reload();
            },
            "cmPaste": function (t) {
                var pasteId = _canvas.paste();//右键当前的ID
                if (pasteId <= 0) {
                    alert("你未复制任何步骤");
                    return;
                }
                alert("粘贴:" + pasteId);
            },
            "cmHelp": function (t) {
                mAlert("请刷新页面");
            }

        }
        /*步骤右键*/
        , processMenus: {

            "pmBegin": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID
                alert("设为第一步:" + activeId);
            },
            "pmAddson": function (t)//添加子步骤
            {
                var activeId = _canvas.getActiveId();//右键当前的ID
            },
            "pmCopy": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID
                _canvas.copy(activeId);//右键当前的ID
                alert("复制成功");
            },
            "pmDelete": function (t) {
                if (confirm("你确定删除步骤吗？")) {
                    var activeId = _canvas.getActiveId();//右键当前的ID
                    _canvas.delProcess(activeId);
                }
            },
            "pmAttribute": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID
                var url = '/workflow/workflow_create?';
                ajaxModal(url, function () {
                    // alert('加载完成执行')
                });
            },
            "pmForm": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID

                /*重要提示 start*/
                alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
                /*重要提示 end */

                var url = "/index.php?s=/Flowdesign/attribute/op/form/id/" + activeId + ".html";
                ajaxModal(url, function () {
                    //alert('加载完成执行')
                });
            },
            "pmJudge": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID

                /*重要提示 start*/
                alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
                /*重要提示 end */

                var url = "/index.php?s=/Flowdesign/attribute/op/judge/id/" + activeId + ".html";
                ajaxModal(url, function () {
                    //alert('加载完成执行')
                });
            },
            "pmSetting": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID

                /*重要提示 start*/
                alert("这里要使用程序处理，并非简单html页面，如果无法显示，请建立虚拟站点");
                /*重要提示 end */

                //var url = "/index.php?s=/Flowdesign/attribute/op/style/id/"+activeId+".html";
                var url = 'Public/js/flowdesign/attribute.html?id=' + activeId;
                ajaxModal(url, function () {
                    //alert('加载完成执行')
                });
            }
        }
        , fnRepeat: function () {
            //alert("步骤连接重复1");//可使用 jquery ui 或其它方式提示
            mAlert("步骤连接重复了，请重新连接");

        }
        , fnClick: function () {
            var activeId = _canvas.getActiveId();
            // mAlert("查看步骤信息 " + activeId);
        }
        , fnDbClick: function () {
            //和 pmAttribute 一样
            var activeId = _canvas.getActiveId();//右键当前的ID

            /*重要提示 start*/
            alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
            /*重要提示 end */

            var url = "/index.php?s=/Flowdesign/attribute/id/" + activeId + ".html";
            ajaxModal(url, function () {
                //alert('加载完成执行')
            });
        }
    });


    /*保存*/
    $("#leipi_save").bind('click', function () {
        var processInfo = _canvas.getProcessInfo();//连接信息

        /*重要提示 start*/
        alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
        /*重要提示 end */


        var url = "/index.php?s=/Flowdesign/save_canvas.html";
        $.post(url, {"flow_id": the_flow_id, "process_info": processInfo}, function (data) {
            mAlert(data.msg);
        }, 'json');
    });
    /*清除*/
    $("#leipi_clear").bind('click', function () {
        if (_canvas.clear()) {
            //alert("清空连接成功");
            mAlert("清空连接成功，你可以重新连接");
        } else {
            //alert("清空连接失败");
            mAlert("清空连接失败");
        }
    });


});