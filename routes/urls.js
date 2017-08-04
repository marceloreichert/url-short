'use strict';

var express = require('express');
var router = express.Router();

var url = require('../controllers/url.js');
var db = require('../models/db.js');

var async = require('async');

require('dotenv').config();

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
        url.getUrl(id, function(status, document) {
          if (status == 301) {
            res.redirect(status, document.url);
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


router.delete('/:id', function(req, res) {
  var id = req.params.id;

  if (id === undefined) {
    res.status(500).send();
  } else {

    async.series([
      function(callback) {
        db.connect(function(err) { callback() });
      },

      function(callback) {
        url.delete(id, function(status) {
          res.status(status).send();
        });
      }
    ], function() {
      db.close(function(err) {});      
    }); 
  }
});

module.exports = router;
