var categoriesArray = function () {
  var categoryObjects = $('.container').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category.name);
  }
  return categories;
}

var setAutocomplete = function () {
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

var createNewTagComponent = function (category) {
  var $tag = $(`<span class="tag">${category} <i class="glyphicon glyphicon-remove"></i></span>`);
  $('.tag-container').append($tag);
}

var deleteNewTagHandler = function () {
  $('.tag-container').on('click', '.glyphicon-remove', function () {
    $(this).closest('.tag').remove();
  })
}

var newTagFormHandler = function () {
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var category = $('#tag-search').val();
    createNewTagComponent(category);
    $('#tag-search').val('');
  })
}

var tagFormHandler = function () {
  var resource_id = $('.resource-container').data('resource-data').id;
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var category = $('#tag-search').val();
    if (doesCategoryExist(category)) {
      //get category id, send post request to resources_categories
      console.log(getCategoryID(category));
    } else {
      //add category to database and to categories array
      addNewCategory(resource_id, category);
      //add new category id to resources_categories
    }
  })
}

var doesCategoryExist = function (name) {
  if (categoriesArray().indexOf(name) >= 0) {
    return true;
  }
  return false;
}

var getCategoryID = function (name) {
  for (var category of categoriesObjectArray()) {
    if (category.name === name) {
      return category.id;
    }
  }
}

var addNewCategory = function (resource_id, name) {
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
        user_id: getUserID()
      }
      linkResourceToCategory(resource_id, category);
    }
  })
}

var linkResourceToCategory = function (resource_id, category) {
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
  var $tag = $(`<span class="tag">${category.name} </span>`);
  $tag.data('tag-data', category);
  if (size === "small") {
    $tag.addClass('tag-small');
  }
  if (category.user_id === getUserID() && editable) {
    $tag.append(`<i class="glyphicon glyphicon-remove"></i>`);
  }
  destination.append($tag);
}

var getTagsArray = function () {
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
  var categoryObjects = $('.container').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category);
  }
  return categories;
}
