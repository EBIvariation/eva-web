/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 -2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = require('./config.js');

config.loadModules();
var value;
test.describe('dbSNP Import Progress ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='dbSNP Import Progress']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('dbSNP Import Progress table check', function() {

        test.it('Check "Scientific name" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-scientific-name")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getText().then(function(text){
                            assert(text).matches(/\w+.*$/);
                        });
                    }
                });
            });
        });

        test.it('Check "Common Name" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-common-name")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getText().then(function(text){
                            assert(text).matches(/\w+.*$/);
                        });
                    }
                });
            });
        });

        test.it('Check "Taxonomy ID" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-tax-id")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getText().then(function(text){
                            assert(text).matches(/^\d+$/);
                        });
                    }
                });
            });
        });

        test.it('Check "INSDC assembly accession" column should be "-" or not empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-assembly-accession")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getText().then(function(text){
                            assert(text).matches(/^-$|^GCA_\d+.\d+$/);
                        });
                    }
                });
            });
        });

        test.it('Check "dbSNP build" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-build")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getText().then(function(text){
                            assert(text).matches(/^\d+$/);
                        });
                    }
                });
            });
        });

        test.it('Check "Current RS IDs" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-imported-rs")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getAttribute("innerHTML").then(function(text){
                            chai.assert.notEqual(text, null);
                        });
                    }
                });
            });
        });

        test.it('Check "Synonymous RS IDs" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-imported-synonymous-rs")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getAttribute("innerHTML").then(function(text){
                            chai.assert.notEqual(text, null);
                        });
                    }
                });
            });
        });

        test.it('Check "Current SS IDs" column should not be empty', function() {
            driver.wait(until.elementLocated(By.id("dbSNP-import-table")), config.wait()).then(function(text) {
                driver.findElements(By.className("dbSNP-imported-ss")).then(function(rows){
                    for (var i = 0; i < rows.length; i++){
                        rows[i].getAttribute("innerHTML").then(function(text){
                            chai.assert.notEqual(text, null);
                        });
                    }
                });
            });
        });

    });

});