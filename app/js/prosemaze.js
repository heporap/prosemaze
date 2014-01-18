/****
 * Prosemaze
 * (c) Wicker Wings, 2014-2014 http://www.wi-wi.jp/
 * License: MIT
 ****/
jQuery(".stage p").on("selectstart", function(event){
	event.prepentDefault();
}).on("mousedown", function(event){
	event.preventDefault();
});
jQuery(window).on('load', function(){
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
;/* Controllers */
var psMazeControllers = angular.module('psMaze.controllers', []);

/****
* 
****/
psMazeControllers.controller('psMazeConfigCtrl', ['$scope', '$routeParams', 'psMazeFactory', 'psMazeXHR',
  function($scope, $routeParams, psMazeFactory, psMazeXHR) {
		psMazeFactory.configured = -1;
		$scope.http = psMazeXHR.get({pageNumber: "config", cache: ''+(new Date()).getTime()});
		$scope.http.$promise.then(function(response){
			
			$routeParams.pageNumber = psMazeFactory.curPage = $routeParams.pageNumber || 0;
			
			psMazeFactory.title = $scope.title = response.title;
			psMazeFactory.width = $scope.width = response.width;
			psMazeFactory.height = $scope.height = response.height;
			
			psMazeFactory.pages = Number(response.pages);
			psMazeFactory.navTitle = !!response.navTitle;
			psMazeFactory.navPage = !!psMazeFactory.pages;
			
			psMazeFactory.cache = response.cache;
			psMazeFactory.curPage = $routeParams.pageNumber;
			
			psMazeFactory.configured = 1;
			
			psMazeFactory.loadPage();
			
		});//get
		
		$scope.changePage = function(pg){
			location.hash = "#/"+pg;
		};
		
		$scope.apply = function(){
			this.$apply();
		};
		
}]);

/****
* 
****/
psMazeControllers.controller('psMazeNavCtrl', ['$scope', 'psMazeFactory', 
  function($scope, psMazeFactory) {
		$scope.title = psMazeFactory.title;
		$scope.pages = psMazeFactory.pages;
		
		psMazeFactory.controllers.push($scope);
		
		$scope.apply = function(){
			$scope.navTitle = psMazeFactory.navTitle;
			$scope.pageNumber = psMazeFactory.curPage;
			
			var pgs = psMazeFactory.pages;
			if( !pgs ){
				$scope.pages=[];
			}else{
				$scope.pages = [];
				for( var i = 0, len=pgs; i<len ; i++ ){
					$scope.pages[i] = i+1;
				}
			}
			
		};
		
		$scope.changePage = function(pg){
			$scope.pageNumber = pg;
			location.hash ="#/"+pg;
		};
		
}]);

/****
* 
****/
psMazeControllers.controller('psMazePageCtrl', ['$scope', '$routeParams', '$timeout', 'psMazeFactory', 'psMazeXHR',
  function($scope, $routeParams, $timeout,　psMazeFactory, psMazeXHR) {
		$routeParams.pageNumber = psMazeFactory.curPage = $routeParams.pageNumber || 0;
		
		$scope.talking = true;
		$scope.lines = [];
		$scope.imageLoaded = {};
		$scope.allimageloaded = false;
		
		$scope.loadPage = function(){
			var queryStr = psMazeFactory.cache ? '': ''+(new Date()).getTime();
			
			$scope.script = psMazeXHR.get({pageNumber: $routeParams.pageNumber, cache: queryStr});
			$scope.script.$promise.then( function(page) {
				$scope.width = psMazeFactory.width;
				$scope.heiht = psMazeFactory.height;
				
				page.scene = 'scenario/scene/' + page.scene;
				
				psMazeFactory.next = page.next || false;
				psMazeFactory.setLines( page.lines );
				psMazeFactory.setSelection( page.select );
				
				psMazeFactory.onPageChange($routeParams.pageNumber);
				
				$scope.imageLoaded[page.scene] = false;
				
				for(var i = 0, chara; i< page.charas.length; i++ ){
					chara = page.charas[i];
					chara.url = 'scenario/chara/'+chara.url;
					chara.cssShow = false;
					toShowArray(chara, 99999);
					$scope.imageLoaded[chara.url] = false;
				}
				
				page.lines = ['','',''];
				
				return page;
			});//get
		};
		
		if( psMazeFactory.configured !== 1 ){
			psMazeFactory.loadPage( $scope );
		}else{
			$scope.loadPage();
		}
		
		$scope.onloadImage = function(img){
			var loadedAll = true;
			$scope.imageLoaded[img] = true;
			angular.forEach( $scope.imageLoaded, function(value, key){
				if( loadedAll ){
					loadedAll = value;
				}
			});
			if( loadedAll ){
				$scope.allimageloaded = true;
				$scope.$apply();
				$scope.talking = false;
				$timeout( $scope.talk, 1100);
			}
		};
		
		$scope.sellectCommand = function(index, $event){
			$event.stopPropagation();
			
			if( $scope.talking ){
				$scope.skip();
				return false;
			}
			
			if( !$scope.talk() ){
				psMazeFactory.jumpToPage(null, index);
				
			}
			return false;
		};
		
		$scope.nextPage = function($event){
			$scope.sellectCommand(undefined, $event);
		};
		
		$scope.lines = [];
		$scope.curLine = 0;
		$scope.runTalk = function(){
			var delay = 1000/15; // talk speed
			var lines = $scope.lines,
					cur = $scope.curLine;
					
			// EOL
			if( !lines[cur] || !lines[cur].length ){
				
				for(var i=$scope.curLine+1, len=0; i<lines.length; i++){
					len += lines[i].length;
					if( len ){
						cur = $scope.curLine = i;
						break;
					}
				}
				
				if( !len ){
					$scope.talking = false;
					return false;
				}
			}
			
			cur = $scope.curLine;
			var c = $scope.lines[cur].substring(0,1);
			$scope.lines[cur] = $scope.lines[cur].substring(1);
			$scope.script.lines[cur] += c;
			
			if( !lines[cur].length ){
				delay = 500;
			}
			
			$timeout( $scope.runTalk, delay );
			
		};
		$scope.talk = function(){
			if( $scope.talking ){
				return -1;
			}
			
			var talkContinued = psMazeFactory.getLines($scope) || psMazeFactory.getSelection($scope);
			
			if( !talkContinued ){
				return false;
			}
			
			var curLine = psMazeFactory.curLine;
			for(var i = 0, show, cur, charas=$scope.script.charas; i<charas.length; i++ ){
				show = charas[i].show;
				cur = curLine/3-1;
				for(var k = 0; k < show.length; k+=2 ){
					charas[i].cssShow = (show[k] <= cur && cur < show[k+1] );
					if( charas[i].cssShow ){
						break;
					}
				}
			}
			
			$scope.talking = true;
			$scope.curLine = 0;
			$scope.script.lines = [];
			for(i=0; i<$scope.lines.length; $scope.script.lines[i++] = '' );
			$scope.runTalk();
			
			return true;
		};
		
		$scope.skip = function(){
			for( var i = 0; i< this.lines.length; i++ ){
				this.script.lines[i] += this.lines[i];
				this.lines[i] = '';
			}
			this.talking = false;
		};
		
		function toShowArray(img, max){
			if( img.show ){
				if( typeof(img.show)==="number" || typeof(img.show)==="string" ){
						img.show = [img.show, 99999];
					}else if( img.show.length % 2 ){
						img.show.push(99999);
					}
				}else{
					img.show = [0, 99999];
				}
		}
		
}]);
;/* Directives */
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
;/* Services */
var psMazeServices = angular.module('psMaze.services', ['ngResource']);

psMazeServices.value('version', '0.1');


psMazeServices.factory('psMazeXHR', ['$resource', 
	function($resource){
		return $resource('scenario/data/:pageNumber.json', {}, {
			query: {
				method: 'GET',
				params: {
					stageID: "stageID",
					pageNumber: "pageNumber"
				},
				isArray: true
			}
		});
	}
]);

/****
* 
****/
psMazeServices.factory('psMazeFactory', 
  function(){
		var appFactory = {
			configured : 0,
			width : '',
			height : '',
			title : '',
			navTitle : false,
			navPage : false,
			pages : 0,
			curPage: 0,
			lines : [],
			curLine: 0,
			dialog: [],
			dialogShown: false,
			cache: true,
			controllers: []
		};
		
		appFactory.apply = function(){
			for(var i=0; i<this.controllers.length; i++ ){
				this.controllers[i].apply();
			}
			return this;
		};
		
		appFactory.loadPage = function( scope ){
			if( scope ){
				this.loadWaiting = scope;
			}else if( this.loadWaiting ){
				this.loadWaiting.loadPage();
				this.loadWaiting = null;
			}
			return this;
		};
		
		appFactory.setCtrlScope = function(scope){
			this.controllers.push(scope);
			return this;
		};
		
		appFactory.setLines = function(lines){
			this.curLine = 0;
			this.lines.length = lines.length;
			this.lines = lines;
			return this;
		};
		
		appFactory.getLines = function(scope){
			if( this.lines.length <= this.curLine ){
				return false;
			}
			scope.lines = this.lines.slice(this.curLine, this.curLine+3);
			this.curLine+=3;
			
			scope.dialogMode = "general";
			
			return !!scope.lines.length;
			
		};
		
		appFactory.restartLines = function(){
			this.curLine = 0;
			this.dialogShown = false;
		};
		
		appFactory.setSelection = function(diag){
			if( !diag ){
				this.dialog = [];
				this.dialogShown = true;
				return;
			}
			if( diag.length %2 === 0 ){
				throw new Error('Usage: ["question", "answer", "url" [, "answer", "url"]...]');
			}
			this.dialog.length = diag.length;
			this.dialog = diag;
			this.next = !!diag.length;
			this.dialogShown = !this.dialog.length;
			return this;
		};
		
		appFactory.getSelection = function(scope){
			if( this.dialogShown ){
				return false;
			}
			this.dialogShown = true;
			
			// question
			scope.lines = this.dialog.slice(0, 1);
			for( var i=1, k=1; i<this.dialog.length; k++,i+=2 ){
				scope.lines[k] = this.dialog[i];
			}
			scope.dialogMode = "selection";
			
			return !!scope.lines.length;
			
		};
		
		appFactory.jumpToPage = function(jumpTo, index){
			var hash = "#/";
			
			if( this.dialog.length ){
				index = (index||0)*2;
				if( !index || this.dialog.length <= index || this.dialog[ index ] === "" ){
					return false;
				}
				var n = this.dialog[ index ];
				if( isNaN(n) ){
					window.top.location.href = n;
				}else{
					hash += n;
				}
				
			}else if( jumpTo !== null && jumpTo !== undefined ){
				window.top.location.href = jumpTo;
				return false;
				
			}else if( this.next === true ){
				hash = hash+(this.curPage+1);
				
			}else if( this.next ){
				window.top.location.href = this.next;
				
			}
			
			location.hash = hash;
			
		};
		
		appFactory.onPageChange = function(pg){
			this.curPage = +pg;
			this.apply();
			
		};
		
		appFactory.pageChange = function(number, next){
			var hash = next===true ? "#/"+(1+Number(number)) : next || "";
			location.hash = hash;
			
		};
		
		return appFactory;
  }
);
;/* Filters */

angular.module('psMaze.filters', [])
  .filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  
  .filter('toBeContinued', function($routeParams) {
    return function(input) {
      return input===true ? "#/"+(1+Number($routeParams.pageNumber)) : input || "";
    };
  });
;/* Services */
var psMazeAnimations = angular.module('psMaze.animations', ['ngAnimate']);

/****

****/
psMazeAnimations.animation('.field .chara', 
  function() {
		return {
			addClass : function(element, className, done) {
				if(className != 'active') {
					return;
				}
				
				return function(cancel) {
					if(cancel) element.stop();
				};
			},
			removeClass : function(element, className, done) {
				if(className != 'active'){
					return;
				}
				
				return function(cancel) {
					if(cancel) element.stop();
				};
			}
		};
});
