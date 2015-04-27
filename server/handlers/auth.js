/*jslint node: true, nomen: true, todo: true*/
'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    UserDb = require('../models/ad.js'),
    SALT_BYTE_SIZE = 24,
    HASH_BYTE_SIZE = 24,
    PBKDF2_ITERATIONS = 50000,
    SALT_INDEX = 0,
    ITERATION_INDEX = 1,
    HASH_INDEX = 2;

function calculateHash(password, salt, iterations, length, callback) {
    crypto.pbkdf2(password, salt, iterations, length, function (err, hash) {
        if (err) {
            callback(err, null);
            return;
        }

        var fullHash = [];
        fullHash[SALT_INDEX] = salt;
        fullHash[ITERATION_INDEX] = iterations;
        fullHash[HASH_INDEX] = hash.toString('hex');

        callback(null, fullHash.join(':'));
    });
}

function createHash(password, callback) {
    if (password instanceof Function) {
        throw new Error("No password given!");
    }

    if (!(callback instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (typeof password !== 'string') {
        throw new Error("Password not a string!");
    }

    crypto.randomBytes(SALT_BYTE_SIZE, function (err, salt) {
        if (err) {
            callback(err, null);
            return;
        }

        calculateHash(password, salt.toString('hex'), PBKDF2_ITERATIONS, HASH_BYTE_SIZE, callback);
    });
}

function slowEquals(hash1, hash2) {
    var diff = hash1.length ^ hash2.length,
        i = 0;

    for (i = 0; i < hash1.length && i < hash2.length; i += 1) {
        diff |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
    }

    return diff === 0;
}

function isValidUser(email, password, callback) {
    if (email instanceof Function) {
        throw new Error("No email given!");
    }

    if (password instanceof Function) {
        throw new Error("No password given!");
    }

    if (!(callback instanceof Function)) {
        throw new Error("No callback given !");
    }

    UserDb.findOne({ email: email }, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }

        if (!user) {
            callback(null, false);
            return;
        }

        var split = user.password.split(':'),
            salt = split[SALT_INDEX],
            iterations = split[ITERATION_INDEX],
            correctHash = split[HASH_INDEX];

        calculateHash(password, salt, iterations, correctHash.length, function (err, hash) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, slowEquals(hash.split(':')[HASH_INDEX], correctHash));
        });
    });
}

function createUser(email, name, password, callback) {
    if (email instanceof Function) {
        throw new Error("No email given!");
    }

    if (password instanceof Function) {
        throw new Error("No password given!");
    }

    if (name instanceof Function) {
        throw new Error("No name given!");
    }

    if (!(callback instanceof Function)) {
        throw new Error("No callback given!");
    }

    createHash(password, function (err, hash) {
        if (err) {
            callback(err, null);
            return;
        }

        var user = {
            email: email,
            name: name,
            password: hash,
            score: 0,
            count: 0
        };

        new UserDb(user).save(function (err, newUser) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, { id: newUser._id, email: email, name: name });
        });
    });
}

module.exports.isValidUser = isValidUser;
module.exports.createUser = createUser;
