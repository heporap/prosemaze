'use strict';

/* Filters */

angular.module('psMaze.filters', [])
	.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
	
	.filter('toBeContinued', function($routeParams) {
  	return function(input) {
			return input===true ? "#/"+(1+Number($routeParams.pageNumber)) : input || "";
  	};
	});
