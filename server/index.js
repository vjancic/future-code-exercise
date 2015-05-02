/*jslint node: true, nomen: true, todo:true*/
'use strict';

var express = require('express'),
    https = require('https'),
    http = require('http'),
    db = require('./handlers/db.js'),
    routes = require('./handlers/routes.js'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    port = Number(process.env.PORT) || 3000,
    host = process.env.HOST || "localhost",
    serverStarted = false,
    server;

function stopServer() {
    if (serverStarted) {
        server.stop();
    }

    process.exit(0);
}

process.on('SIGINT', stopServer);

// TODO: read database name from enviroment if one exists
mongoose.connect('mongodb://localhost/bankasrece');

mongoose.connection.on('error', function errorCallback(err) {
    console.error(err);
    stopServer();
});

mongoose.connection.once('open', function openCallback() {
    console.log('Connected to bankasrece!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(__dirname + '/../client/'));

app.post('/ad', routes.saveAd);
app.post('/authenticate', routes.authenticate);
app.get('/ad', routes.getAll);
app.get('/ad/:id', routes.getById);
app.get('/ad/user/:id', routes.getByUser);
app.get('/ad/location/:name', routes.getByLocation);
app.get('/ad/tag/:name', routes.getByTag);

server = http.createServer(app).listen(port, function () {
    host = server.address().address;
    port = server.address().port;

    console.log('Server listening to %s:%d', host, port);
});
