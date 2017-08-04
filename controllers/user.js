"use strict";

require('dotenv').config();

var assert = require('assert');
var db = require('../models/db.js');
var base58 = require('../base58.js');

exports.insert = function(userID, callback) {

  try {
    var collection = db.get().collection('users');
    var document = {id: userID};

    collection.find(document).toArray( function(error, docs) {
      if (docs.length > 0) {
        callback(409,null);
      } else {
        collection.insertOne(document, function(error, result) {
          assert.equal(null, error);
          callback(201, document);
        });          
      }           
    });
  } catch (e) {
    console.log(e);
    callback(500,null);
  }
}

exports.stats = function(userID, callback) {
  try {
    var users = db.get().collection('users');
    users.find({'id': userID}).toArray(function(err, docs) {
      assert.equal(null, err);
      
      if (docs == 0) {
        //res.status(404).send();
        callback(404, null);
      } else {
      
        var urls = db.get().collection('urls');
        urls.find({userId: userID}).sort( { hits: 1 } ).limit( 10 ).toArray(function(err, docs) {
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
            callback(200, document);
          } else {
            callback(404, null);
          }
        });
      }
    });

  } catch (e) {
    console.log(e);
    callback(500, null);
  }
}


exports.urls = function(userID, longUrl, callback) {
  try {
    var collection = db.get().collection('users');
    collection.find({id: userID}).toArray(function(err, docs) {
      assert.equal(null, err);

      if (docs.length > 0) {
        var counters = db.get().collection("counters");
        counters.findOneAndUpdate(  { id: "url_counter" },
                                    { $inc: { "sequence" : 1 } },
                                    { upsert: true, returnNewDocument: true }, function(error, newDocument) {
          var urlId = newDocument.value.sequence;

          var document = {
            id: urlId,
            userId: userID, 
            hits: 0,
            url: longUrl,
            shortUrl: process.env.HOST+base58.encode(urlId)
          };
          var urls = db.get().collection('urls');
          urls.insertOne(document, function(error, result) {
            assert.equal(null, error);
            callback(201, {  
                            id: urlId,
                            hits: 0,
                            url: longUrl,
                            shortUrl: process.env.HOST+base58.encode(urlId)
                          });
          })
        });

      } else {
        callback(500);
      }
    })

  } catch (e) {
    console.log(e);
    callback(500);
  }
}

exports.delete = function(userID, callback) {
  try {
    var urls = db.get().collection('urls');
    urls.deleteMany({userId: userID}, function(error, result) {
      var users = db.get().collection('users');
      users.deleteOne({id: userID}, function(error, result) {
        if (result.deletedCount > 0) {
          callback(200);
        } else {
          callback(404);
        }
      });          
    });

  } catch (e) {
    console.log(e);
    callback(500);
  }
}
