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


var config = require('../acceptance/config.js');
config.loadModules();

test.describe('Variant Browser ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser(), 'http://localhost/eva-web/src/index.html');
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('check Species', function() {
        test.it('check Species loaded in the "Organism/Assembly" field', function() {
            checkSpeciesLoad(driver);
        });
    });

    test.describe('check studies', function() {
        test.it('check studies loaded in the "Studies Mapped To Assembly" field', function() {
            checkStudiesLoad(driver);
        });
    });

    test.describe('check Variants', function() {
        test.it('check variants loaded in the "Variant Browser" Table', function() {
            checkVariantsLoad(driver);
        });
    });

});

function checkSpeciesLoad(driver) {
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")).click();
}

function checkStudiesLoad(driver) {
    chai.expect('div.ocb-study-filter > a').dom.to.have.text(/^[a-z0-9]+/);
}

function checkVariantsLoad(driver) {
    chai.expect('div#variant-browser-grid-body').dom.to.have.text(/^[a-z0-9]+/);
}






