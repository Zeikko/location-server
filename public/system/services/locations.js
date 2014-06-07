'use strict';

angular.module('mean').factory('Locations', ['$resource',
	function($resource) {
		return $resource('locations', {
		});
	}
]);