var workflowCreate = function () {
   var addUser = function () {
        $('#addUser').on('click',function () {
            $('#contactModal').show();
            $('#modal').show();
        })
   }

   var addConfirm = function () {
       $('.addConfirm').on('click', function () {
           $('#contactModal').hide()
           $('#modal').hide()
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