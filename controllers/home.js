"use strict";

require("dotenv").config();

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var Yelp = require("yelp");

var jsonParser = bodyParser.json({type:"application/json"});
var passport = require('passport');
//var session = require('express-session');
var userDB = require("../models/users");

router.get("/", function (req, res) {
    res.redirect("/home/nightlife.html");
});

router.post("/search", jsonParser,   function (req, res) {

    var searchPromise = new Promise(function (resolve, reject) {
        yelpSearch(resolve, req.body.latitude, req.body.longitude);
    });
    if(req.session.hasOwnProperty(passport)) {
        var userDataPromise = new Promise(function (resolve, reject) {
        userDB.searchForUser2(resolve, reject, req.session.passport.user.id);
    });
    } else {
        var userDataPromise = new Promise(function (resolve, reject) {resolve([])});
    }
    
    
    Promise.all([searchPromise, userDataPromise]).then(function(values) {
        for (var business in values[0].businesses) {
            //console.log(values);
            if (values[1].indexOf(values[0].businesses[business]["name"]) >= 0) {
                
                values[0].businesses[business]["attending"] = true;
            } else {
                values[0].businesses[business]["attending"] = false;
            }
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        //console.log(values[0]);
        res.send(values[0]);
        res.end();
    });
});

router.post("/attendance", jsonParser, function (req, res) {
    userDB.updateUser(req.session.passport.user.id, req.body.pubName).then(function (data) {
        
    res.status(200);
    res.send(JSON.stringify({added: data}));
    res.end();
    });
})

function yelpSearch(resolve, lat, lon) {
    var yelp = new Yelp({
        consumer_key: process.env.YELP_KEY,
        consumer_secret: process.env.YELP_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET,
    });
    
        yelp.search({ term: "pub", ll: lat + "," + lon}).then(function (data) {
            console.log("Search Completed");
            resolve(data);
        }).catch(function (err) {
            console.log(err);
    });
}

module.exports = router;