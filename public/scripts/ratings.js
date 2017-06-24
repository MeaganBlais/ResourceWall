
function setAvgRating(data) {

  var sum = 0;
  var totalOfRatings = data.ratings.length;
  var avg = 0;

  if (totalOfRatings === 0) {
    avg = 0;
  } else {

    for (var i in data.ratings) {
      sum += Number(data.ratings[i].rating);
    }
    avg = Math.round(sum / totalOfRatings);
  }
  return avg;

};


function getUserRating (user_id, data) {
  var user_rating = 0;


  if (data.ratings.length === 0) {
    //The resource has no ratings yet
    return 0;

  } else {
    //The resource has ratings, let's check the array of ratings

    for (var i in data.ratings) {
      //go through all ratings to find if the user logged in has already rated the resource

      if (data.ratings[i].user_id === user_id) {
        //user logged in has rated the resource, get the rating
        return data.ratings[i].rating;
      }
    }

    //The user was not found in the array of ratings, so he/she has not rated the resource yet
    return 0;
  }

};


function analyseRating(data, new_rating) {

  var resource_id = data.resource_id;
  var user_id = JSON.parse(localStorage.getItem("userInfo")).id;

  //Get the actual user rating
  var user_rating = getUserRating(user_id, data);

  // if (Number(new_rating) === 0) {
  //   return;
  // }

  if (Number(user_rating) === 0) {
    //user has not rating yet. send a POST request.
    $data = { rating: new_rating }

      $.ajax({
        method: "POST",
        url: "/api/resources/" + resource_id + "/ratings",
        data: $data
      })
        .done(function(result) {
          $('#resource-' + resource_id).data('resource-data').ratings.push(result[0]);
          var new_data = $('#resource-' + resource_id).data('resource-data');
          $('#resource-' + resource_id).find(".avg_rating").text(setAvgRating(new_data));
        })

  } else if (Number(user_rating) === Number(new_rating)) {
    //user has give the same rating . send a DELETE request.
    // $.ajax({
    //     method: "DELETE",
    //     url: "/api/resources/" + resource_id + "/ratings"
    //   })
    //     .done(function(result) {
    //       var ratingsArray = $('#resource-' + resource_id).data('resource-data').ratings;

    //       for (var rating in ratingsArray) {
    //         if(ratingsArray[rating].user_id === user_id) {
    //           ratingsArray.splice(rating, 1);
    //         }
    //       }

    //       var new_data = $('#resource-' + resource_id).data('resource-data');
    //       $('#resource-' + resource_id).find(".avg_rating").text(setAvgRating(new_data));
    //     })

    // $(".rateYo").rateYo(" ", 0)

  } else {
    //user wnat to change the rating . send a PUT request.
    $data = { rating: new_rating }

    $.ajax({
        method: "PUT",
        url: "/api/resources/" + resource_id + "/ratings",
        data: $data
      })
        .done(function(result) {
          var ratingsArray = $('#resource-' + resource_id).data('resource-data').ratings;
          for (var rating of ratingsArray) {
            if(rating.user_id === user_id) {
              rating.rating = new_rating;
            }
          }
          var new_data = $('#resource-' + resource_id).data('resource-data');
          $('#resource-' + resource_id).find(".avg_rating").text(setAvgRating(new_data));
        })

  }

}



