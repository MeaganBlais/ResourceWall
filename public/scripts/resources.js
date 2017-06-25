var loadResources = function () {
  $.ajax({
    url: '/api/resources',
    method: 'GET',
    success: function (results) {
      // renderResources(results, origin);
      localStorage.setItem("resources", JSON.stringify(results));
    }
  });
}

var createResourceElement = function (resource) {
  var $resource = $(`<article id='resource-${resource.resource_id}'>`).addClass('resource-container');
  var user_id = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).id : '';

  $resource.data('resource-data', resource);

  //header
  var resourceHeader = $("<header>").append(`
    <h1><a href="${resource.URL}">${resource.title}</a></h1>
  `);

  //body
  var resourceBody = $("<section>").append(`
    <p><a href="/resources/${resource.resource_id}">${resource.description}</a></p>
  `);

  //footer
  var resourceFooter = $("<footer>").append(`
    <span>
      <img class="avatar" src="${resource.avatar_URL}">
      <span>${resource.user_name}</span>
    </span>
    <span class="icons pull-right">
      <span class="ratings">
        <div class="rateYo">
          <input type="radio" name="example" class="rating" value="1" />
          <input type="radio" name="example" class="rating" value="2" />
          <input type="radio" name="example" class="rating" value="3" />
          <input type="radio" name="example" class="rating" value="4" />
          <input type="radio" name="example" class="rating" value="5" />
        </div>
        <span class="avg_rating"></span>
      </span>
      <span class="heart-comments">
        <span class="likes"><i class="glyphicon glyphicon-heart"></i><span class="totalOfLikes"></span></span>
        <span class="comments"><i class="glyphicon glyphicon-comment"></i> <span class="totalOfComments"></span></span>
      </span>
    </span>
  `);

  $resource.append(resourceHeader);
  $resource.append(resourceBody);
  $resource.append(resourceFooter);

  // Setting the initial rating
  $resource.find(".rateYo").rateYo({
    rating: getUserRating(user_id, resource),
    fullStar: true
  });


  // Setting the parameters of star ratings
  $resource.find(".rateYo").rateYo("option", "starWidth", "20px"); // Size of the stars
  $resource.find(".rateYo").rateYo("option", "ratedFill", "#d8505c"); // Color of the rated stars
  $resource.find(".rateYo").rateYo("option", "fullStar", true); // Setting ratings as full star
  $resource.find(".rateYo").rateYo("option", "readOnly", !checkLogin()); //Setting read only if user is not logged in

  //Set the average of ratings
  $resource.find(".avg_rating").text(setAvgRating(resource));

  // Getting the rating selected by the user
  $resource.find(".rateYo").rateYo("option", "onSet", function () {

    //exits function if user is not logged in
    if (!checkLogin()) {
      console.log("not logged in!");
      return;
    }

    //Get the rating clicked
    var new_rating = $resource.find(".rateYo").rateYo("rating");

    //Call a function to anlyse the user action
    var rating = analyseRating(resource, new_rating, this);

  });

  //Set the total of likes
  $resource.find(".totalOfLikes").text(updateLikesCounter(resource));

  //set the color of the heart if the user is logged in
  if (user_id) {
    if (doesUserLikeResource(user_id, resource.likes)) {
      $resource.find(".glyphicon-heart").addClass('liked');
    } else {
      $resource.find(".glyphicon-heart").removeClass('liked');
    }
  }

  //Set the total of comments
  $resource.find(".totalOfComments").text(resource.comments);

  return $resource;
}

var clearResources = function () {
  $('#all-resources').empty();
}

var clearMyResources = function () {
  $('#my-resources').empty();
}

var clearLikedResources = function () {
  $('#my-liked-resources').empty();
}

var renderResources = function (resources) {
  // var resources = JSON.parse(localStorage.getItem('resources'));
  clearResources();
  for (var resource of resources) {
    $('#all-resources').append(createResourceElement(resource));
  }
}

var renderMyResources = function (resources) {
  var user_id = JSON.parse(localStorage.getItem("userInfo")).id;
  var resources = JSON.parse(localStorage.getItem('resources'));
  var added = false;
  clearMyResources();
  for (var resource of resources) {
    if (resource.user_id === user_id) {
      added = true;
      $('#my-resources').append(createResourceElement(resource));
    }
  }
  if (!added) {
    $("#my-resources").append("<h4>You didn't add any resources.</h4>");
  }
}

var renderLikedResources = function (resources) {
  var user_id = JSON.parse(localStorage.getItem("userInfo")).id;
  var resources = JSON.parse(localStorage.getItem('resources'));
  var liked = false;
  clearLikedResources();
  for (var resource of resources) {
    if (resource.user_id !== user_id) {
      if(doesUserLikeResource(user_id, resource.likes)){
        liked = true;
        $('#my-liked-resources').append(createResourceElement(resource));
      }
    }
  }
  if (!liked) {
    $("#my-liked-resources").append("<h4>You didn't like any resources.</h4>");
  }
}

var doesResourceContain = function (resource, str) {
//check if a resource contains the search string in either the title or description
  //check title
  if (resource.title.includes(str)) {
    return true;
  }
  //check description
  if (resource.description.includes(str)) {
    return true;
  }
  return false;
}


var searchBarHandler = function () {
//when user types in search bar, get current resource array from localStorage and re-render a filtered array
  $('#search').on('input', function () {
    var resources = JSON.parse(localStorage.getItem("resources"));
    var searchString = $(this).val();
    if (searchString === "" || searchString === null) {
      renderResources(resources);
      return;
    }
    var filteredResources = resources.filter(function (resource) {
      return doesResourceContain(resource, searchString);
    });
    renderResources(filteredResources);
    noResultsDisplay(filteredResources.length);
  });
}

var noResultsDisplay = function (num) {
  if (num === 0) {
    $('#no-results').show();
  } else {
    $('#no-results').hide();
  }
}


