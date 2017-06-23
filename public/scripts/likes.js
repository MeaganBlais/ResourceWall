$(document).ready(function () {
  //Send ajax request to write to likes table
  var addLike = function (resource) {
    var resource_id = resource.data('resource-data').resource_id;
    $.ajax({
      method: "POST",
      url: "/api/resources/" + resource_id + "/likes",
    }).done( function (result) {
      console.log(result);
    })

    // function updateLikesCounter (likes) {
    //
    //   var totalOfLikes = likes.length;
    //
    //   $("#totalOfLikes").text(totalOfLikes);
    // }
    //
    // //function that load likes from db, and show on screen
    // function loadLikes () {
    //   var resource_id = resource.data('resource-data').resource_id;
    //   // Get all comments for the resource
    //   $.getJSON("/api/resources/" + resource_id + "/like")
    //   .done(function (likes) {
    //     updateLikesCounter(likes);
    //   })
    //   .fail(function () {
    //     console.log("error");
    //   })
    // }
    //
    // //start the page showing the total likes
    // loadLikes();





  }

  // watching for like event
  var likeButtonHandler = function () {
    $('#all-resources').on('click', '.glyphicon-heart', function (event) {
      // console.log('click', $(this).closest('.resource-container'));
      var resource = $(this).closest('.resource-container');
      addLike(resource);
    });
  }

  $(document).ready(function () {
    likeButtonHandler();
  });

})
