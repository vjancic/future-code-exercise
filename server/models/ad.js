/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    activity = new mongoose.Schema({
        type: String,
        comment: String,
        date: Number,
        user: { id: String, name: String }
    }),
    schema =  new mongoose.Schema({
        user: { id: String, name: String },
        headline: String,
        body: String,
        location: String,
        expiry: Number,
        date: Number,
        type: String,
        tags: String,
        activity: [activity]
    });

module.exports = mongoose.model('Ad', schema);
