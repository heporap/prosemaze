/* Directives */
angular.module('psMaze.directives', []).
  directive('appVersion', ['version', function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
  }])

  .directive('onloadimage', function() {
		return function(scope, elm, attrs) {
				elm.bind('load error', function(event) {
					scope.onloadImage(attrs.ngSrc);
				});
		};
  });
