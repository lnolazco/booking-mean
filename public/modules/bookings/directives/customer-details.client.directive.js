'use strict';

angular.module('bookings').directive('customerDetails', [
	function() {
		return {
			templateUrl: 'modules/bookings/directives/templates/customer-details.html',
			restrict: 'EA',
			scope:{
				customerName:'=',
				customerEmail:'='
			}
		};
	}
]);
