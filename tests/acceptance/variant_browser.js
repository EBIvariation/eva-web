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
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        waitForVariantsToLoad(driver);
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
        test.it('Search term "rs68485566,rs68485569,rs68485571" match with column Variant ID values', function() {
            variantSearchByMutlipleIds(driver, ["rs68485566","rs68485569","rs68485571"]);
        });
    });

    test.describe('search by Species and Chromosomal Location', function() {
        test.it('Search by species  "Goat / CHIR_1.0" and location "2:4000000-4100000"  where column "Chr"  should match with "2" and Position should be between "4000000-4100000"', function() {
            variantSearchBySpeciesandChrLocation(driver);
        });
    });

    test.describe('Position Filter validate with special characters', function() {
        test.it('Search by species  "Mosquito / AaegL3" and location "supercont1.18:165624-305624"  where column "Chr"  should match with "supercont1.18",\n' +
                'Search by species  "Mosquito / AgamP3" and location "X:10000000-11000000"  where column "Chr"  should match with "X"\n' +
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
            'Variant ID ex: rs541552030 should have "http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs="\n' +
            'Variant ID ex: ss1225720736 should have "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ss.cgi?subsnp_id="\n', function() {
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
            variantFilesTab(driver);
        });
        test.it('Genotypes Tab should not be empty and no duplicate Items', function() {
            variantGenotypesTab(driver);
        });
        test.it('Population Statistics should not be empty and no duplicate Items ', function() {
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
            checkGeneSymbolEnsemblLink(driver);
        });
        test.it('should match with Transcript ID,\n' +
            'Transcript ID ex ENST00000530893: should have "http://www.ensembl.org/Multi/Search/Results?q=ENST00000530893;facet_feature_type=Transcript"\n', function() {
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
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys(rs);
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, rs);
        });
    });
    return driver;
}

function variantSearchByMutlipleIds(driver, rsList){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys(rsList.join(","));
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    var checkedRsList = [];
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")),
        config.wait()).then(function(text) {
            for (let i = 0; i < rsList.length; i++) {
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
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:4000000-4100000');
    driver.findElement(By.id("vb-submit-button")).click();
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
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs541552030");
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[contains(@class,'dbsnp_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[9]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[9]/div//a[contains(@class,'dbsnp_link')]")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:4000000-4100000');
    driver.findElement(By.id("vb-submit-button")).click();
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
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs541552030");
    driver.findElement(By.id("vb-submit-button")).click();
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
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('X:10000000-11000000');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('X');
        });
    });
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1!~13:12233-12234');
    driver.findElement(By.id("vb-submit-button")).click();
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
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please enter a valid region');

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3200000-3100000');
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please enter the correct range.The start of the region should be smaller than the end');

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3000000-310000000');
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please enter a region no larger than 1 million bases');

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1,13:12233-12234');
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please enter a valid region');

    variantBrowserResetAndWait(driver);
}

function assertAlertWindowShown(driver, message) {
    config.sleep(driver);
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), config.wait()).then(function (text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function (text) {
            assert(text).equalTo(message);
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });
}

function emptyRegionFilter(driver) {
    // 'Chromosomal Location' filter
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function emptyVariantIDFilter(driver) {
    // 'Variant ID' filter
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function emptyGeneFilter(driver) {
    // 'Ensembl Gene Symbol/Accession' filter
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.id("vb-submit-button")).click();
    assertAlertWindowShown(driver, 'Please request a variant ID, genomic location or gene name/symbol');
    variantBrowserResetAndWait(driver);
}

function variantSearchByGene(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, '13');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 32884647);
            chai.assert.operator(text, '<=', 32973805);
        });
    });
}

function checkConsequeceTypeTree(driver){
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'treepanel')]//div[@class='x-tool-img x-tool-expand-bottom']")).click();
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

    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'treepanel')]//div[@class='x-tool-img x-tool-collapse-top']")).click();

    return driver;
}

function variantFilterByPolyphenSift(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")).click();
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("polyphen")).sendKeys("0.9");
    driver.findElement(By.name("sift")).clear();
    driver.findElement(By.name("sift")).sendKeys("0.02");
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), config.wait()).then(function(text) {
        for (i = 1; i < 11; i++) {
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

    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("sift")).clear();

    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//div[@class='x-tool-img x-tool-collapse-top']")).click();

    return driver;
}

function variantFilterByMAF(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PopulationFrequencyFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")).click();
    driver.findElement(By.id("mafOpFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='<']")).click();
    driver.findElement(By.name("maf")).clear();
    driver.findElement(By.name("maf")).sendKeys("0.3");
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
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
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PopulationFrequencyFilterFormPanel')]//div[@class='x-tool-img x-tool-collapse-top']")).click();

    return driver;
}

function checkAnnotationNotification(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//li[text()='Mosquito / AaegL3']")));
    driver.findElement(By.xpath("//li[text()='Mosquito / AaegL3']")).click();
    driver.findElement(By.id("annotVersion-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='VEP version 89 - Cache version 35']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.className("vep_text")), 10000).then(function(text) {
        driver.findElement(By.className("vep_text")).getText().then(function(text){
            assert(text).matches(/[v][8][9]/);
        });
    },function(err) {
    });
    return driver;
}

function checkGeneIdEnsemblLink(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    var geneIDHeaderXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//div[contains(@id,'headercontainer')]//span[contains(.,'Gene ID')]";
    // Click the header twice to sort by Gene ID and force a non-blank Gene ID
    driver.findElement(By.xpath(geneIDHeaderXpath)).click();
    driver.findElement(By.xpath(geneIDHeaderXpath)).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[1]/div[//a/text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[1]/div//a")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[1]/div[//a/text()]")).getText().then(function(geneID){
                assert(text).contains('http://www.ensembl.org/Multi/Search/Results?q='+geneID+';facet_feature_type=Gene');
            });
        });
    });
}

function checkGeneSymbolEnsemblLink(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    var geneSymbolHeaderXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//div[contains(@id,'headercontainer')]//span[contains(.,'Gene Symbol')]";
    // Click the header twice to sort by Gene ID and force a non-blank Gene symbol
    driver.findElement(By.xpath(geneSymbolHeaderXpath)).click();
    driver.findElement(By.xpath(geneSymbolHeaderXpath)).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[2]/div[//a/text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[2]/div//a")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[2]/div[//a/text()]")).getText().then(function(geneSymbol){
                assert(text).contains('http://www.ensembl.org/Multi/Search/Results?q='+geneSymbol+';facet_feature_type=Gene');
            });
        });
    });
}

function checkTranscriptIdEnsemblLink(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    var geneTranscriptIDXpath = "//div[contains(@id,'VariantAnnotationDataPanel')]//div[contains(@id,'headercontainer')]//span[contains(.,'Transcript ID')]";
    // Click the header twice to sort by Transcript ID and force a non-blank Gene ID
    driver.findElement(By.xpath(geneTranscriptIDXpath)).click();
    driver.findElement(By.xpath(geneTranscriptIDXpath)).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[3]/div[//a/text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[3]/div//a")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[contains(@id,'VariantAnnotationDataPanel')]//table[1]//td[3]/div[//a/text()]")).getText().then(function(TranscriptID){
                assert(text).contains('http://www.ensembl.org/Multi/Search/Results?q='+TranscriptID+';facet_feature_type=Transcript');
            });
        });
    });
}

function variantAnnotationTab(driver){
    variantBrowserResetAndWait(driver);
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        variantBrowser.annotationTab(driver);
    });
    return driver;
}
function variantFilesTab(driver){
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.xpath("//span[text()='Files']")).click();
    config.sleep(driver);
    variantBrowser.filesTab(driver);
    return driver;
}
function variantGenotypesTab(driver){
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:48000000-49000000');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then(function(text) {
        driver.findElement(By.xpath("//span[text()='Genotypes']")).click();
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]")).click();
        variantBrowser.genotypesTab(driver);
    });
    return driver;
}

function variantPopulationTab(driver){
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('13:32889611-32973805');
    driver.findElement(By.id("vb-submit-button")).click();
    waitForVariantsToLoad(driver);
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
    variantBrowser.populationTab(driver);
    return driver;
}

function variantBrowserResetAndWait(driver) {
    driver.findElement (By.xpath ("//div[contains(@id,'VariantWidgetPanel')]//span[text()='Reset']")).click ();
    waitForVariantsToLoad(driver);
}

function waitForVariantsToLoad(driver) {
    driver.wait(until.elementLocated(
                    By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]//div")), config.wait());
}

function variantResetCheck(driver) {
    driver.findElement (By.xpath ("//div[contains(@id,'VariantWidgetPanel')]//span[text()='Reset']")).click ();
    config.sleep(driver);
    driver.findElement(By.name("region")).getText().then(function(text){
        chai.assert.equal(text, '13:32889611-32973805');
    });
    driver.wait (until.elementLocated (By.xpath ("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), config.wait()).then (function (text) {
        driver.findElement (By.xpath ("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText ().then (function (text) {
            chai.assert.equal (text, '13');
        });
    });
}
