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
        localStorage.setItem("userInfo", JSON.stringify(response[0]));
      }
    });

  })
}

var checkLogin = function () {
  //checks if the user has a saved session in local storage
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo) {
    return true;
  }
  return false;
}

var navLogin = function () {
  //update nav logged-in section with user info and toggle it on
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  $(".logged-in span").text(`@${userInfo.user_name}`);
  $(".logged-in .avatar").attr("src", userInfo.avatar_URL);
  $(".logged-in, .logged-out").toggle();
}

var navLogout = function () {
  //wipe nav logged-in section and toggle back to logged-out
  $(".logged-in span").text("");
  $(".logged-in .avatar").attr("");
  $(".logged-in, .logged-out").toggle();
}

var onStart = function () {
  //checks if the user is logged in, calls the nav-login toggle function
  if (checkLogin()) {
    navLogin();
  }
}


$(document).ready(function () {
  onStart();
  registerFormHandler();
  console.log(checkLogin());
});
