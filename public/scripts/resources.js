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
  var $resource = $('<article>').addClass('resource-container');

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
      <span class="stars">
        <i class="glyphicon glyphicon-star"></i>
        <i class="glyphicon glyphicon-star"></i>
        <i class="glyphicon glyphicon-star"></i>
        <i class="glyphicon glyphicon-star"></i>
        <i class="glyphicon glyphicon-star"></i>
      </span>
      <span class="heart-comments">
        <span class="likes"><i class="glyphicon glyphicon-heart"></i> 4</span>
        <span class="comments"><i class="glyphicon glyphicon-comment"></i> 2</span>
      </span>
    </span>
  `);

  $resource.append(resourceHeader);
  $resource.append(resourceBody);
  $resource.append(resourceFooter);

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
