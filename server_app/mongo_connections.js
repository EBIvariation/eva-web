var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/test';

module.exports = {
    connect: function (callback) {
        MongoClient.connect(url, function (err, db) {
            callback (err, db);
        });
    }
};