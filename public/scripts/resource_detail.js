
//function that takes in a comment object
//and return a comment <article> element containing the entire HTML structure of the comment
function createCommentElement (commentData) {

  //get how many days between today and the date when the comment was created
  var dateCreated = new Date(commentData.created_at);
  var dateToday = new Date();

  var timeDiff = Math.abs(dateToday.getTime() - dateCreated.getTime());
  var diffDays = (Math.ceil(timeDiff / (1000 * 3600 * 24)) -1);

  if (diffDays === 0) {
    diffDays = "Today";
  } else {
    diffDays += " day(s) ago"
  }


  //create the structure of comment to be included in the html
  var comment = (`<article  class="comment_container">
                  <header>
                    <img class="avatar" src ="${commentData.avatar_URL}">
                    <span class="input_user" data-id='${commentData.user_id}'>${commentData.user_name}</span>
                  </header>
                  <div class="read-comment">
                    <span>${commentData.comment}</span>
                  </div>
                  <footer>
                    <span class="daysAgo">${diffDays}</span>
                  </footer>
                </article>`);

  //return the structure to append to html
  return comment;

}

//function that take all comments for the resource, call the createCommentElement function above,
//and use the returned jQuery object to append each one to the #show_comments_container section
function renderComments (comments) {

  //define a variable to receive the html block for the comment
  var comment;

  //clear the container before to read all comments
  $("#show_comments_container").empty();


  //if there are any comment, loops through comments
  //calls createCommentElement for each comment and takes return value and appends it to the comments container
  if (comments.length > 0) {
    for (var i in comments) {
      comment = createCommentElement(comments[i]);
      $('#show_comments_container').append(comment);
    }
  }

};

//function that update comments counter
function updateCommentsCounter (comments) {

  var totalOfComments = comments.length;

  $("#totalOfComments").text(totalOfComments);

}

//function that load comments from db, and show on screen (call renderComments function)
function loadComments (resource_id) {

  // Get all comments for the resource
  $.getJSON("/resources/" + resource_id + "/comments")
    .done(function (resource) {
            renderComments(resource);
            updateCommentsCounter(resource);
    })
    .fail(function () {
      console.log("error");
    })
}

//function that load all details for the resource, to compose the data on html
function loadDataResource(resource_id) {

  $.ajax({
    url: '/api/resources/' + resource_id,
    method: 'GET',
    success: function (results) {

      $(`#resource-${resource_id}`).data('resource-data', results[0]);
      var data = $(`#resource-${resource_id}`).data('resource-data');
      renderTags(data.categories);
      var user_id = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).id : '';

      // var data = results[0];

      // Setting the initial rating
      $(".rateYo").rateYo({
        rating: getUserRating(user_id, results[0]),
        fullStar: true
      });

      // Setting the parameters of star ratings
      $(".rateYo").rateYo("option", "starWidth", "20px"); // Size of the stars
      $(".rateYo").rateYo("option", "ratedFill", "#d8505c"); // Color of the rated stars
      $(".rateYo").rateYo("option", "fullStar", true); // Setting ratings as full star
      $(".rateYo").rateYo("option", "readOnly", !checkLogin()); //Setting read only if user is not logged in

      //Set the average of ratings
      $(".avg_rating").text(setAvgRating(results[0]));

      // Getting the rating selected by the user
      $(".rateYo").rateYo("option", "onSet", function () {

        //exits function if user is not logged in
        if (!checkLogin()) {
          return;
        }

        //Get the rating clicked
        var new_rating = $(".rateYo").rateYo("rating");
        var data = $(`#resource-${results[0].resource_id}`).data('resource-data');

        //Call a function to anlyse the user action
        analyseRating(data, new_rating);



      });

        //Set the total of likes
        $(".totalOfLikes").text(updateLikesCounter(data));

        //set the color of the heart if the user is logged in
        if (user_id) {
          if (doesUserLikeResource(user_id, data.likes)) {
            $(".glyphicon-heart").addClass('liked');
          } else {
            $(".glyphicon-heart").removeClass('liked');
          }
        }


      return;
    }
  });
}

function renderTags(categories) {
  for (var category of categories) {
    createTagComponent(category.name);
  }
}


$(document).ready( function() {

  // Variables to get information about the user and the resource id
  var resource_id = $('#url').data('id')

  if(checkLogin()) {
    var user = JSON.parse(localStorage.getItem("userInfo"))
    var user_id = user.id;
    var user_name = user.user_name;
    var user_avatar = user.avatar_URL;

    $(".comment_container").removeClass('hidden');
  }


  loadDataResource(resource_id);


  //set the user information on comment container
  $(".input_user").text(user_name);
  $(".input_user").data("id", user_id);
  $("#avatar_comment").attr("src", user_avatar);


  //event listener to submit button
  $("#input-comment-btn").on("click", function(event) {
console.log("clicou")
    //prevent to change the page
    event.preventDefault();

    //get data from the form
    $textarea = $(this).closest("form").find("textarea");
    $message = $(this).closest("form").find("#message");
    $counter = $(this).closest("form").find(".counter");

    //prepare data for Ajax calling
    $data = $textarea.serialize();

    //get the text (without spaces) and its lenght to validate
    $text = $textarea.val().trim();
    $textLength = $text.length;


    if ($text === "" || $text === null) {

      //if text is null, show a message for empty text
      $message.text("Your comment is empty!");
      $textarea.focus();

    } else if ($textLength > 255) {

      //if text exceed 140 characters, show a message for too long text
      $message.text("Your message is too long!");
      $textarea.focus();

    } else {
console.log("vou incluir")
      //validations are ok, comment will be send, and the area for comments will be re-loaded
      $.post(`/api/resources/${resource_id}/comments`, $data)

        .done(function () {
                loadComments(resource_id);
              });

      //hidden the message if it is shown, clear the textarea, and reset the char-counter
      $message.text("");
      $textarea.val("").focus();
      $counter.text("255");
    }

  });


  //start the page showing the comments
  loadComments(resource_id);

})


