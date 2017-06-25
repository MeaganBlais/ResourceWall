var newResourceFormHandler = function () {
    $('#new-resource').on('submit', function(event) {
    event.preventDefault();

    var tags = getTagsArray();
    //get data from the form
    $textarea = $(this).closest("form").find("textarea");
    $message = $(this).closest("form").find("#message");
    $counter = $(this).closest("form").find(".counter");

    var $data = {
      URL: $('#URL').val(),
      title: $('#title').val(),
      description: $('#description').val(),
      categories: tags
    }
    console.log($data);
    // console.log(encodeURIComponent(tags.join('+')));

    //get the text (without spaces) and its lenght to validate
    $text = $textarea.val().trim();
    $textLength = $text.length;


    if ($text === "" || $text === null) {

      //if text is null, show a message for empty text
      $message.text("Your description is empty!");
      $textarea.focus();

    } else if ($textLength > 255) {

      //if text exceed 255 characters, show a message for too long text
      $message.text("Your description is too long!");
      $textarea.focus();

    } else {

      // console.log('Button clicked, performing ajax call ...', $(this).serialize());
      $.ajax({
        url: '/api/resources',
        method: 'POST',
        data: $.param($data),
        success: function(results) {
          console.log('Success: ', results);
          $(location).attr('href','/resources/' + results);
        }
      });
      $(this).find('textarea').val('');
      $(this).find('input').val('');
      $(this).find('.counter').html(255)
    }
  });

}

$(document).ready(function () {
  newResourceFormHandler();
  setAutocomplete();
  newTagFormHandler();
  deleteNewTagHandler();
});
