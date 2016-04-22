var db = require("./db/db");

module.exports = {
    searchForUser : function (user) {
        var database = db.getDB();
        var collection = database.collection("users");
        var doc = {
            "githubID" : user,
        }
        return new Promise (function(resolve, reject) {
            collection.find(doc).toArray(function (err, docs) {
                if (err) console.log(err);
                //console.log(docs);
                if (docs.length > 0) {
                    resolve(docs);
                } else { 
                    reject(doc);
                }
            });
        });
    },
    
    addNewUser : function(doc, userName) {
        var database = db.getDB();
        doc["userName"] = userName; 
        var collection = database.collection("users");
        collection.insert(doc);
    }
}