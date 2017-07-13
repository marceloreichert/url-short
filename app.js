var express = require('express');
var app = express();

var base58 = require('./base58.js');
var bodyParser = require('body-parser');
var routes_users = require('./routes/users');

require('dotenv').config();

/* 
 *	config middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* 
 * config routes
 */
app.use('/users', routes_users);


app.get('/urls/:id', function(req, res){
  // route to serve up the homepage (index.html)
});

app.get('/stats', function(req, res){
  // route to serve up the homepage (index.html)
});

app.get('/stats/:id', function(req, res){
  // route to serve up the homepage (index.html)
});

app.delete('/urls/:id', function(req, res){
  // route to serve up the homepage (index.html)
});

module.exports = app;
