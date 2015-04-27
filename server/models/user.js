/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    schema =  new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            index: true
        },
        name: String,
        password: String,
        score: Number,
        count: Number
    });

module.exports = mongoose.model('User', schema);
