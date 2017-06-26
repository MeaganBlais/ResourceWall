var newResourceFormHandler = function () {
  //activated on new resource form submission
    $('#new-resource').on('submit', function(event) {
    event.preventDefault();
    var validations = true;
    var message = '';
    var tags = getTagsArray();
    $counter = $(this).closest("form").find(".counter");
    //check if all required fields are filled in
    if (emptyFiled($('#title').val()) || emptyFiled ($('#URL').val()) || emptyFiled($('#description').val())) {
      validations = false;
      message += "All (*) fields are required. ";
    }
    //check length of description
    if ($('#description').val().trim().length > 255) {
      validations = false;
      message += "Your description is too long! "
    }
    //display appropriate message (or blank if new errors)
    $('#message').text(message);
    //prepare data for submission, encluding tags
    var $data = {
      URL: $('#URL').val(),
      title: $('#title').val(),
      description: $('#description').val(),
      categories: tags
    }
    //send the post request if no errors, redirect to the details page for added ersource
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
