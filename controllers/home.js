"use strict";

require("dotenv").config();

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var Yelp = require("yelp");

var jsonParser = bodyParser.json({type:"application/json"});
//var passport = require('passport');
//var session = require('express-session');
//var userDB = require("../models/users");

require("../middlewares/Authentication/Passport-github2");

router.get("/", function (req, res) {
    res.redirect("/home/nightlife.html");
});

router.post("/search", jsonParser,   function (req, res) {
    //console.log("latitude: " + req.body.latitude + "\nlongitude: " + req.body.longitude);
    yelpSearch(req.body.latitude, req.body.longitude).then(function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        //console.log(data);
        res.send(data);
        res.end();
    });
});

function yelpSearch(lat, lon) {
    var yelp = new Yelp({
        consumer_key: process.env.YELP_KEY,
        consumer_secret: process.env.YELP_SECRET,
        token: process.env.YELP_TOKEN,
        token_secret: process.env.YELP_TOKEN_SECRET,
    });
    
    return new Promise(function (resolve, reject) {
        yelp.search({ term: "pub", ll: lat + "," + lon}).then(function (data) {
            resolve(data);
        }).catch(function (err) {
            console.log(err);
        });
    });
}

module.exports = router;