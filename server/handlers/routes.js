/*jslint node: true, nomen: true, todo:true*/
'use strict';

var db = require('./db.js'),
    auth = require('./auth.js');

function saveAd(req, res) {
    db.saveAd(req.body, req.params.token, function (err, id) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(id);
        }
    });
}

function saveActivity(req, res) {
    db.saveActivity(req.body, req.params.adId, req.params.token, function (err, ad) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(ad);
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

function authenticate(req, res) {
    var ret = auth.authenticateUser(req.body.email, req.body.password, function (err, values) {
        if (err) {
            res.status(401).send(err.message);
        } else {
            res.json(values);
        }
    });

    if (ret) {
        res.status(401).send(ret.message);
    }
}

function register(req, res) {
    var ret = auth.createUser(req.body.email, req.body.name, req.body.password, function (err, values) {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json(values);
        }
    });

    if (ret) {
        res.status(400).send(ret.message);
    }
}

module.exports.saveAd = saveAd;
module.exports.saveActivity = saveActivity;
module.exports.removeAd = removeAd;
module.exports.getAll = getAll;
module.exports.getByUser = getByUser;
module.exports.getByLocation = getByLocation;
module.exports.getByTag = getByTag;
module.exports.getById = getById;

module.exports.authenticate = authenticate;
module.exports.register = register;
