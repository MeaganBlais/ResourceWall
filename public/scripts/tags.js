var categoriesArray = function () {
  //return an array of category names that are currently in the database
  var categoryObjects = $('.container').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category.name);
  }
  return categories;
}

var setAutocomplete = function () {
  //using twitter typeahead library to autocomplete tag suggestions
  // Defining the local dataset
  var categories = categoriesArray();
  // Constructing the suggestion engine
  var categories = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: categories
  });
  // Initializing the typeahead
  $('#tag-search').typeahead({
      hint: true,
      highlight: true, /* Enable substring highlighting */
      minLength: 1 /* Specify minimum characters required for showing suggestions */
  },
  {
      name: 'categories',
      source: categories
  });
}


var deleteNewTagHandler = function () {
  //deletes a newly added tag (not yet in database)
  $('.tag-container').on('click', '.glyphicon-remove', function () {
    $(this).closest('.tag').remove();
  })
}

var newTagFormHandler = function () {
  //handles submissions for tag form on new resource page
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var category = $('#tag-search').val();
    createTagComponent({name: category, user_id: getUserID()}, $('.tag-container'), "large", true);
    $('#tag-search').val('');
  })
}

var tagFormHandler = function () {
  //handles submissions for tag form on resource details page
  var resource_id = $('.resource-container').data('resource-data').id;
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var name = $('#tag-search').val();
    if (doesCategoryExist(name)) {
      //get category id, send post request to resources_categories
      var category = getCategoryObject(name);
      category.user_id = getUserID();
      linkResourceToCategory(resource_id, category);
    } else {
      //add category to database and to categories array
      addNewCategory(resource_id, name);
      //add new category id to resources_categories
    }
  })
}

var doesCategoryExist = function (name) {
  //checks if a category name is already saved in the database using array stored on client
  if (categoriesArray().indexOf(name) >= 0) {
    return true;
  }
  return false;
}

var getCategoryID = function (name) {
  //returns the category id for a given category name
  for (var category of categoriesObjectArray()) {
    if (category.name === name) {
      return category.id;
    }
  }
}

var addNewCategory = function (resource_id, name, userID) {
  //adds a brand new category name to the database and returns the result with category id
  var $data = {
    "name": name
  };
  $.ajax({
    url: '/api/categories',
    method: 'POST',
    data: $.param($data),
    success: function (response) {
      var category = {
        'name': response.name,
        id: response.id,
        user_id: userID
    }
      linkResourceToCategory(resource_id, category);
    }
  })
}

var linkResourceToCategory = function (resource_id, category) {
  //connects the resource, user and category ID in the resources_categories table
  var $data = {
    "category_id": category.id
  };
  $.ajax({
    url: '/api/resources/' + resource_id + '/categories',
    method: 'POST',
    data: $data,
    success: function (response) {
      createTagComponent(category, $('.tag-container'), "large", true);
      $('#tag-search').val('');
    }

  })
}

var deleteTagHandler = function () {
  //when X is clicked, deletes the entry from resources_categories table
  $('.tag-container').on('click', '.glyphicon-remove', function () {
    var $tag = $(this).closest('.tag');
    var resource_id = $('#url').data('id');
    //delete request
    $.ajax({
      method: "DELETE",
      url: "/api/resources/" + resource_id + "/categories/" + $tag.data('tag-data').id,
      success: function (result) {
        $tag.remove();
      }
    })
  })
}

var createTagComponent = function (category, destination, size, editable) {
  //creates a new tag component, with a few options, and renders to the destination
  var $tag = $(`<span class="tag">${category.name} </span>`);
  $tag.data('tag-data', category);
  if (size === "small") {
    $tag.addClass('tag-small');
  }
  if ((category.user_id === getUserID()) && editable) {
    $tag.append(`<i class="glyphicon glyphicon-remove"></i>`);
  }
  destination.append($tag);
}

var getTagsArray = function () {
  //get an array of all tags on the New Resource page, separating in to new and old
    //new tags will be added to categories table before resources_categories table (handled on server)
  var tags = {
    new: [],
    old: []
  }
  var categories = categoriesObjectArray();
  $.each($('.tag'), function (i, tag) {
    var tagName = $(tag).text().trim();
    for (var category of categories) {
      if (category.name === tagName) {
        tags.old.push(category.id);
        return;
      }
    }
    tags.new.push(tagName);
  });
  console.log(tags);
  return tags;
}

var categoriesObjectArray = function () {
  //returns an array of category objects for all categories currently in database (stored in browser via data attribute)
  var categoryObjects = $('.container').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category);
  }
  return categories;
}

var getCategoryObject = function (name) {
  //returns object with name and ID for a given category name that exists in the database
  for (var category of categoriesObjectArray()) {
    if (category.name === name) {
      return category;
    }
  }
}
