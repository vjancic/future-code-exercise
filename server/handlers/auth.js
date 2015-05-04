/*jslint node: true, nomen: true, todo: true*/
'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    UserDb = require('../models/user.js'),
    Token = require('../models/token.js'),
    SALT_BYTE_SIZE = 24,
    HASH_BYTE_SIZE = 24,
    PBKDF2_ITERATIONS = 50000,
    SALT_INDEX = 0,
    ITERATION_INDEX = 1,
    HASH_INDEX = 2;

/**
* function generateToken returns the newly generated token/salt
* @return String generated token/salt
*/
function generateToken() {
    return crypto.randomBytes(SALT_BYTE_SIZE).toString('hex');
}

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
    crypto.pbkdf2(password, salt, Number(iterations), length, function (err, hash) {
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
        return new Error("No password given!");
    }

    if (!(callback instanceof Function)) {
        return new Error("No callback given!");
    }

    if (typeof password !== 'string') {
        return new Error("Password not a string!");
    }

    calculateHash(password, generateToken(), PBKDF2_ITERATIONS, HASH_BYTE_SIZE, callback);
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
* function login checks for user validity,
* creates a token and returns it back to the user
* @param String userId
* @param Function callback - return the token
*/
function login(userId, callback) {
    if (userId instanceof Function) {
        return new Error("No userId given!");
    }

    if (!(callback instanceof Function)) {
        return new Error("No callback given!");
    }

    UserDb.findOne({ _id: mongoose.Types.ObjectId(userId) }, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }

        if (!user) {
            callback(new Error("user not found!"), null);
            return;
        }

        Token.findOne({ userId: userId }, function (err, token) {
            if (err) {
                callback(err, null);
                return;
            }

            var newToken = generateToken();
            callback(null, newToken);

            // token does not yet exist, create it
            if (!token) {
                return new Token({ token: newToken, userId: userId }).save();
            }

            // update the token
            token.token = newToken;
            token.save();
        });
    });
}

/**
* function authenticateUser validates the user. It searches for the given user
* in the database then compares the password hash from the database
* to the one given
* @param String email
* @param String password
* @param Function callback - return the token or an error
*/
function authenticateUser(email, password, callback) {
    if (email instanceof Function || typeof email !== 'string') {
        return new Error("No email given!");
    }

    if (password instanceof Function || typeof password !== 'string') {
        return new Error("No password given!");
    }

    if (!(callback instanceof Function)) {
        return new Error("No callback given !");
    }

    UserDb.findOne({ email: email }, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }

        if (!user) {
            callback(new Error("Incorrect username or password!"), null);
            return;
        }

        // the stored password is always 'salt:iteration:hash', not necessarily
        // in that order
        var split = user.password.split(':'),
            salt = split[SALT_INDEX],
            iterations = split[ITERATION_INDEX],
            correctHash = split[HASH_INDEX],
            isValidUser;

        // calculate the password hash using the same parameters
        // used to create the correct hash and return boolean indicating
        // wether the hashes are equal
        calculateHash(password, salt, iterations, correctHash.length / 2, function (err, hash) {
            if (err) {
                callback(err, null);
                return;
            }

            isValidUser = slowEquals(hash.split(':')[HASH_INDEX], correctHash);

            if (!isValidUser) {
                callback(new Error("Incorrect username or password!"), null);
                return;
            }

            // log the user in
            login(user._id, callback);
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
    if (email instanceof Function || typeof email !== 'string') {
        return new Error("No email given!");
    }

    if (password instanceof Function || typeof password !== 'string') {
        return new Error("No password given!");
    }

    if (name instanceof Function || typeof name !== 'string') {
        return new Error("No name given!");
    }

    if (!(callback instanceof Function)) {
        return new Error("No callback given!");
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

            // log the user in
            login(newUser._id, callback);
        });
    });
}

/**
* function isLoggedIn checks if the token exists
* @param String token
* @param Function callback - return true if the token exists
*/
function isLoggedIn(token, callback) {
    if (token instanceof Function) {
        return new Error("No token given!");
    }

    if (!(callback instanceof Function)) {
        return new Error("No callback given!");
    }

    Token.findOne({ token: token }, function (err, token) {
        if (err) {
            callback(err, null);
            return;
        }

        // token does not exist
        if (!token) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
}

module.exports.authenticateUser = authenticateUser;
module.exports.createUser = createUser;
module.exports.isLoggedIn = isLoggedIn;
