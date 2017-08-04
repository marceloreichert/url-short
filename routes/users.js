'use strict';

var express = require('express');
var router = express.Router();
var assert = require('assert');
var base58 = require('../base58.js');

var user = require('../controllers/user.js');

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
    user.insert(userId, function(status, document) {
      if (status == 201) {
        res.status(status).json(document);
      } else {
        res.status(status).send();
      }
    });
  }
});


router.get('/:userid/stats', function(req, res) {
  var userId = req.params.userid;
  if (userId === undefined) {
    res.status(500).send();
  } else {
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);

      try {
        var users = db.collection('users');
        users.find({'id': userId}).toArray(function(err, docs) {
          assert.equal(null, err);
          
          if (docs == 0) {
            db.close();
            res.status(404).send();
          } else {
          
            var urls = db.collection('urls');
            urls.find({userId: userId}).sort( { hits: 1 } ).limit( 10 ).toArray(function(err, docs) {
              if (docs.length > 0) {
                var countHits = 0;
                for (var i = docs.length - 1; i >= 0; i--) {
                  countHits = countHits + docs[i].hits;
                }
                var document = {
                  hits: countHits,
                  urlCount: docs.length,
                  topUrls: [
                    docs
                  ]
                }
                res.status(200).json(document);
              } else {
                res.status(404).send();
              }
            });
          }
        });

      } catch (e) {
        console.log(e);
        db.close();
        res.status(500).send();
      }
    })
  }
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
                userId: userId, 
                hits: 0,
                url: longUrl,
                shortUrl: process.env.HOST+base58.encode(urlId)
              };
              var urls = db.collection('urls');
              urls.insertOne(document, function(error, result) {
                assert.equal(null, error);
                db.close();
                res.status(201).json({  
                  id: urlId,
                  hits: 0,
                  url: longUrl,
                  shortUrl: process.env.HOST+base58.encode(urlId)
                });
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


router.delete('/:userid', function(req, res) {
  var userId = req.params.userid;

  if (userId === undefined) {
    res.status(404).send();
  } else {

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);

      try {
        var urls = db.collection('urls');
        urls.deleteMany({userId: userId}, function(error, result) {
          var users = db.collection('users');
          users.deleteOne({id: userId}, function(error, result) {
            db.close();
            if (result.deletedCount > 0) {
              res.status(200).send();
            } else {
              res.status(404).send();              
            }
          });          
        });

      } catch (e) {
        console.log(e);
        db.close();
        res.status(500).send();
      }
    });
  }
});

module.exports = router;
