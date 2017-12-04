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
        var selectValue = window.showModalDialog(URL, self, "edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:" + dialogWidth + "px;dialogHeight:" + dialogHeight + "px;dialogTop:" + loc_y + "px;dialogLeft:" + loc_x + "px");
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
        if (!s) s = 2000;
        alertModal.find(".modal-body").html(messages);
        alertModal.modal('toggle');
        setTimeout(function () {
            alertModal.modal("hide")
        }, s);
    }

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
            "id": "61",
            "flow_id": "4",
            "process_name": "\u53d1\u8d77\u7533\u8bf7",
            "process_to": "63,64",
            "icon": "icon-ok",
            "style": "width:121px;height:41px;line-height:41px;color:#0e76a8;left:193px;top:132px;"
        }, {
            "id": "62",
            "flow_id": "4",
            "process_name": "\u5ba1\u62792",
            "process_to": "65",
            "icon": "icon-star",
            "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:486px;top:337px;"
        }, {
            "id": "63",
            "flow_id": "4",
            "process_name": "\u5feb\u6377\u5ba1\u6279",
            "process_to": "65",
            "icon": "icon-star",
            "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:193px;top:472px;"
        }, {
            "id": "64",
            "flow_id": "4",
            "process_name": "\u5ba1\u62791",
            "process_to": "62,65",
            "icon": "icon-star",
            "style": "width:120px;height:30px;line-height:30px;color:#ff66b5;left:486px;top:137px;"
        }, {
            "id": "65",
            "flow_id": "4",
            "process_name": "\u5f52\u6863\u6574\u7406\u4eba",
            "process_to": "",
            "icon": "icon-star",
            "style": "width:120px;height:30px;line-height:30px;color:#0e76a8;left:738px;top:472px;"
        }]
    };

    /*创建流程设计器*/
    var _canvas = $("#flowdesign_canvas").Flowdesign({
        "processData": processData
        /*,mtAfterDrop:function(params)
         {
         //alert("连接："+params.sourceId +" -> "+ params.targetId);
         }*/
        /*画面右键*/
        , canvasMenus: {
            "cmAdd": function (t) {
                var mLeft = $("#jqContextMenu").css("left"), mTop = $("#jqContextMenu").css("top");

                /*重要提示 start*/
                alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
                /*重要提示 end */

                var url = "http://flowdesign.leipi.org/Flowdesign/add_process.html";
                $.post(url, {"flow_id": the_flow_id, "left": mLeft, "top": mTop}, function (data) {

                    if (!data.status) {
                        mAlert(data.msg);
                    } else if (!_canvas.addProcess(data.info))//添加
                    {
                        mAlert("添加失败");
                    }

                }, 'json');

            },
            "cmSave": function (t) {
                var processInfo = _canvas.getProcessInfo();//连接信息

                /*重要提示 start*/
                alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
                /*重要提示 end */

                var url = "/index.php?s=/Flowdesign/save_canvas.html";
                $.post(url, {"flow_id": the_flow_id, "process_info": processInfo}, function (data) {
                    mAlert(data.msg);
                }, 'json');
            },
            //刷新
            "cmRefresh": function (t) {
                location.reload();//_canvas.refresh();
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
                mAlert('<ul><li><a href="http://flowdesign.leipi.org/doc.html" target="_blank">流程设计器 开发文档</a></li><li><a href="http://formdesign.leipi.org/doc.html" target="_blank">表单设计器 开发文档</a></li><li><a href="http://formdesign.leipi.org/demo.html" target="_blank">表单设计器 示例DEMO</a></li></ul>', 20000);
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
                //var activeId = _canvas.getActiveId();//右键当前的ID
                _canvas.copy();//右键当前的ID
                alert("复制成功");
            },
            "pmDelete": function (t) {
                if (confirm("你确定删除步骤吗？")) {
                    var activeId = _canvas.getActiveId();//右键当前的ID

                    /*重要提示 start*/
                    alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
                    /*重要提示 end */

                    var url = "/index.php?s=/Flowdesign/delete_process.html";
                    $.post(url, {"flow_id": the_flow_id, "process_id": activeId}, function (data) {
                        if (data.status == 1) {
                            //清除步骤
                            //_canvas.delProcess(activeId);
                            //清除连接   暂时先保存设计 + 刷新 完成
                            var processInfo = _canvas.getProcessInfo();//连接信息
                            var url = "/index.php?s=/Flowdesign/save_canvas.html";
                            $.post(url, {"flow_id": the_flow_id, "process_info": processInfo}, function (data) {
                                location.reload();
                            }, 'json');

                        }
                        mAlert(data.msg);
                    }, 'json');
                }
            },
            "pmAttribute": function (t) {
                var activeId = _canvas.getActiveId();//右键当前的ID
                /*重要提示 start*/
                alert("这里要使用程序处理，并非简单html页面，如果无法显示，请建立虚拟站点");
                /*重要提示 end */
                //var url = "/index.php?s=/Flowdesign/attribute/id/"+activeId+".html";
                var url = '/Public/js/flowdesign/attribute.html?id=' + activeId;
                ajaxModal(url, function () {
                    //alert('加载完成执行')
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
            mAlert("查看步骤信息 " + activeId);
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