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
var clinvar = require('./clinvar_bottom_panel_tests.js');


test.describe('Clinical Browser ('+config.browser()+')', function() {
    var driver;
    var value;

    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('search by ClinVar Accession', function() {
        test.it('Search term "RCV000074666" should match with column "ClinVar Accession"', function() {
            clinVarSearchByAccession(driver);
        });
    });

    test.describe('search by Chromosomal Location', function() {
        test.it('Search term "13:32889611-32973805" should match with column "Chr" and "Position"', function() {
            clinVarSearchByLocation(driver);
        });
    });

    test.describe('search by Gene', function() {
        test.it('Search term "BRCA1" should match with column "Affected Gene"', function() {
            clinVarSearchByGene(driver);
        });
    });

    test.describe('search by Trait', function() {
        test.it('Search term "Pancreatic cancer" should match with column "Trait"', function() {
            clinVarSearchByTrait(driver);
        });
    });

    test.describe('Filter by Consequence Type', function() {
        test.it('filter term "inframe_deletion"  should match with column "Most Severe Consequence Type"', function() {
            clinVarFilterByConseqType(driver);
        });
    });

    test.describe('Filter by Variation Type', function() {
        test.it('filter term "Deletion" should  match with column "Variation Type" in Summary tab', function() {
            clinVarFilterByVariationType(driver);
        });
    });

    test.describe('Filter by Clinical Significance', function() {
        test.it('filter term "Uncertain significance"  should match with  column "Clinical Siginificance"', function() {
            clinVarFilterByClincalSignificance(driver);
        });
    });

    test.describe('Filter by Review Status', function() {
        test.it('filter term "Expert panel"  should match with  column "Review Status" in Summary tab', function() {
            clinVarFilterByReviewStatus(driver);
        });
    });

    test.describe('Bottom Panel', function() {
        test.it('Summary Tab should not be empty', function() {
            clinvar.clinVarSummaryTab(driver);
        });
        test.it('Clinical Assertion Tab should not be empty and no duplicate items', function() {
            clinvar.clinVarAssertionTab(driver, 'clinical-widget');
        });
        test.it('Annotation Tab should not be empty', function() {
            clinvar.clinVarAnnotationTab(driver);
        });
        test.it('External Links Tab should not be empty', function() {
            clinvar.clinVarLinksTab(driver);
        });
    });

    test.describe('Show data in Variant Browser', function() {
        test.it('Clicking "Show in Variant Browser" button should go to "Variant Browser" and click back should go back to "Clinical Browser"', function() {
            showDataInVariantBrowser(driver);
        });
    });

    test.describe('Reset button', function() {
        test.it('Clicking "Reset" button should add default values', function() {
            clinVarReset(driver);
        });
    });

});

function clinVarSearchByAccession(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
    driver.findElement(By.name("accessionId")).clear();
    driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[8]/div/a[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[8]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('RCV000074666');
        });
    });

    driver.navigate().back();
    config.sleep(driver);
    driver.navigate().forward();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[8]/div/a[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[8]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('RCV000074666');
        });
    });

    return driver;
}

function clinVarSearchByLocation(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("13:32889611-32973805");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('13');
        });
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 32889611);
            chai.assert.operator(text, '<=', 32973805);
        });

    });

    return driver;
}
function clinVarSearchByGene(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA1");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('17');
        });
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[3]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('BRCA1');
        });
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 41196312);
            chai.assert.operator(text, '<=', 41277500);
        });
    });

    return driver;
}
function clinVarSearchByTrait(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA1");
    driver.findElement(By.name("phenotype")).clear();
    driver.findElement(By.name("phenotype")).sendKeys("Pancreatic cancer");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[6]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[6]/div[text()]")).getText().then(function(text){
            assert(text).contains('Pancreatic cancer');
        });
    });
    driver.findElement(By.name("phenotype")).clear();

    return driver;
}

function clinVarFilterByConseqType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[5]/div/tpl[text()]")), config.wait()).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[5]/div/tpl[text()]")).getText().then(function(text){
            assert(text).contains('inframe_deletion');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//..//div[@role='button']")).click();

    return driver;
}

function clinVarFilterByVariationType(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.wait(until.elementLocated(By.className("clinvar-variationType"))).then(function(text) {
            driver.findElement(By.className("clinvar-variationType")).getText().then(function (text) {
                chai.assert.equal(text, 'Deletion');
            });
        });
    });

    return driver;
}
function clinVarFilterByClincalSignificance(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[7]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[7]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('Uncertain significance');
        });
    });

    return driver;
}
function clinVarFilterByReviewStatus(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Expert panel')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@class='clinvar-reviewStatus']")), config.wait()).then(function(text) {
            driver.findElement(By.className("clinvar-reviewStatus")).getText().then(function(text){
                chai.assert.equal(text, 'REVIEWED_BY_EXPERT_PANEL');
            });
        });
    });

    return driver;
}

function showDataInVariantBrowser(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("13:32889611-32973805");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.id("variantBrw-button")).click();
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, '13');
        });
    });
    driver.navigate().back();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('13');
        });
    });
}

function clinVarReset(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
    config.sleep(driver);
    driver.findElement(By.name("clinvarRegion")).getText().then(function(text){
        chai.assert.equal(text, '13:32889611-32973805');
    });
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, '13');
        });
    });
}



