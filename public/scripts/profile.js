var editButtonHandler = function () {
  $("#edit").click(function(){
    $("#profile").hide()
    $("#profileUpdate").toggle({duration: 500});
  });
}

//functions that are called on loading of profile page
$(document).ready(function () {
  editButtonHandler();
});
