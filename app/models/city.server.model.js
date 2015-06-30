'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
	// City model fields   
	code: {
		type: String
	},
	nombre: {
		type: String
	},
	directos: [String]
});

mongoose.model('City', CitySchema);
