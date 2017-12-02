var workflowConfig = function () {
    var create = function () {
        $('#createNode').on('click',function () {
            alert(2)
            drawRec("新节点","20","20")
        })
        function drawRec(text,x,y) {
            this.rect=document.createElementNS("http://www.w3.org/2000/svg","rect")
            this.rect.setAttributeNS(null,"x",x)
            this.rect.setAttributeNS(null,"y",y)
            this.rect.setAttributeNS(null,"width","120")
            this.rect.setAttributeNS(null,"height","80")
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