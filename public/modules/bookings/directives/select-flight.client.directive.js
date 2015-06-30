'use strict';

angular.module('bookings').directive('selectFlight', [
	function() {
		return {
			templateUrl: 'modules/bookings/directives/templates/select-flight.html',
			restrict: 'EA',
			scope:{
				origin:'=',
				destination:'=',
				depart:'=',
				return:'=',
				flight:'='
			},
			link: function postLink(scope, element, attrs) {
				// Select flight directive logic
				// ...

				//element.text('this is the selectFlight directive');
			},
			controller:['$scope', 'FlightService', '$filter', function ($scope, FlightService, $filter){

				$scope.flights = [];
				$scope.flight = null;

				$scope.noData = false;
				$scope.table = false;
				$scope.flightSelected = false;

				//get flights
				$scope.getFlights = function(){
					if ($scope.origin === undefined || $scope.origin.code === undefined
					|| $scope.destination === undefined || $scope.destination.code === undefined
					|| $scope.depart === undefined || $scope.return === undefined) return;

					FlightService.getFlights($scope.origin.code,
											$scope.destination.code,
											$scope.depart,
											$scope.return).$promise.then(function(data){
						$scope.noData = data.length === 0;
						$scope.table = data.length > 0;
						$scope.flightSelected = false;
						$scope.allFlights = data;
						$scope.flights = data;
					});

				};
				//watch values
				$scope.$watch("origin", function (newValue) {
					$scope.noData = $scope.table = $scope.flightSelected = false;
					if (newValue === undefined) return;
					$scope.getFlights();
				}, true);
				$scope.$watch("destination", function (newValue) {
					$scope.noData = $scope.table = $scope.flightSelected = false;
					if (newValue === undefined) return;
					$scope.getFlights();
				}, true);
				$scope.$watch("depart", function (newValue) {
					$scope.noData = $scope.table = $scope.flightSelected = false;
					if (newValue === undefined) return;
					$scope.getFlights();
				}, true);
				$scope.$watch("return", function (newValue) {
					$scope.noData = $scope.table = $scope.flightSelected = false;
					if (newValue === undefined) return;
					$scope.getFlights();
				}, true);


				$scope.selectFlight = function(id){
					var found = $filter ('filter')($scope.flights,{_id:id},true);
					if (found){
						$scope.noData = $scope.table = false;
						$scope.flightSelected = true;
						$scope.flight = found[0];
					}
				};

				$scope.deleteFlight = function(){
					$scope.noData = $scope.flightSelected = false;
					$scope.table = true;
					$scope.flight = null;
				};

			}]
		};
	}
]);
