'use strict';

angular.module('bookings')
	.factory('FlightFactory', ['$resource',
		function($resource) {
			return $resource('flights/:origin/:destination/:departDate/:returnDate', { }, {
				update: {
					method: 'PUT'
				},
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	])
	.service('FlightService', ['FlightFactory',
		function(FlightFactory) {
			//return all the possible destinations of the origin (code) indicated
			this.getFlights = function(origin, destination, departDate, returnDate){
				return FlightFactory.query({origin: origin, destination: destination,
					departDate: departDate.format('YYYY-MM-DD'),
					returnDate: returnDate.format('YYYY-MM-DD')});
			};
			// Public API
			return this;
		}
	]);
