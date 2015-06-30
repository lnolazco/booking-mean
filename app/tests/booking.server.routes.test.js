'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Booking = mongoose.model('Booking'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, booking;

/**
 * Booking routes tests
 */
describe('Booking CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Booking
		user.save(function() {
			booking = {
				name: 'Booking Name'
			};

			done();
		});
	});

	it('should be able to save Booking instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Booking
				agent.post('/bookings')
					.send(booking)
					.expect(200)
					.end(function(bookingSaveErr, bookingSaveRes) {
						// Handle Booking save error
						if (bookingSaveErr) done(bookingSaveErr);

						// Get a list of Bookings
						agent.get('/bookings')
							.end(function(bookingsGetErr, bookingsGetRes) {
								// Handle Booking save error
								if (bookingsGetErr) done(bookingsGetErr);

								// Get Bookings list
								var bookings = bookingsGetRes.body;

								// Set assertions
								(bookings[0].user._id).should.equal(userId);
								(bookings[0].name).should.match('Booking Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Booking instance if not logged in', function(done) {
		agent.post('/bookings')
			.send(booking)
			.expect(401)
			.end(function(bookingSaveErr, bookingSaveRes) {
				// Call the assertion callback
				done(bookingSaveErr);
			});
	});

	it('should not be able to save Booking instance if no name is provided', function(done) {
		// Invalidate name field
		booking.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Booking
				agent.post('/bookings')
					.send(booking)
					.expect(400)
					.end(function(bookingSaveErr, bookingSaveRes) {
						// Set message assertion
						(bookingSaveRes.body.message).should.match('Please fill Booking name');
						
						// Handle Booking save error
						done(bookingSaveErr);
					});
			});
	});

	it('should be able to update Booking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Booking
				agent.post('/bookings')
					.send(booking)
					.expect(200)
					.end(function(bookingSaveErr, bookingSaveRes) {
						// Handle Booking save error
						if (bookingSaveErr) done(bookingSaveErr);

						// Update Booking name
						booking.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Booking
						agent.put('/bookings/' + bookingSaveRes.body._id)
							.send(booking)
							.expect(200)
							.end(function(bookingUpdateErr, bookingUpdateRes) {
								// Handle Booking update error
								if (bookingUpdateErr) done(bookingUpdateErr);

								// Set assertions
								(bookingUpdateRes.body._id).should.equal(bookingSaveRes.body._id);
								(bookingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Bookings if not signed in', function(done) {
		// Create new Booking model instance
		var bookingObj = new Booking(booking);

		// Save the Booking
		bookingObj.save(function() {
			// Request Bookings
			request(app).get('/bookings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Booking if not signed in', function(done) {
		// Create new Booking model instance
		var bookingObj = new Booking(booking);

		// Save the Booking
		bookingObj.save(function() {
			request(app).get('/bookings/' + bookingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', booking.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Booking instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Booking
				agent.post('/bookings')
					.send(booking)
					.expect(200)
					.end(function(bookingSaveErr, bookingSaveRes) {
						// Handle Booking save error
						if (bookingSaveErr) done(bookingSaveErr);

						// Delete existing Booking
						agent.delete('/bookings/' + bookingSaveRes.body._id)
							.send(booking)
							.expect(200)
							.end(function(bookingDeleteErr, bookingDeleteRes) {
								// Handle Booking error error
								if (bookingDeleteErr) done(bookingDeleteErr);

								// Set assertions
								(bookingDeleteRes.body._id).should.equal(bookingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Booking instance if not signed in', function(done) {
		// Set Booking user 
		booking.user = user;

		// Create new Booking model instance
		var bookingObj = new Booking(booking);

		// Save the Booking
		bookingObj.save(function() {
			// Try deleting Booking
			request(app).delete('/bookings/' + bookingObj._id)
			.expect(401)
			.end(function(bookingDeleteErr, bookingDeleteRes) {
				// Set message assertion
				(bookingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Booking error error
				done(bookingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Booking.remove().exec();
		done();
	});
});