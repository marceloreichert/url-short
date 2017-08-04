var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

var mongoDbUri = process.env.MONGODB_URI;
if (process.env.NODE_ENV == 'test') {
  mongoDbUri = process.env.MONGODB_URI_TEST;
}

var state = {
  db: null,
}

exports.connect = function(done) {
  if (state.db) return done();

  MongoClient.connect(mongoDbUri, function(err, db) {
    if (err) {
      console.log('Nao foi possivel conectar no MongoDB!!');
      process.exit(1);
    }
    
    state.db = db;
    assert.equal(null, err);
    done();
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    });
  }
}
