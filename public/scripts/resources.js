var loadResources = function (callback) {
  $.ajax({
    url: '/api/resources',
    method: 'GET',
    cache: false,
    success: function (results) {
      callback(results);
      localStorage.setItem("resources", JSON.stringify(results));
    }
  });
}

var createResourceElement = function (resource) {
  var $container = $(`<div class="grid-item"></div>`);
  var $resource = $(`<article id='resource-${resource.resource_id}'>`).addClass('resource-container');
  $container.addClass('col-xs-12 col-md-4');
  var $left = $(`<div class="resource-left"></div>`);
  var $right = $(`
      <a href="/resources/${resource.resource_id}">
        <div class="resource-right">
          <i class="glyphicon glyphicon-menu-right"></i>
        </div>
      </a>
  `);
  var user_id = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).id : '';

  $resource.data('resource-data', resource);

  //header
  var resourceHeader = $("<header>").append(`
    <h4><a href="${resource.URL}"></a></h1>
  `);
  resourceHeader.find('a').text(resource.title);

  //body
  var resourceBody = $("<section>").append(`
    <p></p>
  `);
  resourceBody.find('p').text(trimDescription(resource.description));

  //footer
  var resourceFooter = $("<footer>").append(`
    <div class="footer-top">
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
    </div>
  `);

  var numCategories = resource.categories.length;
  if (numCategories > 0) {
    resourceFooter.append(`<div class="small-tag-container"></div>`);
    var trimmedCategories = resource.categories.slice(0, 8);
    if (numCategories > 9) {
      trimmedCategories.push({user_id: '', name: '+' + String(numCategories - 9)})
    }
    for (category of trimmedCategories) {
      createTagComponent(category, resourceFooter.find('.small-tag-container'), "small")
    }
  }

  $left.append(resourceHeader);
  $left.append(resourceBody);
  $left.append(resourceFooter);
  $resource.append($left);
  $resource.append($right);
  $container.append($resource);

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

  return $container;
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
  // var resources = JSON.parse(localStorage.getItem('resources'));
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
  // var resources = JSON.parse(localStorage.getItem('resources'));
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

var renderMyResourcePage = function (resources) {
  renderMyResources(resources);
  renderLikedResources(resources);
}

var doesResourceContain = function (resource, str) {
//check if a resource contains the search string in either the title or description
  //check title
  if (resource.title.toLowerCase().includes(str)) {
    return true;
  }
  //check description
  if (resource.description.toLowerCase().includes(str)) {
    return true;
  }
  for (var category of resource.categories) {
    if (category.name.toLowerCase().includes(str)) {
      return true;
    }
  }
  return false;
}


var searchBarHandler = function () {
//when user types in search bar, get current resource array from localStorage and re-render a filtered array
  $('#search').on('input', function () {
    var resources = JSON.parse(localStorage.getItem("resources"));
    var searchString = $(this).val().toLowerCase();
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

var trimDescription = function (description) {
  var max = 77;
  if (description.length > max) {
    return description.slice(0, max - 3) + '...';
  }
  return description;
}
