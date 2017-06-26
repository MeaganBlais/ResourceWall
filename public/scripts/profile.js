// toggles the profile page to allow users to edit profile information
$(document).ready(function () {
  $("#profileUpdate").hide()
  $("#edit").click(function(){
  $("#profile").hide()
  $("#profileUpdate").toggle({duration: 500});
  });
});
