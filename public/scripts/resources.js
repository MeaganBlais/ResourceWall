var loadResources = function () {
  $.ajax({
    url: '/api/resources',
    method: 'GET',
    success: function (results) {
      renderResources(results);
      localStorage.setItem("resources", JSON.stringify(results));
    }
  });
}

var createResourceElement = function (resource) {
  var $resource = $(`<article id='resource-${resource.resource_id}'>`).addClass('resource-container');

  var user = JSON.parse(localStorage.getItem("userInfo"))
  var user_id = user.id;

  $resource.data('resource-data', resource);

  //header
  var resourceHeader = $("<header>").append(`
    <h1>${resource.title}</h1>
  `);

  //body
  var resourceBody = $("<section>").append(`
    <p>${resource.description}</p>
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
        <span class="likes"><i class="glyphicon glyphicon-heart"></i><span id="totalOfLikes"></span>4</span>
        <span class="comments"><i class="glyphicon glyphicon-comment"></i> 2</span>
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
  $resource.find(".rateYo").rateYo("option", "ratedFill", "#E74C3C"); // Color of the rated stars
  $resource.find(".rateYo").rateYo("option", "fullStar", true); // Setting ratings as full star

  //Set the average of ratings
  $resource.find(".avg_rating").text(setAvgRating(resource));

  // Getting the rating selected by the user
  $resource.find(".rateYo").rateYo("option", "onSet", function () {

    //Get the rating clicked
    var new_rating = $resource.find(".rateYo").rateYo("rating");

    //Call a function to anlyse the user action
    var rating = analyseRating(resource, new_rating, this);

  });

  return $resource;
}

var clearResources = function () {
  $('#all-resources').empty();
}

var renderResources = function (resources) {
  clearResources();
  for (var resource of resources) {
    $('#all-resources').append(createResourceElement(resource));
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

$(document).ready(function () {
  loadResources();
  searchBarHandler();


});
