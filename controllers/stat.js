"use strict";

var db = require('../models/db.js');

exports.getStats = function(callback) {
  try {
    var urls = db.get().collection('urls');
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
        callback(200, document);
      } else {
        callback(404);
      }
    });

  } catch (e) {
    console.log(e);
    callback(500);
  }
}


exports.getIdStats = function(id, callback) {
  try {
    var urls = db.get().collection('urls');
    urls.find({id: Number(id)}).toArray(function(err, docs) {
      var document = {
        id: docs[0].id,
        hits: docs[0].hits,
        url: docs[0].url,
        shortUrl: docs[0].shortUrl
      };
      if (docs.length > 0) {
        callback(200, document);
      } else {
        callback(404, null);
      }
    });

  } catch (e) {
    console.log(e);
    callback(500, null);
  }
}
