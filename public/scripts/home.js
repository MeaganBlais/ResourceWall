$(document).ready(function () {
  loadResources();
  renderResources(JSON.parse(localStorage.getItem('resources')));
  searchBarHandler();
});