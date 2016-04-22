"use strict";

var express = require("express");
var router = express.Router();
var passport = require('passport');
//var session = require('express-session');
var userDB = require("../models/users");

require("../middlewares/Authentication/Passport-github2");

router.use("/home", require("./home"));

router.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
  // Successful authentication.
    userDB.searchForUser(req.user.id).then(
      function(doc) {
        req.session.passport.user.username = doc[0].userName;
        res.redirect("/home");
      },   // When resolved
      function(user) {
        userDB.addNewUser(user, req.user._json.login);
        res.redirect("/home");
      }  //when rejected
      );
  });

router.get("/", function(req, res) {
  res.redirect("./landing.html");
});

module.exports = router;