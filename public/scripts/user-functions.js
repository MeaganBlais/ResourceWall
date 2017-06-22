var registerFormHandler = function () {
  //upon submission of registration form, validate data and then send the new user info to server
  $("#registration").on("submit", function (event) {
    event.preventDefault();
    //validate inputs

    //POST request to server with new user info
    $.ajax({
      url: "/api/users",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {
        console.log("Browser thinks it works");
      }
    });

  })
}


$(document).ready(function () {
  registerFormHandler();
});
