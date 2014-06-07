'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LocationSchema = new Schema({
	lat: {
		type: Number
	},
	lon: {
		type: Number
	},
	date: {
		type: Date,
		default: Date.now
	},
	interval: {
		type: Number
	},
	distance: {
		type: Number
	},
	speed: {
		type: Number
	}
});

mongoose.model('Location', LocationSchema);