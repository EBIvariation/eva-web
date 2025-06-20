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

test.describe('Variant Browser ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.beforeEach(function() {
        variantBrowserResetAndWait(driver);
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('search by Variant ID', function() {
        test.it('Search term "rs68485566" match with column Variant ID', function() {
            variantSearchById(driver, "rs68485566");
        });
    });

    test.describe('search by multiple Variant IDs', function() {
        test.it('Search term "rs68485566,rs68485569" match with column Variant ID values', function() {
            variantSearchByMutlipleIds(driver, ["rs68485566","rs68485569"]);
        });
    });

    test.describe('search by Species and Chromosomal Location', function() {
        test.it('Search by species  "Goat / CHIR_1.0" and location "CM001711.1:4000000-4100000"  where column "Chr"  should match with "CM001711.1" and Position should be between "4000000-4100000"', function() {
            variantSearchBySpeciesandChrLocation(driver);
        });
    });

    test.describe('Position Filter validate with special characters', function() {
        test.it('Search by species  "Mosquito / AgamP3" and location "CM000360.1:10000000-11000000"  where column "Chr"  should match with "CM000360.1"\n' +
                'Search by species  "Mosquito / AgamP3" and location "1!~13:12233-12234"  where table  should match with "No records to display"', function() {
            positionFilterBoxValidation(driver);
        });
    });

    test.describe('Position Filter Invalidate with Incorrect values', function() {
        test.it('Invalid Location "12334" should open alert box with "Please enter a valid region" message,\n' +
                'Invalid Location "1:3200000-3100000" should open alert box with "Please enter the correct range.The start of the region should be smaller than the end,\n' +
                'Invalid Location "1:3000000-310000000" should open alert box with "Please enter a region no larger than 1 million bases\n' +
                'Invalid Location "1,13:12233-12234" should open alert box with "Please enter a valid region"', function() {
            positionFilterBoxInValidation(driver);
        });
    });

    test.describe('Region filter invalid when left empty', function() {
        test.it('Empty region filter should open alert box with an error message', function () {
            emptyRegionFilter(driver);
        });
    });

    test.describe('Variant ID filter invalid when left empty', function() {
        test.it('Empty variant ID filter should open alert box with an error message', function () {
            emptyVariantIDFilter(driver);
        });
    });

    test.describe('Gene filter invalid when left empty', function() {
        test.it('Empty gene filter should open alert box with an error message', function () {
            emptyGeneFilter(driver);
        });
    });


    test.describe('search by Gene', function() {
        test.it('Search by "BRCA2" should match column "Chr" with "13"', function() {
            variantSearchByGene(driver);
        });
    });

    test.describe('check consequenceType tree', function() {
        test.it('check consequenceType tree rendered', function() {
            checkConsequeceTypeTree(driver);
        });
    });

    test.describe('Filter by  Polyphen and Sift Filters', function() {
        test.it('should match with columns "PolyPhen2 greater than 0.9" and "Sift Lesser than 0.02"', function() {
            variantFilterByPolyphenSift(driver);
        });
    });

    test.describe('Filter by  MAF', function() {
        test.it('should match with MAF column "Minor Allele Frequency greater than 0.3" in Poulation Statistics Tab', function() {
            variantFilterByMAF(driver);
        });
    });

    test.describe('Filter by  VEP version', function() {
        test.it('should match with VEP version in Annotation Tab', function() {
            checkAnnotationNotification(driver);
        });
    });

    test.describe('check dbSNP link href', function() {
        test.it('should match with Variant ID,\n' +
            'Variant ID ex: rs68485566 should have "http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs="', function() {
            checkdbSNPLink(driver);
        });
    });

    test.describe('check Ensembl link href', function() {
        test.it('should match with Variant ID,\n' +
            'Variant ID ex: rs541552030 should have "http://www.ensembl.org/Homo_sapiens/Variation/Explore?v="\n', function() {
            checkEnsemblLink(driver);
        });
    });

    test.describe('Bottom Panel', function() {
        test.it('Annotation Tab should not be empty', function() {
            variantAnnotationTab(driver);
        });
        test.it('Files Tab should not be empty and no duplicate Items', function() {
            variantBrowserResetAndWait(driver);
            variantFilesTab(driver);
        });
        test.it('Genotypes Tab should not be empty and no duplicate Items', function() {
            variantBrowserResetAndWait(driver);
            variantGenotypesTab(driver);
            variantGenotypesTabWithHaploidGenotypes(driver);
        });
        test.it('Population Statistics should not be empty and no duplicate Items ', function() {
            variantBrowserResetAndWait(driver);
            variantPopulationTab(driver);
        });
    });

    test.describe('check Annotation Tab ensembl links', function() {
        test.it('should match with Gen ID,\n' +
            'Gen ID ex ENSG00000139618: should have "http://www.ensembl.org/Multi/Search/Results?q=ENSG00000139618;facet_feature_type=Gene"\n', function() {
            checkGeneIdEnsemblLink(driver);
        });
        test.it('should match with Gen Symbol,\n' +
            'Gen Symbol ex BRCA2: should have "http://www.ensembl.org/Multi/Search/Results?q=BRCA2;facet_feature_type=Gene"\n', function() {
            variantBrowserResetAndWait(driver);
            checkGeneSymbolEnsemblLink(driver);
        });
        test.it('should match with Transcript ID,\n' +
            'Transcript ID ex ENST00000530893: should have "http://www.ensembl.org/Multi/Search/Results?q=ENST00000530893;facet_feature_type=Transcript"\n', function() {
            variantBrowserResetAndWait(driver);
            checkTranscriptIdEnsemblLink(driver);
        });
    });

    test.describe('Reset button', function() {
        test.it('Clicking "Reset" button should add default values', function() {
            variantResetCheck(driver);
        });
    });
});

function variantSearchById(driver, rs){
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Variant ID']")));
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys(rs);
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, rs);
        });
    });
    return driver;
}

function variantSearchByMutlipleIds(driver, rsList){
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Variant ID']")));
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys(rsList.join(","));
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    var checkedRsList = [];
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")),
        config.wait()).then(function(text) {
            for (let i = 1; i <= rsList.length; i++) {
                driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[" + i + "]//td[3]/div[text()]"))
                        .getText().then(function (text) {
                    chai.assert(rsList.includes(text));
                    chai.assert.isFalse((checkedRsList.includes(text)));
                    checkedRsList.push(text);
                });
            }
    });
    return driver;
}

function variantSearchBySpeciesandChrLocation(driver){
    variantBrowserResetAndWait(driver);
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('CM001711.1:4000000-4100000');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 4000000);
            chai.assert.operator(text, '<=', 4100000);
        });
    });
    return driver;
}

function checkdbSNPLink(driver){
    variantBrowserResetAndWait(driver);
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Variant ID']")));
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs68485566");
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[contains(@class,'dbsnp_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Chromosomal Location']")));
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3008755-3008755');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[contains(@class,'dbsnp_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Chromosomal Location']")));
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('CM001711.1:4000000-4100000');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[9]/div//a[contains(@class,'dbsnp_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });
}

function checkEnsemblLink(driver){
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Variant ID']")));
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs68485566");
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[contains(@class,'ensembl_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ensembl.org/Multi/Search/Results?q='+variantID+';facet_feature_type=Variant');
            });
        });
    });
}

function positionFilterBoxValidation(driver){
    variantBrowserResetAndWait(driver);
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('CM000360.1:10000000-11000000');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('CM000360.1');
        });
    });
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1!~13:12233-12234');
    clickSubmit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText().then(function(text){
            assert(text).equalTo('No records to display');
        });
    });
}

function positionFilterBoxInValidation(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('12334');
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please enter a valid region');

    variantBrowserResetAndWait(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3200000-3100000');
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please enter the correct range.The start of the region should be smaller than the end');

    variantBrowserResetAndWait(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3000000-310000000');
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please enter a region no larger than 1 million bases');

    variantBrowserResetAndWait(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1,13:12233-12234');
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please enter a valid region');
}

function assertAlertWindowShown(driver, message) {
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), config.wait()).then(function (text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function (text) {
            assert(text).equalTo(message);
            safeClick(driver, driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")));
        });
    });
}

function emptyRegionFilter(driver) {
    // 'Chromosomal Location' filter
    driver.findElement(By.name("region")).clear();
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function emptyVariantIDFilter(driver) {
    // 'Variant ID' filter
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Variant ID']")));
    driver.findElement(By.name("snp")).clear();
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function emptyGeneFilter(driver) {
    // 'Ensembl Gene Symbol/Accession' filter
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")));
    driver.findElement(By.name("gene")).clear();
    clickSubmit(driver);
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function variantSearchByGene(driver){
    variantBrowserResetAndWait(driver);
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")));
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, '13');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 32884613);
            chai.assert.operator(text, '<=', 32973805);
        });
    });
}

function checkConsequeceTypeTree(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")));
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'treepanel')]//div[@class='x-tool-img x-tool-expand-bottom']")));
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Transcript Variant')]")).getText().then(function(text){
        assert(text).equalTo("Transcript Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Transcript Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Coding Variant')]")).getText().then(function(text){
        assert(text).equalTo("Coding Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Coding Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]")).getText().then(function(text){
        assert(text).equalTo("inframe_deletion");
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Non-coding Variant')]")).getText().then(function(text){
        assert(text).equalTo("Non-coding Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Non-coding Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'intron_variant')]")).getText().then(function(text){
        assert(text).equalTo("intron_variant");
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Splice Variant')]")).getText().then(function(text){
        assert(text).equalTo("Splice Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Splice Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'splice_donor_variant')]")).getText().then(function(text){
        assert(text).equalTo("splice_donor_variant");
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Regulatory Variant')]")).getText().then(function(text){
        assert(text).equalTo("Regulatory Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Regulatory Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'TFBS_ablation')]")).getText().then(function(text){
        assert(text).equalTo("TFBS_ablation");
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Intergenic Variant')]")).getText().then(function(text){
        assert(text).equalTo("Intergenic Variant");
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Intergenic Variant')]//..//..//..//..//td")).getAttribute('class').then(function(text){
            assert(text).contains('parent');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'upstream_gene_variant')]")).getText().then(function(text){
        assert(text).equalTo("upstream_gene_variant");
    });

    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'treepanel')]//div[@class='x-tool-img x-tool-collapse-top']")));

    return driver;
}

function variantFilterByPolyphenSift(driver){

    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32884771-32884832');

    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")));
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("polyphen")).sendKeys("0.9");
    driver.findElement(By.name("sift")).clear();
    driver.findElement(By.name("sift")).sendKeys("0.02");
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        for (let i = 1; i < 5; i++) {
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[7]/div[text()]")).getText().then(function(text) {
                var polyphen = parseFloat(text);
                return chai.assert.operator(text, '>=', 0.9);
            });
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[8]/div[text()]")).getText().then(function(text) {
                var sift = parseFloat(text);
                return chai.assert.operator(text, '<=', 0.02);
            });
        }
    });
    return driver;
}

function variantFilterByMAF(driver){
    safeClick(driver, driver.findElement(By.id("selectFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")));
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'SpeciesFilterFormPanel')]//div[@class='x-tool-img x-tool-collapse-top']")));
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PositionFilterFormPanel')]//div[@class='x-tool-img x-tool-collapse-top']")));
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PopulationFrequencyFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")));
    safeClick(driver, driver.findElement(By.id("mafOpFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='<']")));
    driver.findElement(By.name("maf")).clear();
    driver.findElement(By.name("maf")).sendKeys("0.3");
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'SpeciesFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")));
    safeClick(driver, driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PositionFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")));
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.xpath("//span[text()='Population Statistics']")));
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), config.wait()).then(function(text) {
        driver.findElements(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
            for (var i = 0; i < rows.length; i++){
                rows[i].findElement(By.className("population-stats-grid")).getAttribute('id').then(function(id){
                    for (var i = 1; i <=6; i++){
                        //check MAF
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table["+i+"]//td[3]/div")).getText().then(function(text){
                            if(isNaN(text)){
                                assert(text).equalTo('NA');
                            } else{
                                chai.assert.operator(text, '<', 0.3);
                            }

                        },function(err) {});
                    }
                });
            }

        });

    },function(err) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//h5")).then(function(text) {
            assert(text).equalTo('Currently for 1000 Genomes Project data only');
        },function(err) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[@class='popstats-no-data']")).getText().then(function(text){
                assert(text).equalTo('No Population data available');
            });
        });
    });
    return driver;
}

function checkAnnotationNotification(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Cow / Bos_taurus_UMD_3.1']")));
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.id("annotVersion-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='VEP version 82 - Cache version 82']")));
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.className("vep_text")), 10000).then(function(text) {
        driver.findElement(By.className("vep_text")).getText().then(function(text){
            assert(text).matches(/[v][8][2]/);
        });
    });
    return driver;
}

function checkGeneIdEnsemblLink(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    var dataXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//table//td[1]/div//a";
    driver.wait(until.elementLocated(By.xpath(dataXpath)), config.wait()).then(function() {
        driver.findElement(By.xpath(dataXpath)).then(function(link){
            link.getAttribute('href').then(function(href){
                link.getText().then(function(geneId){
                    assert(href).contains('http://www.ensembl.org/Multi/Search/Results?q='+ geneId +';facet_feature_type=Gene');
                })
            })
        });
    });
}

function checkGeneSymbolEnsemblLink(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    var dataXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//table//td[2]/div//a";
    driver.wait(until.elementLocated(By.xpath(dataXpath)), config.wait()).then(function() {
        driver.findElement(By.xpath(dataXpath)).then(function(link){
            link.getAttribute('href').then(function(href){
                link.getText().then(function(geneSymbol){
                    assert(href).contains('http://www.ensembl.org/Multi/Search/Results?q='+geneSymbol+';facet_feature_type=Gene');
                })
            })
        });
    });
}

function checkTranscriptIdEnsemblLink(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    var dataXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//table//td[3]/div//a";  // any element
    driver.wait(until.elementLocated(By.xpath(dataXpath)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(dataXpath)).then(function(link){
            link.getAttribute('href').then(function(href){
                link.getText().then(function(transcriptId){
                    assert(href).contains('http://www.ensembl.org/Multi/Search/Results?q='+transcriptId+';facet_feature_type=Transcript');
                })
            })
        });
    });
}

function variantAnnotationTab(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver,driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        variantBrowser.annotationTab(driver);
    });
    return driver;
}
function variantFilesTab(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver,driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.xpath("//span[text()='Files']")));
    variantBrowser.filesTab(driver);
    return driver;
}
function variantGenotypesTab(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver,driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:48000000-49000000');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        safeClick(driver, driver.findElement(By.xpath("//span[text()='Genotypes']")));
        safeClick(driver, driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]")));
        variantBrowser.genotypesTab(driver);
    });
    return driver;
}

function variantGenotypesTabWithHaploidGenotypes(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Pig / Sscrofa11.1']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('X:9610000-9611000');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        safeClick(driver, driver.findElement(By.xpath("//span[text()='Genotypes']")));
        safeClick(driver, driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]")));
        variantBrowser.genotypesTab(driver);
    });
    return driver;
}

function variantPopulationTab(driver){
    safeClick(driver, driver.findElement(By.id("speciesFilter-trigger-picker")));
    safeClick(driver, driver.findElement(By.xpath("//li[text()='Human / GRCh37']")));
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    clickSubmit(driver);
    waitForVariantsToLoad(driver);
    safeClick(driver, driver.findElement(By.xpath("//span[text()='Population Statistics']")));
    variantBrowser.populationTab(driver);
    return driver;
}

function variantBrowserResetAndWait(driver) {
    driver.executeScript("document.body.scrollTop = document.documentElement.scrollTop = 0;");
    safeClick(driver, driver.findElement(By.xpath("//li//a[text()='Variant Browser']")));
    safeClick(driver, driver.findElement(By.xpath("//div[contains(@id,'VariantWidgetPanel')]//span[text()='Reset']")));
    waitForVariantsToLoad(driver);
}

function waitForVariantsToLoadGeneral(driver, waitXpath) {
    var maskXpath = "//div[contains(concat(' ', normalize-space(@class),' '), ' x-mask ') and not(contains(@style, 'display: none'))]";
    // First, *optionally* wait for the loading mask to appear
    driver.wait(until.elementLocated(By.xpath(maskXpath)), config.wait()).then(function() {
        driver.wait(function () {
                // Next, wait for the mask to disappear
                return driver.findElements(By.xpath(maskXpath)).then(function (elements) {
                    return elements.length === 0
                });
            },
            config.wait()
        ).then(function () {
            // Finally, wait for the variants to load
            driver.wait(until.elementLocated(By.xpath(waitXpath)), config.wait())
        })
    }, function(err) {
        console.log('WARN: Mask did not appear (which is alright, the webdriver most likely just missed it)')
    })
}

function waitForVariantsToLoad(driver) {
    return waitForVariantsToLoadGeneral(driver, "//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]//div");
}

function waitForEmptyVariantsToLoad(driver) {
    return waitForVariantsToLoadGeneral(driver, "//div[@id='variant-browser-grid-body']//div[contains(string(), 'No records to display')]")
}

function safeClick(driver, element) {
    // Waits until the element is visible and enabled, then clicks it
    driver.wait(function () {
            return element.isDisplayed().then(function (displayed) {
                if (!displayed) return false;
                return element.isEnabled();
            })
        },
        config.wait()
    ).then(function () { element.click(); })
}

function clickSubmit(driver) {
    driver.executeScript("document.body.scrollTop = document.documentElement.scrollTop = 0;");
    safeClick(driver, driver.findElement(By.id("vb-submit-button")));
}

function variantResetCheck(driver) {
    driver.findElement (By.xpath ("//div[contains(@id,'VariantWidgetPanel')]//span[text()='Reset']")).click ();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).getText().then(function(text){
        chai.assert.equal(text, 'CM000377.2:3000000-3100000');
    });
    driver.wait (until.elementLocated (By.xpath ("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then (function (text) {
        driver.findElement (By.xpath ("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText ().then (function (text) {
            chai.assert.equal (text, '1');
        });
    });
}
