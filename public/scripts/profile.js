

$(document).ready(function () {
  $("#profileUpdate").hide()
  $("#edit").click(function(){
  $("#profile").hide()
  $("#profileUpdate").toggle({duration: 500});
  });
});
