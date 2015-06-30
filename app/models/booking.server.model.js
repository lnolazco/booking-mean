'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Booking Schema
 */
var BookingSchema = new Schema({
	customer: {
		name: {
			type: String,
			default: '',
			required: 'Please fill customer name',
			trim: true
		},
		email: {
			type: String,
			default: '',
			required: 'Please fill customer email address',
			trim: true
		}
	},
	origin: {
		type: String
	},
	nameOrigin: {
		type: String
	},
	destination:{
		type: String
	},
	nameDestination: {
		type: String
	},
	departureDate: {
		type: Date
	},
	returnDate:{
		type: Date
	},
	flight:{
		number: {
			type: String
		},
		class: {
			type: String
		},
		price: {
			type: Number
		}
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Booking', BookingSchema);
