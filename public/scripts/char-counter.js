const maxChar = 255;

let charRemaining = maxChar;

function getRemChar(totChar) {
  return maxChar - totChar;
}

$(document).ready(() => {
  $('#new-resource').find('textarea').on('keyup keypress input', function(event) {
    //wrapping 'this' in jQuery syntax necessary to use functions
    charRemaining = getRemChar($(this).val().length);
    // 'this' uses jQuery to traverse up the DOM tree
    let counter = $(this).siblings('.counter');
    
    counter.text(charRemaining);

    if (charRemaining < 0) {
      counter.addClass('over-char-limit');
    } else {
      counter.removeClass('over-char-limit');
    }
  });
});
