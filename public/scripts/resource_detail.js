function createCommentElement (commentData) {
//function that takes in a comment object
//and return a comment <article> element containing the entire HTML structure of the comment
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
  var comment = $(`<article  class="comment_container">
                  <header>
                    <img class="avatar" src ="${commentData.avatar_URL}">
                    <span class="input_user" data-id='${commentData.user_id}'>${commentData.user_name}</span>
                  </header>
                  <div class="read-comment">
                    <span></span>
                  </div>
                  <footer>
                    <span class="daysAgo">${diffDays}</span>
                  </footer>
                </article>`);
  //append comment using text() function to avoid XSS
  comment.find('.read-comment').find('span').text(commentData.comment);
  //return the structure to append to html
  return comment;
}


function renderComments (comments) {
//function that take all comments for the resource, call the createCommentElement function above,
//and use the returned jQuery object to append each one to the #show_comments_container section
  //define a variable to receive the html block for the comment
  var comment;
  //clear the container before to rendering all comments
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

function updateCommentsCounter (comments) {
//function that update comments counter
  var totalOfComments = comments.length;
  $("#totalOfComments").text(totalOfComments);
}

function loadComments (resource_id) {
//function that load comments from db, and show on screen (call renderComments function)
  // Get all comments for the resource
  $.getJSON("/api/resources/" + resource_id + "/comments")
    .done(function (resource) {
            renderComments(resource);
            updateCommentsCounter(resource);
    })
    .fail(function () {
      console.log("error");
    })
}

function loadDataResource(resource_id) {
//function that load all details for the resource, to compose the data on html
  //send get request
  $.ajax({
    url: '/api/resources/' + resource_id,
    method: 'GET',
    success: function (results) {
      //if successful, make a variable for the data and render the tags for the resource
      $(`#resource-${resource_id}`).data('resource-data', results[0]);
      var data = $(`#resource-${resource_id}`).data('resource-data');
      renderTagsResourceDetails(data.categories);
      var user_id = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).id : '';
      // Setting the initial rating to the current users rating for that resource
      $(".rateYo").rateYo({
        rating: getUserRating(user_id, results[0]),
        fullStar: true
      });
      // Setting the parameters of star ratings
      $(".rateYo").rateYo("option", "starWidth", "20px"); // Size of the stars
      $(".rateYo").rateYo("option", "ratedFill", "#d8505c"); // Color of the rated stars
      $(".rateYo").rateYo("option", "fullStar", true); // Setting ratings as full star
      $(".rateYo").rateYo("option", "readOnly", !checkLogin()); //Setting read only if user is not logged in
      //Set the average rating
      $(".avg_rating").text(setAvgRating(results[0]));
      // Activated when star icons are clicked
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

function renderTagsResourceDetails(categories) {
  //render tags to the resource details page when passed an array of associated categories
  for (var category of categories) {
    createTagComponent(category, $('.tag-container'), "large" , true);
  }
}

function hideTagForm() {
  //hide tag entry form if user is not logged in
  if (!checkLogin()) {
    $('#tag-form').hide();
  }
}


$(document).ready( function() {
  //call functions on page start
  setAutocomplete();
  deleteTagHandler();
  tagFormHandler();
  hideTagForm();
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


