'use strict';

angular.module('dju').factory('Dju', [ '$resource', function($resource) {
		return $resource('djus/:djuId',
			{
				djuId: '@_id'
			},
			{
				udpate: {
					methode: 'PUT'
				}
			});
	}
]);
