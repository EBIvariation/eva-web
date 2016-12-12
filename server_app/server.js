var express = require ('express')
var app = express ()
var mysql_connection = require ('./mysql_connections.js');
var mongo_connection = require ('./mongo_connections.js');
mysql_connection.init ();
var fs = require('fs');
// use it before all route definitions
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.get ('/', function (req, res) {
    res.send('Webservice Mock app listening on port 3000!')
});

app.get ('/v1/meta/species/list', function (req, res) {
    res.json( JSON.parse(fs.readFileSync( __dirname + '/json/species/eva/list.json')));
});

app.get ('/v1/meta/studies/all', function (req, res) {
    if(typeof req.query.structural == "undefined"){
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/eva/all_studies.json')));
    }else{
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/dgva/all_studies.json')));
    }
});

app.get ('/v1/meta/studies/list', function (req, res) {
    res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/eva/species_studies.json')));
});


app.get ('/v1/meta/studies/stats', function (req, res) {
    if(typeof req.query.structural == "undefined"){
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/eva/stats.json')));
    }else{
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/dgva/stats.json')));
    }
});

app.get ('/v1/meta/studies/all', function (req, res) {
    if(typeof req.query.structural == "undefined"){
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/eva/all_studies.json')));
    }else{
        res.json( JSON.parse(fs.readFileSync( __dirname + '/json/studies/dgva/all_studies.json')));
    }
});

app.get ('/v1/segments/:region/variants', function (req, res) {
    res.json( JSON.parse(fs.readFileSync( __dirname + '/json/variants/region_query.json')));
});

app.get ('/v1/genes/:gene/variants', function (req, res) {
    res.json( JSON.parse(fs.readFileSync( __dirname + '/json/variants/gene_query.json')));
});

app.get ('/v1/variants/:id/info', function (req, res) {
    res.json( JSON.parse(fs.readFileSync( __dirname + '/json/variants/id_query.json')));
});



app.listen (3000, function () {
    console.log ('mock webservice app listening on port 3000!')
});



