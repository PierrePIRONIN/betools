'use strict';

//Setting up route
angular.module('dju').config(['$stateProvider',
	function($stateProvider) {
		// Dju state routing
		$stateProvider.
		state('referential-dju', {
			url: '/dju-ref',
			templateUrl: 'modules/dju/views/referential-dju.client.view.html'
		}).
		state('compute-dju', {
			url: '/dju',
			templateUrl: 'modules/dju/views/compute-dju.client.view.html'
		});
	}
]);