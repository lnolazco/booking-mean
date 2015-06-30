'use strict';

// Configuring the Articles module
angular.module('bookings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Bookings', 'bookings', 'dropdown', '/bookings(/create)?');
		Menus.addSubMenuItem('topbar', 'bookings', 'List Bookings', 'bookings');
		Menus.addSubMenuItem('topbar', 'bookings', 'New Booking', 'bookings/create');
	}
]);