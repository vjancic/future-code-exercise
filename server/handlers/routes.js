/*jslint node: true, nomen: true, todo:true*/
'use strict';

var db = require('./db.js');

// TODO: verify ad!!!!! DO NOT USE THIS!!!!!
function saveAd(req, res) {
    db.saveAd(req.body, function (err, id) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(id);
        }
    });
}

function removeAd(req, res) {
    db.removeAd(req.body.id, function (err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

function getAll(req, res) {
    db.getAll(function (err, values) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(values);
        }
    });
}

function getById(req, res) {
    db.getById(req.params.id, function (err, values) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(values);
        }
    });
}

function getByUser(req, res) {
    db.getByUser(req.params.id, function (err, values) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(values);
        }
    });
}

function getByLocation(req, res) {
    db.getByLocation(req.params.name, function (err, values) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(values);
        }
    });
}

function getByTag(req, res) {
    db.getByTag(req.params.name, function (err, values) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(values);
        }
    });
}

module.exports.saveAd = saveAd;
module.exports.removeAd = removeAd;
module.exports.getAll = getAll;
module.exports.getByUser = getByUser;
module.exports.getByLocation = getByLocation;
module.exports.getByTag = getByTag;
module.exports.getById = getById;
