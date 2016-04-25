var db = require("./db/db");

module.exports = {
    searchForUser : function (user) {
        var database = db.getDB();
        var collection = database.collection("users");
        var doc = {
            "githubID" : user,
        }
        return new Promise(function(resolve, reject) {
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
    
    searchForUser2 : function (resolve, user) {
        var database = db.getDB();
        var collection = database.collection("users");
        var doc = {
            "githubID" : user,
        }
        console.log(doc);
        collection.find(doc).toArray(function (err, docs) {
            if (err) console.log(err);
            //console.log(docs);
            if (docs.length > 0) {
                console.log("Found USer");
                resolve(docs.pub);
            } else { 
                console.log("user search rejected");
                reject(docs);
            }
        });
    },
    
    addNewUser : function(doc, userName) {
        var database = db.getDB();
        doc["userName"] = userName;
        doc["pub"] = [];
        var collection = database.collection("users");
        collection.insert(doc);
        console.log(JSON.stringify(doc) + " was inserted into the DB.");
    },
    
    updateUser :function(userID, pubName) {
        var database = db.getDB();
        var collection = database.collection("users");
        var doc = {
            "githubID" : userID,
        }
         return new Promise (function (resolve, reject) {
             collection.find(doc).toArray(function (err, docs) {
                if (err) console.log(err);
                //console.log(docs);
                if (docs.length > 0) {
                    if (docs[0]["pub"].indexOf(pubName) == -1) {
                        docs[0]["pub"].push(pubName);
                        console.log(docs[0]["pub"]);
                        resolve(true);
                    } else { 
                        docs[0]["pub"].splice(docs[0]["pub"].indexOf(pubName), 1);
                        console.log(docs[0]["pub"]);
                        resolve(false);
                    }
                    collection.update(doc, docs[0]);
                } else { 
                    //reject(doc);
                }
             });
         });
    }
}