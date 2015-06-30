'use strict';

angular.module('bookings')
	.factory('OriginFactory', ['$resource',
		function($resource) {
			return $resource('origin', {}, {
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
	.factory('DestinationFactory', ['$resource',
	function($resource) {
		return $resource('destinations/:code', { }, {
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
	.service('DestinationService', ['OriginFactory', 'DestinationFactory',
	function(OriginFactory, DestinationFactory) {

		//return all the origins
		this.getOrigin = function(){
			return OriginFactory.query();
		};
		//return all the possible destinations of the origin (code) indicated
		this.getDestinations = function(code){
			return DestinationFactory.query({code: code});
		};
		// Public API
		return this;
	}
]);
