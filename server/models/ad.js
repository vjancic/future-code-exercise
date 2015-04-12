/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    schema =  new mongoose.Schema({
        user: { id: String, name: String },
        headline: String,
        body: String,
        location: String,
        expiry: Number,
        date: Number,
        type: String,
        tags: String
    });

module.exports = mongoose.model('Ad', schema);
