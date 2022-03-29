/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 -2020 EMBL - European Bioinformatics Institute
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

test.describe('RS Release ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='RS Release']")).click();
        expandAccordionsToShowTables();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('RS Release table check', function() {
        test.it('Check "Scientific name" column should not be empty', function() {
            assertRows("rs-release-scientific-name", /\w+.*$/)
        });

        test.it('Check "Taxonomy ID" column should not be empty', function() {
            assertRows("rs-release-tax-id", /^\d+$/)
        });

        test.it('Check numeric columns should not be empty', function() {
            assertRows("rs-release-current-rs", /^[,0-9]+$/)
        });
    });
});

function expandAccordionsToShowTables() {
    driver.findElement(By.id("accordion-item-data-by-asm")).click();
    driver.wait(until.elementLocated(By.id("rs-release-table-by-assembly-new-data")), config.wait()).then(function() {
        driver.findElement(By.id("accordion-item-new-data-by-asm")).click();
        driver.wait(until.elementLocated(By.id("rs-release-table-by-assembly")), config.wait()).then(function(){
            driver.findElement(By.id("accordion-item-data")).click();
            driver.wait(until.elementLocated(By.id("rs-release-table")), config.wait()).then(function(){
                driver.findElement(By.id("accordion-item-new-data")).click();
                driver.wait(until.elementLocated(By.id("rs-release-table-new-data")), config.wait());
            })
        })
    });
}

function assertRows(className, regex) {
    driver.findElements(By.className(className)).then(function(rows){
        for (var i = 0; i < rows.length; i++){
            rows[i].getText().then(function(text){
                assert(text).matches(regex);
            });
        }
    });
}