var config = require('./config.js');
config.loadModules();
var variantBrowser = require('./variant_browser_bottom_panel_tests.js');
var clinicalBrowser = require('./clinvar_bottom_panel_tests.js');

test.describe('Variant Browser ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('search by Variant ID', function() {
        test.it('Search term "rs666" match with column Variant ID', function() {
            variantSearchById(driver);
        });
    });

    test.describe('search by Species and Chromosomal Location', function() {
        test.it('Search by species  "Goat / CHIR_1.0" and location "2:4000000-4100000"  where column "Chr"  should match with "2" and Position should be between "4000000-4100000"', function() {
            variantSearchBySpeciesandChrLocation(driver);
        });
    });


    test.describe('Position Filter validate with special characters', function() {
        test.it('Search by species  "Mosquito / AaegL3" and location "supercont1.18:165624-165624"  where column "Chr"  should match with "supercont1.18",\n' +
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

    test.describe('search by Gene', function() {
        test.it('Search by "BRCA2" should match column "Chr" with "13"', function() {
            variantSearchByGene(driver);
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

    test.describe('check dbSNP link href', function() {
        test.it('should match with Variant ID,\n' +
            'Variant ID ex: rs541552030 should have "http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs="\n' +
            'Variant ID ex: ss1225720736 should have "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ss.cgi?subsnp_id="\n', function() {
            checkdbSNPLink(driver);
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
        test.it('Clinical Assertion Tab should not be empty and no duplicate items ', function() {
            clinicalAssertionTab(driver);
        });
    });

    test.describe('Show data in Clinical Browser', function() {
        test.it('Clicking "Show in Clinical Browser" button should go to "Clinical Browser" and click back should go back to "Variant Browser"', function() {
            showDataInClinicalBrowser(driver);
        });
    });


});

function variantSearchById(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs666");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, 'rs666');
        });
    });
    return driver;
}
function variantSearchBySpeciesandChrLocation(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")).click();
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:4000000-4100000');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 4000000);
            chai.assert.operator(text, '<=', 4100000);
        });
    });
}

function checkdbSNPLink(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs541552030");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[@class='dbsnp_link']")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[@class='dbsnp_link']")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+variantID);
            });
        });
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Goat / CHIR_1.0']")).click();
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:4000000-4100000');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[9]/div//a[@class='dbsnp_link']")).getAttribute('href').then(function(text){
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[3]/div[text()]")).getText().then(function(variantID){
                assert(text).equalTo('http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ss.cgi?subsnp_id='+variantID.substring(2));
            });
        });
    });
}

function positionFilterBoxValidation(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AaegL3']")).click();
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('supercont1.18:165624-165624');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('supercont1.18');
        });
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('X:10000000-11000000');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('X');
        });
    });

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1!~13:12233-12234');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText().then(function(text){
            assert(text).equalTo('No records to display');
        });
    });
}

function positionFilterBoxInValidation(driver){
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('12334');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function(text){
            assert(text).equalTo('Please enter a valid region');
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3200000-3100000');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function(text){
            assert(text).equalTo('Please enter the correct range.The start of the region should be smaller than the end');
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1:3000000-310000000');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function(text){
            assert(text).equalTo('Please enter a region no larger than 1 million bases');
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });

    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('1,13:12233-12234');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function(text){
            assert(text).equalTo('Please enter a valid region');
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });
}

function variantSearchByGene(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 30000).then(function(text) {
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
function variantFilterByPolyphenSift(driver){
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")).click();
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("polyphen")).sendKeys("0.9");
    driver.findElement(By.name("sift")).clear();
    driver.findElement(By.name("sift")).sendKeys("0.02");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 30000).then(function(text) {
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

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("vb-submit-button")).click();

    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), 30000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText().then(function(text) {
            assert(text).equalTo('No records to display');
        });
    });
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("sift")).clear();

    return driver;
}

function variantFilterByMAF(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'PopulationFrequencyFilterFormPanel')]//div[@class='x-tool-img x-tool-expand-bottom']")).click();
    driver.findElement(By.id("mafOpFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='<=']")).click();
    driver.findElement(By.name("maf")).clear();
    driver.findElement(By.name("maf")).sendKeys("0.3");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
        driver.findElements(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
            for (var i = 0; i < rows.length; i++){
                rows[i].findElement(By.className("population-stats-grid")).getAttribute('id').then(function(id){
                    for (var i = 1; i <=6; i++){
                        //check MAF
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table["+i+"]//td[3]/div")).getText().then(function(text){
                            chai.assert.operator(text, '<', 0.3);
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


function variantAnnotationTab(driver){
    driver.findElement(By.xpath("//span[text()='Reset']")).click();
    variantBrowser.annotationTab(driver);
    return driver;
}
function variantFilesTab(driver){
    driver.findElement(By.xpath("//span[text()='Files']")).click();
    driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
    variantBrowser.filesTab(driver);
    return driver;
}
function variantGenotypesTab(driver){
    driver.findElement(By.xpath("//span[text()='Genotypes']")).click();
    driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
    variantBrowser.genotypesTab(driver);
    return driver;
}

function variantPopulationTab(driver){
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
    variantBrowser.populationTab(driver);
    return driver;
}

function clinicalAssertionTab(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("region")).clear();
    driver.findElement(By.name("region")).sendKeys('2:48009816-48009816');
    driver.findElement(By.id("vb-submit-button")).click();
    driver.findElement(By.xpath("//span[text()='Clinical Assertion']")).click();
    clinicalBrowser.clinVarAssertionTab(driver, 'variant-widget');
    return driver;
}

function showDataInClinicalBrowser(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
    driver.findElement(By.name("gene")).clear();
    driver.findElement(By.name("gene")).sendKeys("BRCA2");
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 30000).then(function(text) {
        driver.findElement(By.id("clinvar-button")).click();
    });
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[3]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('BRCA2');
        });
    });
    driver.navigate().back();

    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 30000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            chai.assert.equal(text, '13');
        });
    });
}

