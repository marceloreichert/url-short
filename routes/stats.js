'use strict';

var express = require('express');
var router = express.Router();
var assert = require('assert');

require('dotenv').config();

var mongodb_uri = process.env.MONGODB_URI;
if (process.env.NODE_ENV == 'test') {
  mongodb_uri = process.env.MONGODB_URI_TEST;      
}


router.get('/', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(mongodb_uri, function(error, db) {
    assert.equal(null, error);
    try {
        
      var urls = db.collection('urls');
      urls.find().sort( { hits: 1 } ).limit( 10 ).toArray(function(err, docs) {
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

    } catch (e) {
      console.log(e);
      db.close();
      res.status(500).send();
    }
  });
});


router.get('/:id', function(req, res) {
  var id = req.params.id;
  if (id === undefined) {
    res.status(500).send();
  } else {
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);
      
      try {
        var urls = db.collection('urls');
        urls.find({id: Number(id)}).toArray(function(err, docs) {
          var document = {
            id: docs[0].id,
            hits: docs[0].hits,
            url: docs[0].url,
            shortUrl: docs[0].shortUrl
          };
          if (docs.length > 0) {
            res.status(200).json(document);
          } else {
            res.status(404).send();
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


module.exports = router;
