
function doesUserLikeResource(user_id, likes) {
  //check if User likes Resource if you pass the array or likes
  var alreadyLiked = false;
  for (var i in likes) {
    if (user_id === likes[i].user_id) {
      alreadyLiked = true;
    }
  }
  return alreadyLiked;
}

function updateLikesCounter (resource) {
  //get total amount of likes for a resource
  var totalOfLikes = resource.likes.length;
  return totalOfLikes;
}

var addLike = function (resource_data) {
  //Send ajax request to write to likes table for given resource
  var resource_id = resource_data.resource_id;
  $.ajax({
    method: "POST",
    url: "/api/resources/" + resource_id + "/likes",
  }).done( function (result) {
      $('#resource-' + resource_id).data('resource-data').likes.push(result[0]);
      var new_data = $('#resource-' + resource_id).data('resource-data');
      $('#resource-' + resource_id).find(".totalOfLikes").text(updateLikesCounter(new_data));
  })
}

var removeLike = function (resource_data) {
  //Send ajax request to delete from likes table for given resource and user
    var resource_id = resource_data.resource_id;
    var user_id = JSON.parse(localStorage.getItem("userInfo")).id;
    $.ajax({
      method: "DELETE",
      url: "/api/resources/" + resource_id + "/likes"
    })
    .done( function (result) {
        var likesArray = $('#resource-' + resource_id).data('resource-data').likes;
         for (var i in likesArray) {
            if(likesArray[i].user_id === user_id) {
              likesArray.splice(i, 1);
            }
          }
        var new_data = $('#resource-' + resource_id).data('resource-data');
        $('#resource-' + resource_id).find(".totalOfLikes").text(updateLikesCounter(new_data));
    });
  }


var likeButtonHandler = function () {
  //activate when user clicks on heart icon
  $('#all-resources').on('click', '.glyphicon-heart', function (event) {
    //if user isn't logged in, exit function
    if (!checkLogin()) {
      return;
    }
    var resource_data = $(this).closest('.resource-container').data('resource-data');
    var likes = resource_data.likes;
    var user_id = JSON.parse(localStorage.getItem("userInfo")).id;
    //if user likes resource, call removeLike function, otherwise call the like function
    if (doesUserLikeResource(user_id, likes)) {
      removeLike(resource_data);
      $(this).removeClass('liked');
    } else {
      addLike(resource_data);
      $(this).addClass('liked');
    }
  });
}

$(document).ready(function () {
likeButtonHandler();
})
