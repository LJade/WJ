var workflowConfig = function () {
    var create = function () {
        var originX = 20
        var originY = 20
        var id = 1
        $('#createNode').on('click',function () {
            drawRec("新节点",originX,originY)
            originX = originX > 860 ? 20 : originX + 120
            originY = originX > 860 ? originY + 80 : originY;
            id++
        })
        function drawRec(text,x,y) {
            this.rect=document.createElementNS("http://www.w3.org/2000/svg","rect")
            this.rect.setAttributeNS(null,"x",x)
            this.rect.setAttributeNS(null,"y",y)
            this.rect.setAttributeNS(null,"width","90")
            this.rect.setAttributeNS(null,"height","40")
            this.rect.setAttributeNS(null,"rx","5")
            this.rect.setAttributeNS(null,"ry","5")
            this.rect.style.cssText = 'fill:white;stroke:black;stroke-width:2;'
            this.rect.id = 'rect'+id
            document.querySelector("svg").appendChild(this.rect)
        }


        function drawArrow(text,x,y) {
            this.rect=document.createElementNS("http://www.w3.org/2000/svg","rect")
            this.rect.setAttributeNS(null,"x",x)
            this.rect.setAttributeNS(null,"y",y)
            this.rect.setAttributeNS(null,"width","90")
            this.rect.setAttributeNS(null,"height","40")
            this.rect.setAttributeNS(null,"rx","5")
            this.rect.setAttributeNS(null,"ry","5")
            this.rect.style.cssText = 'fill:white;stroke:black;stroke-width:2;'
            document.querySelector("svg").appendChild(this.rect)
        }
    }



    return {
        init: function () {
            create()
        }
    }
}()
workflowConfig.init()