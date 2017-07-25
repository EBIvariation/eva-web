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
var variantBrowser = require('./variant_browser_bottom_panel_tests.js');

test.describe('Variant View ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant=1:3000017:C:T&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('Summary Section', function() {
        test.it('Table should not be empty', function() {
            checkSummaryGrid(driver);
        });
    });
    test.describe('SO Terms Section', function() {
        test.it('Table should not be empty', function() {
            checkSOTermGrid(driver);
        });
    });

    test.describe('Studies Section', function() {
        test.it('Grid should not be empty and no duplicate Items', function() {
            checkStudyGrid(driver);
        });
    });

    test.describe('Population Stats Section', function() {
        test.it('Grid should not be empty and no duplicate Items', function() {
            checkPopulationGrid(driver);
        });
    });
});


function checkSummaryGrid(driver) {
    driver.wait(until.elementLocated(By.id("variant-view-organism")), config.wait()).then(function(text) {
        driver.findElement(By.id("variant-view-organism")).getText().then(function(text){
            assert(text).matches(/\w+\s\/\s\w+/);
        });
        driver.findElement(By.id('variant-view-id')).then(function(webElement) {
            driver.findElement(By.id("variant-view-id")).getText().then(function(text){
                assert(text).matches(/\w+\d+$/);
            });
        },function(err) {
        });
        driver.findElement(By.id("variant-view-type")).getText().then(function(text){
            assert(text).matches(/\w+$/);
        });
        driver.findElement(By.id("variant-view-chr")).getText().then(function(text){
            assert(text).matches(/^\d\:\d+\-\d+$/);
        });
        driver.findElement(By.id("variant-view-ref")).getText().then(function(text){
            assert(text).matches(/^[ACGT]+/);
        });
        driver.findElement(By.id("variant-view-ale")).getText().then(function(text){
            assert(text).matches(/^[ACGT]+/);
        });

    });
    return driver;
}
function checkSOTermGrid(driver) {
    driver.wait(until.elementLocated(By.id("consequence-types-grid")), config.wait()).then(function(text) {
        driver.findElement(By.className("variant-view-ensemblGeneId")).getText().then(function(text){
            assert(text).matches(/^[A-Z]+/);
        });
        driver.findElement(By.className("variant-view-ensemblTranscriptId")).getText().then(function(text){
            assert(text).matches(/^[A-Z]+/);
        });
        driver.findElement(By.className("variant-view-link")).getText().then(function(text){
            assert(text).matches(/^SO\:\d+$/);
        });
        driver.findElement(By.className("variant-view-soname")).getText().then(function(text){
            assert(text).matches(/^[a-z0-9]+/);
        });
    });
    return driver;
}
function checkStudyGrid(driver) {
    driver.wait(until.elementLocated(By.id("studies-grid")), config.wait()).then(function(text) {
        variantBrowser.filesTab(driver);
    });
    return driver;
}
function checkPopulationGrid(driver) {
    variantBrowser.populationTab(driver);
    return driver;
}

