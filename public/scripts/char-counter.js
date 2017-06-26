const maxChar = 255;

let charRemaining = maxChar;

function getRemChar(totChar) {
  return maxChar - totChar;
}

$(document).ready(() => {

  $('#new-resource').find('textarea').on('keyup keypress input', function(event) {

    //Getting "this" to pass as parameter
    var element = $(this);

    //Calling a function to check the counter, given "this" as parameter
    checkCounter(element);

  });


  $('#new-comment').find('textarea').on('keyup keypress input', function(event) {

    //Getting "this" to pass as parameter
    var element = $(this);

    //Calling a function to check the counter, given "this" as parameter
    checkCounter(element);

  });

  // $('#new-resource').find('textarea').on('keyup keypress input', function(event) {
  // });


  function checkCounter (element) {

    //wrapping 'this' in jQuery syntax necessary to use functions
    charRemaining = getRemChar(element.val().length);

    // 'this' uses jQuery to traverse up the DOM tree
    let counter = element.closest('form').find('.counter span'); //CHANGE THIS

    counter.text(charRemaining);

    if (charRemaining < 0) {
      counter.addClass('over-char-limit');
    } else {
      counter.removeClass('over-char-limit');
    }

  }

});
