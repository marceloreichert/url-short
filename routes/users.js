'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');

var user = require('../controllers/user.js');
var db = require('../models/db.js');

require('dotenv').config();


router.post('/', function(req, res) {
  var userId = req.body.id;

  if (userId === undefined) {
    res.status(500).send();
  } else {

    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        user.insert(userId, function(status, document) {
          if (status == 201) {
            res.status(status).json(document);
            callback();
          } else {
            res.status(status).send();
            callback();
          }
        });        
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});


router.get('/:userid/stats', function(req, res) {
  var userId = req.params.userid;
  
  if (userId === undefined) {
    res.status(500).send();
  } else {
  
    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        user.stats(userId, function(status, document) {
          if (status == 200) {
            res.status(status).json(document);
            callback();
          } else {
            res.status(status).send();
            callback();
          }
        })
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});


router.post('/:userid/urls', function(req, res) {
  var userId = req.params.userid;
  var longUrl = req.body.url

  if (userId === undefined) {
    res.status(500).send();
  } else {

    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        user.urls(userId, longUrl, function(status, document) {
          if (status == 201) {
            res.status(status).json(document);
            callback();
          } else {
            res.status(status).send();
            callback();
          }
        })
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});


router.delete('/:userid', function(req, res) {
  var userId = req.params.userid;

  if (userId === undefined) {
    res.status(404).send();
  } else {

    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        user.delete(userId, function(status) {
          res.status(status).send();
          callback();          
        })
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});

module.exports = router;
