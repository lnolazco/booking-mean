'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Booking = mongoose.model('Booking'),
	_ = require('lodash'),
	City = mongoose.model('City'),
	Flight = mongoose.model('Flight');

/**
 * Create a Booking
 */
exports.create = function(req, res) {
	var booking = new Booking(req.body);
	booking.user = req.user;

	booking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			/*lnn*/
			io.emit('chat message', booking, { for: 'everyone' });
			/*lnn*/
			res.jsonp(booking);
		}
	});
};

/**
 * Show the current Booking
 */
exports.read = function(req, res) {
	res.jsonp(req.booking);
};

/**
 * Update a Booking
 */
exports.update = function(req, res) {
	var booking = req.booking ;

	booking = _.extend(booking , req.body);

	booking.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(booking);
		}
	});
};

/**
 * Delete an Booking
 */
exports.delete = function(req, res) {
	var booking = req.booking ;

	booking.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(booking);
		}
	});
};

/**
 * List of Bookings
 */
exports.list = function(req, res) { 
	Booking.find().sort('-created').populate('user', 'displayName').exec(function(err, bookings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			City.find({},{_id:0,code:1,nombre:1}).exec(function(err, cities){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					bookings.forEach(function(booking){
						var cityOrigin = cities.filter(function(item) {
							return item.code === booking.origin;
						});
						if (cityOrigin && cityOrigin.length > 0)
							booking.nameOrigin = cityOrigin[0].nombre;
						var cityDestination = cities.filter(function(item) {
							return item.code === booking.destination;
						});
						if (cityDestination && cityDestination.length > 0)
							booking.nameDestination = cityDestination[0].nombre;

					});
					res.jsonp(bookings);
				}
			});
		}
	});
};


/*
 * Get Origin airports
 * */

exports.listOrigin = function(req, res) {
	City.find({},{_id:0,code:1,nombre:1}).exec(function(err, cities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cities);
		}
	});
};

//get list of destionations for the origin selected
exports.listDestination = function(req, res){
	City.findOne({code: req.params.code}).exec(function(err, city){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			City.find({},{_id:0,code:1,nombre:1}).exec(function(err, cities){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {

					var result = [];

					city.directos.forEach(function(code){

						var cityFound = cities.filter(function(item) {
							return item.code === code;
						});
						if (cityFound && cityFound.length > 0)
							result.push(cityFound[0]);

					});

					res.jsonp(result);

				}
			});
		}

	});

};

/*
 *
 *
 */
exports.listFlights = function(req, res) {
	var parts = req.params.departDate.split('-');
	var departDate = new Date(parts[0], parts[1]-1, parts[2]);
	parts = req.params.returnDate.split('-');
	var returnDate = new Date(parts[0], parts[1]-1, parts[2]);
	Flight.find({'codeOrigin': req.params.origin,
			'codeDestination': req.params.destination,
			'depart': {
				"$gte":departDate,
				"$lt":returnDate},
			'return': {
				"$gt":departDate,
				"$lte":returnDate}
	}).sort('-price').exec(function(err, flights) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			City.find({},{_id:0,code:1,nombre:1}).exec(function(err, cities){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {

					flights.forEach(function(flight){

						var cityOrigin = cities.filter(function(item) {
							return item.code === flight.codeOrigin;
						});
						if (cityOrigin && cityOrigin.length > 0)
							flight.nameOrigin = cityOrigin[0].nombre;
						var cityDestination = cities.filter(function(item) {
							return item.code === flight.codeDestination;
						});
						if (cityDestination && cityDestination.length > 0)
							flight.nameDestination = cityDestination[0].nombre;

					});

					res.jsonp(flights);

				}
			});
		}
	});
};

/**
 * Booking middleware
 */
exports.bookingByID = function(req, res, next, id) { 
	Booking.findById(id).populate('user', 'displayName').exec(function(err, booking) {
		if (err) return next(err);
		if (! booking) return next(new Error('Failed to load Booking ' + id));
		req.booking = booking ;
		next();
	});
};

/**
 * Booking authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.booking.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};




