var registerFormHandler = function () {
  //upon submission of registration form, validate data and then send the new user info to server
  $("#registration").on("submit", function (event) {
    event.preventDefault();
    var validations = true;
    var message = "";

    //validate inputs
    if(emptyFiled($("#fullname").val()) || emptyFiled($("#username").val()) ||
      emptyFiled($("#email").val()) || emptyFiled($("#password1").val()) ||
      emptyFiled($("#password2").val())) {

      validations = false;
      message += "All (*) fields are required. ";

    }

    if(!equal($("#password1").val(),$("#password2").val())) {
      validations = false;
      message += "'Password' and 'Confirm Password' are not the same. ";
    }

    if ( ($("#avatar").val()) && !( (/[jJ][pP][gG]$/.test($("#avatar").val())) ||
      (/[pP][nN][gG]$/.test($("#avatar").val())) ||
      (/[gG][iI][fF]$/.test($("#avatar").val())) )) {
        validations = false;
        message += "Avatar must be in one of the following formats: jpg, png or gif.";
    }

    $('#register_message').text(message);


    //POST request to server with new user info
    if (validations) {

      $.ajax({
        url: "/api/users",
        method: "POST",
        data: $(this).serialize(),
        success: (response) => {
          localStorage.setItem("userInfo", JSON.stringify(response));
          $(location).attr('href','/');
        },
        error: function(response){
          $('#register_message').text(response.responseText);
        }
      });
    }

  })
}

var loginFormHandler = function () {
  //when a user clicks the loging button on the nav
  $(".logged-out form").on("submit", function (event) {
    event.preventDefault();
    var validations = true;

    //validate empty inputs
    if(emptyFiled($("#login").val()) || emptyFiled($("#password").val())) {
      validations = false;
      $('#nav_message').text("We need your login and your password.");
    } else {
      $('#nav_message').text("");
    };

    //send POST request to server to validate login information
    if (validations) {
      $.ajax({
        url: "/api/users/login",
        method: "POST",
        data: $(this).serialize(),
        success: (response) => {
          localStorage.setItem("userInfo", JSON.stringify(response));
          $(location).attr('href','/');
          // navLogin();
        },
        error: function(data){
          $('#nav_message').text("Wrong login and/or password.");
        }
      });
    }

  });
}


var logoutButton = function () {
  //when logout button is clicked, send post request to server to logout
  $("#logout-nav").on("click", (event) => {
    event.preventDefault();
    $.ajax({
      url: "/api/users/logout",
      method: "POST",
      success: () => {
        // navLogout();
        localStorage.removeItem('userInfo');
        $(location).attr('href','/');
      }
    })
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

var getUserID = function () {
  //checks if the user has a saved session in local storage
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo) {
    return userInfo.id;
  }
  return null;
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

  //forms don't accept put method so this function works around that limitation
function putUpdate(){
  var validations = true;
  var message = "";

  var form = $('.updates');

  //validate inputs
  if(emptyFiled($("#fullname").val()) || emptyFiled($("#username").val()) ||
    emptyFiled($("#email").val())) {

    validations = false;
    message += "All (*) fields are required. ";

  }

  if ($("#avatar").val()) {
    if ($("#avatar").val() !== "/images/placeholder-user.png") {

      if (!(/^[hH][tT][tT][pP]:\/\//.test($("#avatar").val())) ||
        !( (/[jJ][pP][gG]$/.test($("#avatar").val())) ||
          (/[pP][nN][gG]$/.test($("#avatar").val())) ||
          (/[gG][iI][fF]$/.test($("#avatar").val())))) {
        validations = false;
        message += "The avatar must start with http:// and must be in one of the following formats: jpg, png or gif.";
      }
    }
  }

  $('#register_message').text(message);

  if (validations) {
    $.ajax({
      url: '/api/users/' + getUserID(),
      type: 'PUT',
      data: form.serialize(),
      success: function(data) {
        $(location).attr('href','/');
      },
      error: function(response){
        $('#register_message').text(response.responseText);
      }
    });
  }

  return false;
}


$(document).ready(function () {
  onStart();
  registerFormHandler();
  logoutButton();
  loginFormHandler();
});
