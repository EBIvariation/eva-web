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

test.describe('Checking All Browser Pages ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('The study browser is displayed', function() {
        visitStudyBrowser(driver);
    });
    test.it('The variant browser is displayed', function() {
        visitVariantBrowser(driver);
    });
});

function visitStudyBrowser(driver) {
    driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), config.wait()).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")).getText();
        assert(value).matches(/^\w+/);
    });

    return driver;
}
function visitVariantBrowser(driver) {
    driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")).getText();
        assert(value).matches(/^\w+/);
    });

    return driver;
}






