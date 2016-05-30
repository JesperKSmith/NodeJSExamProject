var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://admin:1234@ds036178.mlab.com:36178/projectdatabase';

// route to get all recipes
app.get('/recipes', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            res.status(500);
            res.send({'msg' : 'Internal Server Error'});
            db.close();
            return;
        }
        var recipes = db.collection('recipes');

        recipes.find({}).toArray(function(err, data) {
            res.status(200);
            res.send(data);
            db.close();
           
        });
    });
});


// Route to handle single recipe
app.get('/recipes/:id', function(req, res) {

    if (req.params.id.length === 12 || req.params.id.length === 24) {
        MongoClient.connect(url, function(err, db) {

            if (err) {
                res.status(500);
                res.send({ "msg": "Internal Server Error" });
                db.close();
                return;
            }

            var collection = db.collection('recipes');

            collection.findOne({ '_id': ObjectId(req.params.id) }, function(err, data) {

                if (data === null) {
                    res.status(404);
                    res.send({ "msg": "Recipe Not Found" });
                } else {
                    res.status(200);
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

// Delete single recipe route

app.delete('/recipes/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            res.status(500);
            res.send({'msg' : 'Internal Server Error'});
            db.close();
            return;
        }
        var collection = db.collection('recipes');

        collection.remove({'_id' : ObjectId(req.params.id)}, function(err, data) {
            res.status(200);
            res.send({ 'msg': 'recipe deleted' });
            db.close();
        });
    });
});

// Route that handles creation of new user

app.post('/recipes', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            res.status(500);
            res.send({'msg' : 'Internal Server Error'});
            db.close();
            return;
        }
        var collection = db.collection('recipes');

        collection.insert(req.body, function(err, data) {
            res.status(200);
            console.log(data);
        //    res.send({ 'msg': 'recipe created' });
            res.send({ 'id' : data.id });
            db.close();
        });
    });
});

// Route that handles updates of a recipe

app.put('/recipes/:id', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            res.status(500);
            res.send({'msg' : 'Internal Server Error'});
            db.close();
            return;
        }        
        var collection = db.collection('recipes');

        collection.update({ '_id': ObjectId(req.params.id) }, {
            //$set: req.body 
            'name': req.body.name,
            'cuisine': req.body.cuisine,
            'category': req.body.category,
            'time': req.body.time,
            'description': req.body.description,
            'link': req.body.link
        }, function(err, data) {
            res.status(200);
            //res.send({ 'msg': ''+ req.body});
            console.dir(req.body);
            res.send({ 'msg': 'recipe updated' });
            db.close();
        });
    });
});

module.exports = app;
