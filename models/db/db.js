var MongoClient = require('mongodb').MongoClient;

var db = null;

MongoClient.connect("mongodb://localhost:27017/nightlife", function(err, database) {
			
			if (err) throw err;
			console.log("Successfully connected to the database.");
			db = database;
});

module.exports = {
    getDB : function () {
        if (db) {
            return db;
        } else {
            throw ("The application is not connected to the database.")
        }
    }
}