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

var tagFormHandler = function () {
  $('#tag-form').on('submit', function (event) {
    event.preventDefault();
    var category = $('#tag-search').val();
    createNewTagComponent(category);
    $('#tag-search').val('');
  })
}


var deleteTagHandler = function () {
  $('.tag-container').on('click', '.glyphicon-remove', function () {
    var $tag = $(this).closest('.tag');
    var resource_id = $('#url').data('id');
    console.log(resource_id);
    //delete request
    $.ajax({
      method: "DELETE",
      url: "/api/resources/" + resource_id + "/categories/" + $tag.data('tag-data').id,
      success: function (result) {
        console.log("browser things it works");
      }
    })
    //remove tag
  })
}

var createTagComponent = function (category) {
  var $tag = $(`<span class="tag">${category.name} </span>`);
  $tag.data('tag-data', category);
  if (category.user_id === getUserID()) {
    $tag.append(`<i class="glyphicon glyphicon-remove"></i>`);
  }
  $('.tag-container').append($tag);
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
  var categoryObjects = $('#new-resource').data('categories');
  var categories = [];
  for (var category of categoryObjects) {
    categories.push(category);
  }
  return categories;
}
