"use strict";

require('dotenv').config();
var assert = require('assert');

var mongodb_uri = process.env.MONGODB_URI;
if (process.env.NODE_ENV == 'test') {
  mongodb_uri = process.env.MONGODB_URI_TEST;      
}

exports.insert = function(userID, callback) {
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(mongodb_uri, function(error, db) {
    assert.equal(null, error);
    try {
      var collection = db.collection('users');
      var document = {id: userID};

      collection.find(document).toArray( function(error, docs) {
        if (docs.length > 0) {
          db.close();
          callback(409,null);
          //res.status(409).send();
        } else {
          collection.insertOne(document, function(error, result) {
            assert.equal(null, error);
            db.close();
            callback(201, document);
            //res.status(201).json(document);
          });          
        }           
      });
    } catch (e) {
      console.log(e);
      db.close();
      callback(500,null);
      //res.status(500).send();
    }
  });
}
