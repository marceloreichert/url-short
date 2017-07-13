'use strict';

var express = require('express');
var router = express.Router();
var assert = require('assert');
var base58 = require('../base58.js');

require('dotenv').config();

var mongodb_uri = process.env.MONGODB_URI;
if (process.env.NODE_ENV == 'test') {
  mongodb_uri = process.env.MONGODB_URI_TEST;      
}

router.post('/', function(req, res) {
  var userId = req.body.id;

  if (userId === undefined) {
    res.status(500).send();
  } else {
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);
      try {
        var collection = db.collection('users');
        var document = {id: userId}

        collection.find(document).toArray( function(error, docs) {
          if (docs.length > 0) {
            db.close();
            res.status(409).send();
          } else {
            collection.insertOne(document, function(error, result) {
              assert.equal(null, error);
              db.close();
              res.status(201).json(document);
            });          
          }           
        });
      } catch (e) {
        console.log(e);
        db.close();
        res.status(500).send();
      }
    });
  }
});


router.post('/:userid/stats', function(req, res) {
  var userId = req.params.userid;
  var longUrl = req.body.url

});

router.post('/:userid/urls', function(req, res) {
  var userId = req.params.userid;
  var longUrl = req.body.url

  if (userId === undefined) {
    res.status(500).send();
  } else {
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);

      try {
        var collection = db.collection('users');
        collection.find({id: userId}).toArray(function(err, docs) {
          assert.equal(null, err);

          if (docs.length > 0) {
            var counters = db.collection("counters");
            counters.findOneAndUpdate(  { id: "url_counter" },
                                        { $inc: { "sequence" : 1 } },
                                        { upsert: true, returnNewDocument: true }, function(error, newDocument) {
              var urlId = newDocument.value.sequence;

              var document = {
                id: urlId,
                hits: 0,
                url: longUrl,
                shortUrl: process.env.HOST+base58.encode(urlId)
              };
              var urls = db.collection('urls');
              urls.insertOne(document, function(error, result) {
                assert.equal(null, error);
                db.close();
                res.status(201).json(document);
              })
            });

          } else {
            db.close();
            res.status(500).send();
          }
        })

      } catch (e) {
        console.log(e);
        db.close();
        res.status(500).send();
      }
    })
  }
});

module.exports = router;
