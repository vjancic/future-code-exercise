/*jslint node: true, nomen: true*/

var mongoose = require('mongoose'),
    schema =  new mongoose.Schema({
        token: {
            type: String,
            unique: true,
            index: true
        },
        userId: {
            type: String,
            unique: true,
            index: true
        },
        expires: Number
    });

module.exports = mongoose.model('Token', schema);
