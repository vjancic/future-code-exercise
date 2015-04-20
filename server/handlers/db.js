/*jslint node: true, nomen: true, todo: true*/
'use strict';

var mongoose = require('mongoose'),
    AdDB = require("../models/ad.js");

function saveAd(ad, projectionFunction) {
    if (ad instanceof Function) {
        throw new Error("No ad given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (Object.prototype.toString.call(ad) !== "[object Object]") {
        throw new Error("Ad is not an object!");
    }

    // TODO: validate AD!!!
    new AdDB(ad).save(function (err, newAd) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, newAd._id);
    });
}

function removeAd(id, projectionFunction) {
    if (id instanceof Function) {
        throw new Error("No id given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (typeof id !== 'string' || id.length !== 24) {
        throw new Error("Invalid id given!");
    }

    AdDB.remove({_id: mongoose.Types.ObjectId(id)}, function (err) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err);
    });
}

function getAll(projectionFunction) {
    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    AdDB.find({}, function (err, ads) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, ads);
    });
}

function getByUser(id, projectionFunction) {
    if (id instanceof Function) {
        throw new Error("No id given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    AdDB.find({ 'user.id': id }, function (err, ads) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, ads);
    });
}

function getByLocation(loc, projectionFunction) {
    if (loc instanceof Function) {
        throw new Error("No location given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    AdDB.find({ location: loc }, function (err, ads) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, ads);
    });
}

function getByTag(tag, projectionFunction) {
    if (tag instanceof Function) {
        throw new Error("No tag given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    AdDB.find({ tags: tag }, function (err, ads) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, ads);
    });
}

function getById(id, projectionFunction) {
    if (id instanceof Function) {
        throw new Error("No id given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (typeof id !== 'string' || id.length !== 24) {
        throw new Error("Invalid id given!");
    }

    AdDB.find({ _id: mongoose.Types.ObjectId(id) }, function (err, ads) {
        if (err) {
            // TODO: better error loging!!!
            console.error(err);
        }

        projectionFunction(err, ads);
    });
}

module.exports.saveAd = saveAd;
module.exports.removeAd = removeAd;
module.exports.getAll = getAll;
module.exports.getByUser = getByUser;
module.exports.getByLocation = getByLocation;
module.exports.getByTag = getByTag;
module.exports.getById = getById;
