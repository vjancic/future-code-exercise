/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    schema =  new mongoose.Schema({
        type: String,
        comment: String,
        date: Number,
        user: { id: String, name: String },
        ad: String
    });

module.exports = mongoose.model('Ad', schema);
