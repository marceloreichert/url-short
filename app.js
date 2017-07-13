var express = require('express');
var app = express();

var base58 = require('./base58.js');
var bodyParser = require('body-parser');
var routes_users = require('./routes/users');
var routes_urls = require('./routes/urls');
var routes_stats = require('./routes/stats');

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
app.use('/urls', routes_urls);
app.use('/stats', routes_stats);

module.exports = app;
