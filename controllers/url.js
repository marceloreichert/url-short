"use strict";

var db = require('../models/db.js');

exports.getUrl = function(id, callback) {
  try {
    var urls = db.get().collection('urls');
    urls.findOne({id: Number(id)}, function(err, document) {
      if (document == null) {
        callback(404, null);
      } else {
        callback(301, document)
      }
    });
  } catch (e) {
    console.log(e);
    callback(500, null);
  }
}


exports.delete = function(id, callback) {
  try {
    var urls = db.get().collection('urls');
    urls.deleteMany({id: Number(id)}, function(error, result) {
      if (result.deletedCount > 0) {
        callback(200);
      } else {
        callback(404);              
      }
    });
  } catch (e) {
    console.log(e);
    callback(500);
  }
}
