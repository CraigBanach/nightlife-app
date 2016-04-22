"use strict"

var express = require('express');
var passport = require('passport');
var session = require('express-session');

var app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'))
// configure Express
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./controllers/landing.js'));

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});