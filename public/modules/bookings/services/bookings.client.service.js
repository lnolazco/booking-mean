'use strict';

//Bookings service used to communicate Bookings REST endpoints
angular.module('bookings').factory('Bookings', ['$resource',
	function($resource) {
		return $resource('bookings/:bookingId', { bookingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);