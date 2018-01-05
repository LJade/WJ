var nodeInfo = [ { id: '95',
    process_name: '新建步骤',
    flow_id: 1,
    process_to: '123',
    icon: 'icon-ok',
    style: '50,200' },
    { id: '123',
        process_name: '普通节点',
        flow_id: 1,
        process_to: '124',
        icon: 'icon-ok',
        style: '160,200' },
    { id: '124',
        process_name: '普通节点',
        flow_id: 1,
        process_to: '',
        icon: 'icon-ok',
        style: '270,200' } ];

var paper = Raphael("raphael", 800, 500);
var defaultNodeWidth = 70;
var defaultNodeHeight = 36;
var defaultFarNode = 40;
var defaultLineNodeFar = 4;
var defaultNodeRedius = 5;
var defaultNodeTextPaddingLeft = 8;
var defaultNodeTextPaddingTop = 15;
var defaultNodeTextSize = 13;
var defaultNodeTextColor = "#000";

var allNode = [];
var collections = [];

function getStartEnd(obj1, obj2) {
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox();
    var p = [
        { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
        { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
        { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
        { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
        { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
        { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
        { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
        { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
    ];
    var d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if (
                (i == j - 4) ||
                (((i != 3 && j != 6) || p[i].x < p[j].x) &&
                ((i != 2 && j != 7) || p[i].x > p[j].x) &&
                ((i != 0 && j != 5) || p[i].y > p[j].y) &&
                ((i != 1 && j != 4) || p[i].y < p[j].y))
            ) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var result = {};
    result.start = {};
    result.end = {};
    result.start.x = p[res[0]].x;
    result.start.y = p[res[0]].y;
    result.end.x = p[res[1]].x;
    result.end.y = p[res[1]].y;
    return result;
}

//获取组成箭头的三条线段的路径
function getArr(x1, y1, x2, y2, size) {
    var angle = Raphael.angle(x1, y1, x2, y2);//得到两点之间的角度
    var a45 = Raphael.rad(angle - 45);//角度转换成弧度
    var a45m = Raphael.rad(angle + 45);
    var x2a = x2 + Math.cos(a45) * size;
    var y2a = y2 + Math.sin(a45) * size;
    var x2b = x2 + Math.cos(a45m) * size;
    var y2b = y2 + Math.sin(a45m) * size;
    var result = ["M", x1, y1, "L", x2, y2, "L", x2a, y2a, "M", x2, y2, "L", x2b, y2b];
    return result;
}

Raphael.fn.drawArr = function (obj) {
    var point = getStartEnd(obj.obj1, obj.obj2);
    var path1 = getArr(point.start.x, point.start.y, point.end.x, point.end.y, 8);
    if (obj.arrPath) {
        obj.arrPath.attr({ path: path1 })
    } else {
        obj.arrPath = this.path(path1).attr({
            stroke: "#000",
            "stroke-width": "2px"
        });
    }
    return obj;
};

function initNode(refresh) {
    if(refresh){
        //先擦除之前的
        paper.clear();
        $("svg").remove();
        paper =  Raphael("raphael", 800, 500);
        allNode = [];
        refresh.forEach(function (node) {
            drawMainNode(node);
        });
        initPath();
    }else{
        nodeInfo.forEach(function (node) {
            drawMainNode(node);
        });
        initPath();
    }
}

function initPath() {
    allNode.forEach(function (node) {
        var nodeData = node.dataInfo;
        var processTo = nodeData.process_to.split(",");
        processTo.forEach(function (tNode) {
            if(tNode){
                tNode = getNodeObjById(tNode);
                var tempCollection = paper.drawArr({obj1:node.obj,obj2:tNode.obj});
                collections.push(tempCollection);
            }
        });
    })
}

function deleteNode() {
    var selectNode = $('#choose_box').val();
    if(selectNode){
        //先删除掉这个节点数据
        var dNode = getNodeObjById(selectNode);
        var index = allNode.indexOf(dNode);
        allNode.splice(index,1);
        //先梳理下链接关系
        var dNodeTo = dNode.dataInfo.process_to.split(",");
        //再寻找它的上一个
        var parentIds = getParentInfo(selectNode);
        console.log(dNodeTo,parentIds);
        if(parentIds.length > 1 && dNodeTo.length > 1){
            layerAlert("该节点不能被删除,请先删除它的分支节点","error");
            return
        }
        //改变他的父节点的process_to,将它的子节点加入到父节点
        changeProcessToInfo(dNodeTo,parentIds,selectNode);
        console.log(allNode.length);
        initNode(allNode);
    }else{
        layerAlert("请先选中一个节点再删除","error");
    }
}

function changeProcessToInfo(dNode,pNode,selectNode) {
    var newAllNode = [];
    if(dNode.length === 2){
        allNode.forEach(function (node) {
            var tempNode = node;
            if(tempNode.dataInfo.id === pNode[0]){
                //找到了父节点,将待删除的子节点加入到它的父节点的子节点中去
                dNode.forEach(function (d) {
                    if(tempNode.dataInfo.process_to.indexOf(d) === -1){
                        tempNode.dataInfo.process_to = String(tempNode.dataInfo.process_to.split(",").push(d));
                    }
                })
            }
            //所有的节点都得去掉待删除的节点
            var nodeProcessToArr = tempNode.dataInfo.process_to.split(",");
            var dIndex = nodeProcessToArr.indexOf(nodeProcessToArr);
            nodeProcessToArr.splice(dIndex,1);
            tempNode.dataInfo.process_to = String(nodeProcessToArr);
            newAllNode.push(tempNode);
        })
    }else{
        allNode.forEach(function (node) {
            var tempNode = node;
            if(pNode.indexOf(tempNode.dataInfo.id) !== -1){
                //找到了父节点,将待删除的子节点加入到它的父节点的子节点中去
                if(tempNode.dataInfo.process_to.indexOf(dNode[0]) === -1){
                    //先删除待删除的节点的Id
                    tempNode.dataInfo.process_to = String(tempNode.dataInfo.process_to.split(",").push(dNode[0]));
                }
            }
            //所有的节点都得去掉待删除的节点
            var nodeProcessToArr = tempNode.dataInfo.process_to.split(",");
            var dIndex = nodeProcessToArr.indexOf(nodeProcessToArr);
            nodeProcessToArr.splice(dIndex,1);
            tempNode.dataInfo.process_to = String(nodeProcessToArr);
            newAllNode.push(tempNode)
        })
    }
    //刷新全局数据
    allNode = newAllNode
}

function getParentInfo(selectNode) {
    var parentIds = [];
    allNode.forEach(function (node) {
        var tempTo = node.dataInfo.process_to.split(",");
        var isIn = tempTo.indexOf(selectNode);
        //表示找到了包含待删除节点的父节点
        if(isIn !== -1){
            parentIds.push(node.dataInfo.id);
        }
    });
    return parentIds;
}

function drawPathLine(sX,sY,eX,eY) {
    var pathLine = paper.path("M "+sX + "," + sY +" L "+eX + "," + eY).attr({
        stroke: "#000",
        "stroke-width": "2px",
        "arrow-end": "classic-wide-long"
    });
}

function getNodeObjById(id) {
    var NodeObj = {};
    allNode.forEach(function (node) {
        if(node.dataInfo.id === id) {
            NodeObj = node;
        }
    });
    return NodeObj;
}

//拖动节点开始时的事件
var dragger = function () {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({ "fill-opacity": .2 }, 500);
};
//拖动事件
var move = function (dx, dy) {
    var att = { x: this.ox + dx, y: this.oy + dy };
    this.attr(att);
    for (var i = collections.length; i--; ) {
        paper.drawArr(collections[i]);
    }
};
//拖动结束后的事件
var up = function () {
    this.animate({ "fill-opacity": 0 }, 500);
};


function createNode(nodeType) {
    var xAndY = getDrawXY(nodeType);
    if(allNode.length === 0){
        xAndY = [50, 200];
    }
    var node = {
        flow_id:1,
        process_name:"步骤"+"1",
        process_to:"2,3",
        id:2
    };
    var rect2 = paper.rect(xAndY[0], xAndY[1], defaultNodeWidth, defaultNodeHeight, defaultNodeRedius)
        .attr({fill:"#FFF",stroke:"#000"})
        .data(node);
    var text = paper.text(xAndY[0] + defaultNodeTextPaddingLeft, xAndY[1] + defaultNodeTextPaddingTop,"新建节点").attr({
        "fill":defaultNodeTextColor, // font-color
        "font-size":defaultNodeTextSize, // font size in pixels
        "text-anchor":"start",
        "font-family":"century gothic" // font family of the text
    });
    //绑定事件
    rect2.click(function (e) {
        nodeOnClick(this,text);
    });
    // rect2.drag(move,dragger,up);
    var temp = {
        obj:rect2,
        index:1,
        type:1,
        text:text,
        dataInfo:node
    };
    allNode.push(temp);
}

function getDrawXY(nodeType) {
    var maxX = 50;
    var maxY = 200;
    if(nodeType !== 3){
        allNode.forEach(function (node) {
            var x = node.obj.attr("x");
            console.log(node);
            var y = node.obj.attr("y");
            if(x > maxX) {
                maxX = x;
            }
            if(y > maxY) {
                maxY = y;
            }
        });
        $('#fenzhi_num').val(1);
        return [maxX + defaultNodeWidth + defaultFarNode, 200]
    }else{
        var fenzhiNum = $("#fenzhi_num").val();
        if(parseInt(fenzhiNum) !== 1){
            allNode.forEach(function (node) {
                var x = node.obj.attr("x");
                if(x > maxX) {
                    maxX = x;
                }
            });
            var y = node.obj.attr("y");
            var topBottom = fenzhiNum % 2 === 0 ? 'bottom' : 'top';
            var heightBei = parseInt(fenzhiNum / 2);
            if(topBottom === 'bottom'){
                maxY = 200 + heightBei * 40;
            }else{
                maxY = 200 - heightBei * 40;
            }
            $('#fenzhi_num').val(fenzhiNum + 1 );
            return [maxX, maxY]
        }else{
            allNode.forEach(function (node) {
                var x = node.obj.attr("x");
                var y = node.obj.attr("y");
                if(x > maxX) {
                    maxX = x;
                }
                if(y > maxY) {
                    maxY = y;
                }
            });
            $('#fenzhi_num').val(2);
            return [maxX + defaultNodeWidth + defaultFarNode, 180]
        }
    }


}

function nodeOnClick(node,textObj) {
    var selectId = node.data("id");
    //循环遍历其他节点,去除选中状态
    allNode.forEach(function (node) {
        node.obj.attr({fill:"#FFF",stroke:"#000"});
        node.text.attr({fill:defaultNodeTextColor});
        $("#choose_box").val("");
    });
    node.attr({fill:"#36a4e3",stroke:"#36a4e3"});
    textObj.attr({fill:"#FFF"});
    $("#choose_box").val(selectId);
}

function drawMainNode(node) {
    if(!node.style){
        node = node.dataInfo;
    }
    //根据节点类型来获取位置
    var xAndY = getDrawXY(parseInt(node.type));
    //如果是普通节点则不要圆角
    var radius = parseInt(node.type === 2) ? 0 : defaultNodeRedius;
    var rect2 = paper.rect(parseInt(xAndY[0]), parseInt(xAndY[1]), defaultNodeWidth, defaultNodeHeight, radius)
        .attr({fill:"#FFF",stroke:"#000"})
        .data(node);
    var text = paper.text(parseInt(xAndY[0]) + defaultNodeTextPaddingLeft, parseInt(xAndY[1]) + defaultNodeTextPaddingTop, node.process_name).attr({
        "fill":defaultNodeTextColor, // font-color
        "font-size":defaultNodeTextSize, // font size in pixels
        "text-anchor":"start",
        "font-family":"century gothic" // font family of the text
    });
    //绑定事件
    rect2.click(function (e) {
        nodeOnClick(this,text);
    });
    // rect2.drag(move,dragger,up);
    var temp = {
        obj:rect2,
        index:1,
        type:1,
        text:text,
        dataInfo:node
    };
    allNode.push(temp);
}

initNode();


