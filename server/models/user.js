/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    schema =  new mongoose.Schema({
        name: String,
        email: String,
        score: Number,
        count: Number
    });

module.exports = mongoose.model('User', schema);
