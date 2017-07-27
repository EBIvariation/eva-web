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

test.describe('Home Page ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('Twitter Widget should  be rendered only once', function() {
        twitterWidgetRendered(driver);
    });

    test.it('Statistics all four charts rendered', function() {
        statisticsChartsRendered(driver);
    });

});

function twitterWidgetRendered(driver){
    var twitterArray = new Array();
    driver.wait(until.elementLocated(By.className("twitter-timeline-rendered")), config.wait()).then(function(text) {
        driver.findElements(By.className("twitter-timeline-rendered")).then(function(rows){
            for (var i = 0; i < rows.length; i++){
                rows[i].getAttribute('class').then(function(text){
                    chai.assert.notInclude(twitterArray, config.hashCode(text))
                    twitterArray.push(config.hashCode(text));
                });
            }
        });
    });
    return driver;
}

function statisticsChartsRendered(driver){
    driver.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")), config.wait()).then(function(text) {
        driver.findElements(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")).then(function(rows){
            chai.assert.equal(rows.length, 1);
        });
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")), config.wait()).then(function(text) {
        driver.findElements(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")).then(function(rows){
            chai.assert.equal(rows.length, 1);
        });
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")), config.wait()).then(function(text) {
        driver.findElements(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")).then(function(rows){
            chai.assert.equal(rows.length, 1);
        });
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")), config.wait()).then(function(text) {
        driver.findElements(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")).then(function(rows){
            chai.assert.equal(rows.length, 1);
        });
    });

    return driver;
}



