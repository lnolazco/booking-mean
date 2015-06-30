'use strict';

(function() {
	// Bookings Controller Spec
	describe('Bookings Controller Tests', function() {
		// Initialize global variables
		var BookingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Bookings controller.
			BookingsController = $controller('BookingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Booking object fetched from XHR', inject(function(Bookings) {
			// Create sample Booking using the Bookings service
			var sampleBooking = new Bookings({
				name: 'New Booking'
			});

			// Create a sample Bookings array that includes the new Booking
			var sampleBookings = [sampleBooking];

			// Set GET response
			$httpBackend.expectGET('bookings').respond(sampleBookings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bookings).toEqualData(sampleBookings);
		}));

		it('$scope.findOne() should create an array with one Booking object fetched from XHR using a bookingId URL parameter', inject(function(Bookings) {
			// Define a sample Booking object
			var sampleBooking = new Bookings({
				name: 'New Booking'
			});

			// Set the URL parameter
			$stateParams.bookingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/bookings\/([0-9a-fA-F]{24})$/).respond(sampleBooking);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.booking).toEqualData(sampleBooking);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Bookings) {
			// Create a sample Booking object
			var sampleBookingPostData = new Bookings({
				name: 'New Booking'
			});

			// Create a sample Booking response
			var sampleBookingResponse = new Bookings({
				_id: '525cf20451979dea2c000001',
				name: 'New Booking'
			});

			// Fixture mock form input values
			scope.name = 'New Booking';

			// Set POST response
			$httpBackend.expectPOST('bookings', sampleBookingPostData).respond(sampleBookingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Booking was created
			expect($location.path()).toBe('/bookings/' + sampleBookingResponse._id);
		}));

		it('$scope.update() should update a valid Booking', inject(function(Bookings) {
			// Define a sample Booking put data
			var sampleBookingPutData = new Bookings({
				_id: '525cf20451979dea2c000001',
				name: 'New Booking'
			});

			// Mock Booking in scope
			scope.booking = sampleBookingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/bookings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/bookings/' + sampleBookingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid bookingId and remove the Booking from the scope', inject(function(Bookings) {
			// Create new Booking object
			var sampleBooking = new Bookings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Bookings array and include the Booking
			scope.bookings = [sampleBooking];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/bookings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBooking);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.bookings.length).toBe(0);
		}));
	});
}());