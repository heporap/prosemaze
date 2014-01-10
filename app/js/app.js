'use strict';

$(".stage p").on("selectstart", function(event){
	event.prepentDefault();
}).on("mousedown", function(event){
	event.preventDefault();
});
$(window).on('load', function(){
	setTimeout( function(){scrollTo(0,0);}, 100);
});
// Declare app level module which depends on filters, and services
var psMaze = angular.module('psMaze', [
  'ngRoute',
  'psMaze.filters',
  'psMaze.services',
  'psMaze.directives',
  'psMaze.animations',
  'psMaze.controllers'
]);

psMaze.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/story.html',
        controller: 'psMazePageCtrl'
      }).
      when('/:pageNumber', {
        templateUrl: 'partials/story.html',
        controller: 'psMazePageCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
