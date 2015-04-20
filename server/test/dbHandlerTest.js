/*jslint node: true, nomen: true */
/*global describe, it, before, after */

var assert = require("assert"),
    db = require("../handlers/db.js"),
    mongoose = require('mongoose'),
    AdDB = require("../models/ad.js"),
    ads = [
        {
            _id: mongoose.Types.ObjectId('4edd40c86762e0fb12000000'),
            user: { id: "0", name: "Vedran" },
            headline: "Giving JavaScript programming lessons",
            body: "JavaScript developer is willing to give JavaScript lessons for free to any who want it",
            location: "Zagreb",
            expiry: 0,
            date: new Date().getTime(),
            type: "offer",
            tags: "tutoring, JavaScript"
        },
        {
            _id: mongoose.Types.ObjectId('4edd40c86762e0fb12000001'),
            user: { id: "0", name: "Vedran" },
            headline: "Looking for project tutorship",
            body: "JavaScript developer is looking for a mentor to mentor me in Javascript projects",
            location: "Zagreb",
            expiry: 0,
            date: new Date().getTime(),
            type: "request",
            tags: "tutoring, JavaScript"
        },
        {
            _id: mongoose.Types.ObjectId('4edd40c86762e0fb12000002'),
            user: { id: "1", name: "Saša" },
            headline: "Giving cooking lessons",
            body: "Skilled developer is giving free cooking lessons",
            location: "Zagreb",
            expiry: 0,
            date: new Date().getTime(),
            type: "offer",
            tags: "cooking"
        }
    ];

describe("Database Handler", function () {
    'use strict';

    before(function (done) {
        mongoose.connect('mongodb://localhost/bankasrece');

        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', function openCallback() {
            ads.forEach(function (ad) {
                new AdDB(ad).save();
            });

            done();
        });
    });

    after(function (done) {
        AdDB.remove(function (err) {
            if (err) {
                console.log('Error: %s', err);
            }

            mongoose.disconnect();
            done();
        });
    });

    describe("#getAll", function () {
        it("should have a getAll function", function () {
            assert.equal(typeof db.getAll, 'function');
            assert.equal(db.getAll instanceof Function, true);
            assert.equal(Object.prototype.toString.call(db.getAll), "[object Function]");
        });

        it("getAll should return everything from the Ad table", function (done) {
            db.getAll(function (err, values) {
                assert.equal(values.length, 3);
                assert.equal(values[0].id, "4edd40c86762e0fb12000000");
                assert.equal(values[1].id, "4edd40c86762e0fb12000001");
                assert.equal(values[2].id, "4edd40c86762e0fb12000002");

                done();
            });
        });
    });

    describe("#getByUser", function () {
        it("should have a getByUser function", function () {
            assert.equal(typeof db.getByUser, 'function');
            assert.equal(db.getByUser instanceof Function, true);
            assert.equal(Object.prototype.toString.call(db.getByUser), "[object Function]");
        });

        it("getByUser should return two ads from Vedran", function (done) {
            db.getByUser("0", function (err, values) {
                assert.equal(values.length, 2);
                assert.equal(values[0].id, "4edd40c86762e0fb12000000");
                assert.equal(values[1].id, "4edd40c86762e0fb12000001");

                done();
            });
        });

        it("getByUser should return one ad from Saša", function (done) {
            db.getByUser("1", function (err, values) {
                assert.equal(values.length, 1);
                assert.equal(values[0].id, "4edd40c86762e0fb12000002");

                done();
            });
        });

        it("getByUser should return no ads for an incorrect UserId", function (done) {
            db.getByUser("3", function (err, values) {
                assert.equal(values.length, 0);

                done();
            });
        });
    });

    describe("#getByLocation", function () {
        it("should have a getByLocation function", function () {
            assert.equal(typeof db.getByLocation, 'function');
            assert.equal(db.getByLocation instanceof Function, true);
            assert.equal(Object.prototype.toString.call(db.getByLocation), "[object Function]");
        });

        it("getByLocation should return everything from the Ad table for Zagreb location", function (done) {
            db.getByLocation("Zagreb", function (err, values) {
                assert.equal(values.length, 3);
                assert.equal(values[0].id, "4edd40c86762e0fb12000000");
                assert.equal(values[1].id, "4edd40c86762e0fb12000001");
                assert.equal(values[2].id, "4edd40c86762e0fb12000002");

                done();
            });
        });

        it("getByLocation should return nothing from the Ad table if there is nothing in the given location", function (done) {
            db.getByLocation("Vukovar", function (err, values) {
                assert.equal(values.length, 0);

                done();
            });
        });
    });

    describe("#getByTag", function () {
        it("should have a getByTag function", function () {
            assert.equal(typeof db.getByTag, 'function');
            assert.equal(db.getByTag instanceof Function, true);
            assert.equal(Object.prototype.toString.call(db.getByTag), "[object Function]");
        });

        it("getByTag should return one ad for the cooking ad", function (done) {
            db.getByTag("cooking", function (err, values) {
                assert.equal(values.length, 1);
                assert.equal(values[0].id, "4edd40c86762e0fb12000002");

                done();
            });
        });

        it("getByTag should return no ad for the C# ad", function (done) {
            db.getByTag("C#", function (err, values) {
                assert.equal(values.length, 0);

                done();
            });
        });
    });

    describe("#getById", function () {
        it("should have a getById function", function () {
            assert.equal(typeof db.getById, 'function');
            assert.equal(db.getById instanceof Function, true);
            assert.equal(Object.prototype.toString.call(db.getById), "[object Function]");
        });

        it("getById should return only one ad for the correct id", function (done) {
            db.getById("4edd40c86762e0fb12000000", function (err, values) {
                assert.equal(values.length, 1);
                assert.equal(values[0].id, "4edd40c86762e0fb12000000");

                done();
            });
        });

        it("getById should return no ad for an incorrect id", function (done) {
            db.getById("4edd40c86762e0fb12000009", function (err, values) {
                assert.equal(values.length, 0);

                done();
            });
        });
    });
});
