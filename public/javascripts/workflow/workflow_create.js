var workflowCreate = function () {
   var addUser = function () {
        $('#addUser').on('click',function () {
            $('#mask').show();
            $('#modal').show();
        })
   }

   var addConfirm = function () {
       $('.addConfirm').on('click', function () {
           $('#mask').hide()
           $('#modal').hide()
       })

   }
    return {
        init: function () {
            addUser();
            addConfirm();
        }
    }
}()
workflowCreate.init();