/****
 * Prosemaze
 * (c) Wicker Wings, 2014 http://www.wi-wi.jp/
 * License: MIT
 ****/
'use strict';

/* Services */

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
