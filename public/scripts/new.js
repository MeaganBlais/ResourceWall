var newResourceFormHandler = function () {
    $('#new-resource').on('submit', function(event) {
    event.preventDefault();
    var validations = true;
    var message = '';

    var tags = getTagsArray();
    $counter = $(this).closest("form").find(".counter");


    if (emptyFiled($('#title').val()) || emptyFiled ($('#URL').val()) || emptyFiled($('#description').val())) {
      validations = false;
      message += "All (*) fields are required. ";
    }

    if ($('#description').val().trim().length > 255) {
      validations = false;
      message += "Your description is too long! "
    }

    $('#message').text(message);

    var $data = {
      URL: $('#URL').val(),
      title: $('#title').val(),
      description: $('#description').val(),
      categories: tags
    }

    if (validations) {
      $.ajax({
        url: '/api/resources',
        method: 'POST',
        data: $.param($data),
        success: function(results) {
          console.log('Success: ', results);
          $(location).attr('href','/resources/' + results);
        }
      });

    }
    });
};



$(document).ready(function () {
  newResourceFormHandler();
  setAutocomplete();
  newTagFormHandler();
  deleteNewTagHandler();
});
