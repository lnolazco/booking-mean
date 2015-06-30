'use strict';

//Setting up route
angular.module('bookings').config(['$stateProvider',
	function($stateProvider) {
		// Bookings state routing
		$stateProvider.
		state('listBookings', {
			url: '/bookings',
			templateUrl: 'modules/bookings/views/list-bookings.client.view.html'
		}).
		state('createBooking', {
			url: '/bookings/create',
			templateUrl: 'modules/bookings/views/create-booking.client.view.html'
		}).
		state('viewBooking', {
			url: '/bookings/:bookingId',
			templateUrl: 'modules/bookings/views/view-booking.client.view.html'
		}).
		state('editBooking', {
			url: '/bookings/:bookingId/edit',
			templateUrl: 'modules/bookings/views/edit-booking.client.view.html'
		});
	}
]);