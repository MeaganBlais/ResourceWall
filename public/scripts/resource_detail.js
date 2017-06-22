$(document).ready( function() {

  // Variable to get the resource id from html
  var resource_id = $('#url').data('id')

  //function that takes in a comment object
  //and return a comment <article> element containing the entire HTML structure of the comment
  function createCommentElement (CommentData) {

    //get how many days between today and the date when the comment was created
    var dateCreated = new Date(CommentData.created_at);
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
                      <img class="avatar" src ="${CommentData.avatar_URL}">
                      <span class="input_user" data-id='${CommentData.user_id}'>${CommentData.user_name}</span>
                    </header>
                    <div class="read-comment">
                      <span>${CommentData.comment}</span>
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

    //if there are any comment, loops through comments
    //calls createCommentElement for each comment and takes return value and appends it to the comments container
    if (comments.length > 0) {
      for (var i in comments) {
        comment = createCommentElement(comments[i]);
        $('#show_comments_container').append(comment);
      }
    }

  };

  // Get all comments for the resource
  $.getJSON("/resources/" + resource_id + "/comments")
        .done(function (resource) {
                renderComments(resource);
        })
        .fail(function () {
          console.log("error");
        })

})


