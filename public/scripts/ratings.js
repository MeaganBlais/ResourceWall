
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

  console.log("user_rating: ", user_rating);
  console.log("new_rating: ", new_rating);

  if (Number(user_rating) === 0) {
    //user has not rating yet. send a POST request.
    console.log("Insert: POST request!");
    //update the data in html
    //update the avg

  } else if (Number(user_rating) === Number(new_rating)) {
    //user has give the same rating . send a DELETE request.
    console.log("Delete: DELETE request!");
    //update the data in html
    //update the avg
    // $(".rateYo").rateYo("rating", 0)

  } else {
    //user wnat to change the rating . send a PUT request.
    console.log("Update: PUT request!");
    //update the data in html
    //update the avg

  }

}



