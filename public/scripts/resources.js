var loadResources = function () {
  $.ajax({
    url: '/api/resources',
    method: 'GET',
    success: function (results) {
      console.log(results);
    }
  });
}



$(document).ready(function () {
  loadResources();
});
