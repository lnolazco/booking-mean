'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Flight Schema
 */
var FlightSchema = new Schema({
	codeOrigin:{
		type:String,
		default:''
	},
	nameOrigin:{
		type:String
	},
	codeDestination: {
		type: String,
		default: ''
	},
	nameDestination:{
		type: String
	},
	depart: {
		type: Date
	},
	return: {
		type: Date
	},
	number: {
		type: String
	},
	class: {
		type: String
	},
	price:{
		type: Number
	}

});

mongoose.model('Flight', FlightSchema);
