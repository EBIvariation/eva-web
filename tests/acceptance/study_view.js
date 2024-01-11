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

test.describe('Study View ('+config.browser()+')', function() {
    var driver;

    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('EVA Study', function() {
        test.it('Check Summary and File Table Values are not empty', function() {
            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), config.wait()).then(function(text) {
                driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                    var rows = parseInt(text.split(" ")[3]);
                    for (var i = 1; i <= 5; i++) {
                        driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")), config.wait());
                        driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")).getText().then(function(text){
//                            driver.findElement(By.linkText(text)).click();
                            driver.get(config.baseURL()+'?eva-study='+text);
                            evaCheckSummaryTable(driver);
                            checkPublications(driver);
                            driver.findElement(By.id('filesTable')).then(function(webElement) {
                                checkFilesTable(driver);
                                checkFilesTableLinks(driver);
                            },function(err) {});
                            config.back(driver);
                        });
                    }
                });
            });
        });

    });

    test.describe('DGVA Study', function() {
        test.it('Check Summary Table Values are not empty', function() {
            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[2]//td[2]/div/a")), config.wait()).then(function(text) {
                driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
                config.submit(driver, "study-submit-button");
                driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[2]//td[2]/div/a")), config.wait()).then(function(text) {
                    driver.findElement(By.xpath("//div[@id='study-browser-grid-panel-body']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                        var rows = parseInt(text.split(" ")[3]);
                        for (var i = 1; i <= 5; i++) {
                            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")), config.wait());
                            driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")).getText().then(function(text){
//                            driver.findElement(By.linkText(text)).click();
                                driver.get(config.baseURL()+'?dgva-study='+text);
                                dgvaCheckSummaryTable(driver);
                                checkPublications(driver);
                                config.back(driver);
                            });
                        }
                    });
                });
            });
        });
    });

});


function evaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), config.wait()).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        var regExp = /^-$|^\w+/
        var numExp = /^\d+$/;
        var resourceExp = /^\w+|\d+$/;
        driver.findElement(By.id("organism-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("scientific-name-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("taxonomy-id-span")).getText().then(function(text){
            assert(text).matches(numExp);
        });
        driver.findElement(By.id("center-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("material-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("scope-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("type-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("assembly-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("source-type-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("platform-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("samples-span")).getText().then(function(text){
            assert(text).matches(numExp);
        });
        driver.findElement(By.id("description-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("resource-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("ena_link")).getAttribute('href').then(function(text){
            assert(text).matches(/https:\/\/www.ebi.ac.uk\/ena\/browser\/view\/PRJ[A-Z0-9]+$/);
        });
        driver.findElement(By.id("eva_link")).getAttribute('href').then(function(text){
            assert(text).matches(/https:\/\/ftp.ebi.ac.uk\/pub\/databases\/eva\/PRJ[A-Z0-9]+$/);
        },function(err) {});
    });

    return driver;
}

function dgvaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), config.wait()).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        var regExp = /^\w+/;
        var numExp = /^\d+$/;

        driver.findElement(By.id("organism-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("scientific-name-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("taxonomy-id-span")).getText().then(function(text){
            var values = text.split(", ");
            for (var i = 0; i < values.length; i++) {
                assert(values[i]).matches(numExp);
            }
        });
        driver.findElement(By.id("study-type-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("exp-type-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("platform-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("assembly-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("description-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });
        driver.findElement(By.id("download-span")).getText().then(function(text){
            assert(text).matches(regExp);
        });

    });

    return driver;
}

function checkPublications(driver){
    driver.wait(until.elementLocated(By.className("publication-id")), config.wait()).then(function(text) {
       driver.findElement(By.className('publication-id')).getText().then(function(text){
           var regExp = /^-$|^\w+/;
           if(text != '-'){
               text = text.split("\n");
               assert(text[0]).matches(regExp);
               assert(text[1]).matches(regExp);
               assert(text[2]).matches(regExp);
           }
       });
    });

    return driver;
}

function checkFilesTable(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), config.wait()).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']")).getText();
        assert(value).contains('File Name');

        //expression to math NA or 12334
        var countRegExp = /NA|^\d+$/;

        //expression to match NA or 0.00
        var meanCountRegExp = /NA|^[+-]?\d+(?:\.\d{1,2})?$/;

        //expression to match NA or 0.00 (123/123)
        var transitionCountRegExp =  /NA|^[+-]?\d+(?:\.\d{1,2})\s\(\d+\/\d+\)?$/;

        driver.findElement(By.className("samples_count")).getText().then(function(text){
            assert(text).matches(countRegExp);
        });
        driver.findElement(By.className("variants_ount")).getText().then(function(text){
            assert(text).matches(countRegExp);
        });
        driver.findElement(By.className("snps_count")).getText().then(function(text){
            assert(text).matches(countRegExp);
        });
        driver.findElement(By.className("indels_count")).getText().then(function(text){
            assert(text).matches(countRegExp);
        });
        driver.findElement(By.className("pass_count")).getText().then(function(text){
            assert(text).matches(countRegExp);
        });
        driver.findElement(By.className("transition_count")).getText().then(function(text){
            assert(text).matches(transitionCountRegExp);
        });
        driver.findElement(By.className("mean_count")).getText().then(function(text){
            assert(text).matches(meanCountRegExp);
        });

    });

    return driver;
}

function checkFilesTableLinks(driver){
    driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText().then(function(text) {
        assert(text).contains('vcf.gz');
    },function(err) {
        if (err.state && err.state === 'no such element') {

        } else {
            webdriver.promise.rejected(err);
        }
        return false;
    });
    return driver;
}



