'use strict';

var express = require('express');
var router = express.Router();
var assert = require('assert');

require('dotenv').config();

var mongodb_uri = process.env.MONGODB_URI;
if (process.env.NODE_ENV == 'test') {
  mongodb_uri = process.env.MONGODB_URI_TEST;      
}

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  if (id === undefined) {
    res.status(500).send();
  } else {
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(mongodb_uri, function(error, db) {
      assert.equal(null, error);
      try {
        var urls = db.collection('urls');
        urls.deleteMany({id: Number(id)}, function(error, result) {
          db.close();
          if (result.deletedCount > 0) {
            res.status(200).send();
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
