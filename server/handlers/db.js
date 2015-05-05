/*jslint node: true, nomen: true, todo: true*/
'use strict';

var mongoose = require('mongoose'),
    AdDB = require("../models/ad.js"),
    UserDb = require('../models/user.js'),
    Token = require('../models/token.js');

function saveAd(ad, token, projectionFunction) {
    if (ad instanceof Function) {
        throw new Error("No ad given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (Object.prototype.toString.call(ad) !== "[object Object]") {
        throw new Error("Ad is not an object!");
    }

    if (!ad.headline || !ad.body || !ad.location) {
        return projectionFunction(new Error("Required fields were empty!"), null);
    }

    var data = {};
    data.headline = ad.headline;
    data.body = ad.body;
    data.location = ad.location;
    data.expiry = ad.expiry || 0;
    data.date = new Date().getTime();
    data.type = ad.type;
    data.tags = ad.tags || "";
    data.user = {};

    if (data.expiry > 0) {
        data.expiry = data.date + data.expiry * 24 * 60 * 60 * 1000;
    }

    Token.findOne({ token: token }, function (err, dbToken) {
        if (err) {
            projectionFunction(err, null);
            return;
        }

        if (dbToken) {
            UserDb.findOne({ _id: mongoose.Types.ObjectId(dbToken.userId) }, function (err, user) {
                if (err) {
                    projectionFunction(err, null);
                    return;
                }

                data.user.id = user._id;
                data.user.name = user.name;

                new AdDB(data).save(function (err, newAd) {
                    if (err) {
                        // TODO: better error loging!!!
                        console.error(err);
                    }

                    projectionFunction(err, newAd._id);
                });
            });
        }
    });
}

function saveActivity(activity, adId, token, projectionFunction) {
    if (activity instanceof Function) {
        throw new Error("No activity given!");
    }

    if (!(projectionFunction instanceof Function)) {
        throw new Error("No callback given!");
    }

    if (Object.prototype.toString.call(activity) !== "[object Object]") {
        throw new Error("Ad is not an object!");
    }

    var data = {};
    data.comment = activity.comment;
    data.type = activity.type;
    data.date = new Date().getTime();
    data.user = {};

    Token.findOne({ token: token }, function (err, dbToken) {
        if (err) {
            projectionFunction(err, null);
            return;
        }

        if (dbToken) {
            UserDb.findOne({ _id: mongoose.Types.ObjectId(dbToken.userId) }, function (err, user) {
                if (err) {
                    projectionFunction(err, null);
                    return;
                }

                data.user.id = user._id;
                data.user.name = user.name;

                AdDB.find({ _id: mongoose.Types.ObjectId(adId) }, function (err, ad) {
                    if (err) {
                        // TODO: better error loging!!!
                        console.error(err);
                    }

                    if (ad.length) {
                        if (data.type !== 'lock') {
                            ad[0].activity.push(data);
                        }

                        if (data.type === 'lock' && String(data.user.id) === ad[0].user.id) {
                            console.log('in here!!');
                            ad[0].expiry = new Date().getTime() - 1000;
                        }

                        ad[0].save(function (err, newAd) {
                            if (err) {
                                // TODO: better error loging!!!
                                console.error(err);
                            }

                            projectionFunction(err, [newAd]);
                        });
                    } else {
                        projectionFunction(err, ad);
                    }
                });
            });
        }
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
module.exports.saveActivity = saveActivity;
module.exports.removeAd = removeAd;
module.exports.getAll = getAll;
module.exports.getByUser = getByUser;
module.exports.getByLocation = getByLocation;
module.exports.getByTag = getByTag;
module.exports.getById = getById;
