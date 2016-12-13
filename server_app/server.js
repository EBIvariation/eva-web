/*
 *
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2016 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var express = require ('express');
var app = express ();
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
    console.log ('mock webservice app')
});



