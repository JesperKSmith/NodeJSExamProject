var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/store';

// route to handle all users
app.get('/users', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.find({}).toArray(function(err, data) {

            res.send(data);
            db.close();
        });
    });
});


// Rote to handle single user
app.get('/users/:id', function(req, res) {

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        MongoClient.connect(url, function(err, db) {

            if (err) {
                res.status(500);
                res.send({ "msg": "Internal Server Error" });
                db.close();
                return;
            }

            var collection = db.collection('users');

            collection.findOne({ '_id': ObjectId(req.params.id) }, function(err, data) {

                if (data === null) {
                    res.status(404);
                    res.send({ "msg": "User Not Found" });
                } else {
                    res.send(data);
                }

                db.close();
            });
        });
    } else {
        res.status(400);
        res.send({'msg' : '400 Bad Request'});
    }


});

// Route that handles creation of new user

app.delete('/users', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.remove(req.body, function(err, data) {

            res.send({ 'msg': 'user deleted' });
            db.close();
        });
    });
});

// Route that handles creation of new user

app.post('/users', function(req, res) {
    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.insert(req.body, function(err, data) {

            res.send({ 'msg': 'user created' });
            db.close();
        });
    });
});

// Route that handles updates of a user

app.put('/users/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {

        var collection = db.collection('users');

        collection.update({ '_id': ObjectId(req.params.id) }, {
            $set: req.body
        }, function(err, data) {

            res.send({ 'msg': 'user updated' });
            db.close();
        });
    });
});

module.exports = app;





















