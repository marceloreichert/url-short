'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var stat = require('../controllers/stat.js');
var db = require('../models/db.js');


router.get('/', function(req, res) {

  async.series([
    function(callback) {
      db.connect(function(err) { callback() });
    },

    function(callback) {
      stat.getStats(function(status, document) {
        if (status == 200) {
          res.status(status).json(document);
        } else {
          res.status(status).send();
        }
      });
    }
  ], function() {
    db.close(function(err) {});      
  }); 
});


router.get('/:id', function(req, res) {
  var id = req.params.id;
  if (id === undefined) {
    res.status(500).send();
  } else {

    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        stat.getIdStats(id, function(status, document) {
          if (status == 200) {
            res.status(status).json(document);
          } else {
            res.status(status).send();
          }
        });
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});

module.exports = router;
