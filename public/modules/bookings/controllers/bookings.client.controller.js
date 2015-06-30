'use strict';
// Bookings controller
angular.module('bookings').controller('BookingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bookings', '$filter', '$modal',
	function($scope, $stateParams, $location, Authentication, Bookings, $filter, $modal) {
		$scope.authentication = Authentication;

		//init variables
		$scope.countBookingsPastHour = 0;
		$scope.sumBookingPricesPastHour = 0;
		$scope.series = [];
		$scope.intervals = [{code:'h',name:'hour'},{code:'d',name:'day'},{code:'w',name:'week'}];
		$scope.bookings = [];

		// Create new Booking
		$scope.create = function () {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDialog.html',
				controller: 'Confirmation',
				size: 'sm'
			});
			modalInstance.result.then(function (comment) {
				var data = $scope.booking;

				// Create new Booking object
				var booking = new Bookings ({
					customer: {
						name: data.name,
						email: data.email
					},
					origin: data.origin.code,
					destination: data.destination.code,
					departureDate: data.depart,
					returnDate: data.return,
					flight: {
						number: data.flight.number,
						class: data.flight.class,
						price: data.flight.price
					}
				});

				// Redirect after save
				booking.$save(function(response) {

					$location.path('bookings/' + response._id);

					// Clear form fields
					//$scope.booking = null;
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			});
		};

		// Find a list of Bookings
		$scope.find = function() {
			$scope.bookings = Bookings.query();
		};

		// Find existing Booking
		$scope.findOne = function() {
			$scope.booking = Bookings.get({
				bookingId: $stateParams.bookingId
			});
		};

		// Get booking made in the past xxx
		var greaterThan = function(elem){
			return moment(elem.created) > moment().subtract(1,$scope.interval.code);
		};
		$scope.$watch("bookings", function (newValue) {
			if (newValue === undefined) return;

			$scope.updateResults();
		}, true);

		$scope.updateResults = function(){
			var lastHour = $filter ('filter')($scope.bookings, greaterThan ,true);
			if (lastHour.length>0){
				//count of all the bookings made in the past hour
				$scope.countBookingsPastHour = lastHour.length;
				//sum of the price
				var sum = 0;
				lastHour.forEach(function(entry){
					sum += entry.flight.price;
				});
				$scope.sumBookingPricesPastHour = sum;
				getD3data(lastHour);
			}
			else{
				$scope.countBookingsPastHour = 0;
				$scope.sumBookingPricesPastHour = 0;
				$scope.series = [];
			}
		};
		var filterD3data = function(value){
			return function(item){
				return item.flight.price === value;
			};
		};

		//d3js data
		var getD3data = function(data){
			var d3data = [];
			var distPrices = $filter('unique')(data,'flight.price');
			distPrices.forEach(function(dp){
				var found = $filter('filter')(data,filterD3data(dp.flight.price),true);
				d3data.push({x: dp.flight.price + ' €', y: found.length});
			});
			$scope.series = d3data;
		};

		var socket = io();
		socket.on('chat message', function(newBooking){
			$scope.bookings.push(newBooking);
			$scope.updateResults();
			$scope.$apply();
		});
	}
])
	.controller('Confirmation', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
		$scope.input = {};
		$scope.ok = function () {
			$modalInstance.close($scope.input.comment);
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
