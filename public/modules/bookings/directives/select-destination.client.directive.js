'use strict';

angular.module('bookings').directive('selectDestination', [
	function() {
		return {
			templateUrl: 'modules/bookings/directives/templates/select-destination.html',
			restrict: 'EA',
			scope:{
				origin:'=',
				destination:'='
			},
			controller: ['$scope','DestinationService', function($scope, DestinationService){
				//fill select element with origins
				DestinationService.getOrigin().$promise.then(function(data){
					$scope.origins = data;
				});
				//fill destinations when a origin is selected
				$scope.destinations = [];
				$scope.getDestinations = function (selected){
					if (selected === undefined) return;
					$scope.origin = selected.originalObject;
					DestinationService.getDestinations($scope.origin.code).$promise.then(function(data){
						$scope.destinations = data;
					});
				};
				$scope.setDestination = function(selected){
					if (selected === undefined) return;
					$scope.destination = selected.originalObject;
				};

			}]
		};
	}
]);
