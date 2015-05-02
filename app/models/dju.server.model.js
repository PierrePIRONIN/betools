'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Dju Schema
 */
var DjuSchema = new Schema({
    records: [
        {
            day: {type: Number, min: 1, max: 31, required: true},
            month: {type: Number, min: 1, max: 12, required: true},
            hour: {type: Number, min: 1, max: 24, required: true},
            temperature: {type: Number, required: true}
        }
    ]
});

mongoose.model('Dju', DjuSchema);
