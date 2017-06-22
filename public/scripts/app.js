$(document).ready(function() {
  $('#new-resource').on('submit', function(event) {
    event.preventDefault();

    console.log('Button clicked, performing ajax call ...', $(this).serialize());
    $.ajax({
      url: '/api/resources',
      method: 'POST',
      data: $(this).serialize(),
      success: function() {
        console.log('Success: ');
      }
    });
    $(this).find('textarea').val('');
    $(this).find('input').val('');
    $(this).find('.counter').html(255)
  });
});
