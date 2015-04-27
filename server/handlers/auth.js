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

/**
* function calculateHash calculates the PBKDF2 hash for the given
* password, salt, iterations and length
* @param String password
* @param String salt
* @param Number iterations
* @param Number length - length of the hash in bytes
* @param Function callback - callback when the hash is calculated
*/
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

/**
* function createHash generates a random salt and then the hash
* for the given password
* @param String password - password to hash
* @param Function callback - callback when the hash is calculated
*/
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

    // generate random salt and calculate the hash
    crypto.randomBytes(SALT_BYTE_SIZE, function (err, salt) {
        if (err) {
            callback(err, null);
            return;
        }

        calculateHash(password, salt.toString('hex'), PBKDF2_ITERATIONS, HASH_BYTE_SIZE, callback);
    });
}

/**
* function slowEquals compares two hashes in length-constant time.
* This comparison method is used so that password hashes cannot be
* extracted from on-line systems using a timing attack and then attacked off-line
* @param String hash1
* @param String hash2
* @return boolean value indicating if the two hashes are the same
*/
function slowEquals(hash1, hash2) {
    // XORING the same value gives 0
    var diff = hash1.length ^ hash2.length,
        i = 0;

    for (i = 0; i < hash1.length && i < hash2.length; i += 1) {
        // ORING the XORED result will give 1 if there was
        // ever a mismatch in comparing the two hashes
        diff |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
    }

    // if the hashes are equal the diff should be 0
    // it will be 1 if they are not equal
    return diff === 0;
}

/**
* function isValidUser validates the user. It searches for the given user
* in the database then compares the password hash from the database
* to the one given
* @param String email
* @param String password
* @param Function callback - return the boolean true if the user is valid, false if not
*/
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

        // the stored password is always 'salt:iteration:hash', not necessarily
        // in that order
        var split = user.password.split(':'),
            salt = split[SALT_INDEX],
            iterations = split[ITERATION_INDEX],
            correctHash = split[HASH_INDEX];

        // calculate the password hash using the same parameters
        // used to create the correct hash and return boolean indicating
        // wether the hashes are equal
        calculateHash(password, salt, iterations, correctHash.length, function (err, hash) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, slowEquals(hash.split(':')[HASH_INDEX], correctHash));
        });
    });
}

/**
* function createUser creates a new user, calculates the password hash
* and saves that user in the database
* @param String email
* @param String name - the name the user chooses for himself
* @param String password
* @param Function callback - return the newly created user
*/
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
