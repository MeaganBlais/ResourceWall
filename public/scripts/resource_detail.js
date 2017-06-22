$(document).ready( function() {

  // var resource_details = resource_details;

  var resource_id = $('#url').data('id')


  alert(resource_id);
  // console.log("info: ", resource_details);

  $.getJSON("/resources/" + resource_id + "/comments")
        .done(function (resource) {
                // renderTweets(tweets);
                console.log("call renderComments: ", resource);
        })
        .fail(function () {
          console.log("error");
        })

})


