'use strict';

/* Services */
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
		}
		
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
