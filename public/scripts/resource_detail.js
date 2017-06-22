$(document).ready( function() {

  // Variables to get information about the user and the resource id
  var resource_id = $('#url').data('id')
  var user = JSON.parse(localStorage.getItem("userInfo"))
  var user_id = user.id;
  var user_name = user.user_name;
  var user_avatar = user.avatar_URL;

  //set the user information on comment container
  $(".input_user").text(user_name);
  $(".input_user").data("id", user_id);
  $("#avatar_comment").attr("src", user_avatar);



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
    $("#tshow_comments_container").empty();


    //if there are any comment, loops through comments
    //calls createCommentElement for each comment and takes return value and appends it to the comments container
    if (comments.length > 0) {
      for (var i in comments) {
        comment = createCommentElement(comments[i]);
        $('#show_comments_container').append(comment);
      }
    }

  };

  //
  function updateCommentsCounter (comments) {

    var totalOfComments = comments.length;

    $("#totalOfComments").text(totalOfComments);

  }

  //function that load comments from db, and show on screen (call renderComments function)
  function loadComments () {

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

  //start the page showing the comments
  loadComments();

})


