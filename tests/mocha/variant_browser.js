var config = require('./config.js');
config.loadModules();

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


});

function variantSearchById(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs666");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[3]/div/span[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[3]/div/span[text()]")).getText().then(function(text) {
            assert(text).equalTo('rs666');
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            assert(text).greaterThanEqualTo(4000000);
            assert(text).lessThanEqualTo(4100000);
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('13');
        });
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            assert(text).greaterThanEqualTo(32889611);
            assert(text).lessThanEqualTo(32973805);
        });
    });
}
function variantFilterByPolyphenSift(driver){
    driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//img[@class='x-tool-img x-tool-expand-bottom']")).click();
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("polyphen")).sendKeys("0.9");
    driver.findElement(By.name("sift")).clear();
    driver.findElement(By.name("sift")).sendKeys("0.02");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        for (i = 1; i < 11; i++) {
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[7]/div[text()]")).getText().then(function(text) {
                var polyphen = parseFloat(text);
                return assert(polyphen).greaterThanEqualTo(0.9);
            });
            driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[8]/div[text()]")).getText().then(function(text) {
                var sift = parseFloat(text);
                return assert(sift).lessThanEqualTo(0.02);
            });
        }
    });

    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("vb-submit-button")).click();

    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText().then(function(text) {
            assert(text).equalTo('No records to display');
        });
    });
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("sift")).clear();

    return driver;
}


function variantAnnotationTab(driver){
    driver.findElement(By.xpath("//span[text()='Reset']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//div[contains(@id,'_annotatPagingToolbar-targetEl')]//div[contains(text(), 'Transcripts 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (var i = 1; i <= rows; i++) {
                //check Ensemble Gene ID
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[1]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^[A-Z]+/);
                });
                //check Ensemble Gene symbol
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[2]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^\w[\w\d-]+$/);
                });
                //check Ensemble Transcript ID
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[3]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^[A-Z]+/);
                });
                //check SO terms
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[4]/div/tpl[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^[a-zA-Z0-9_]+/);
                });
                //check Biotype
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[5]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^[a-zA-Z0-9_]+/);
                });
                //check codon
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[6]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^\w+\/\w+$/);
                });
                //check cDna position
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[7]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|\d$/);
                });
                //check AA change
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[8]/div[text()]")).getText().then(function(text){
                    assert(text).matches( /^-$|^\w+\/\w+$/);
                });
                //check Polyphen
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[9]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^\d+([,.]\d+)?$/);
                });
                //check Sift
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[9]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/^-$|^\d+([,.]\d+)?$/);
                });
            }
        });

    });

    return driver;
}
function variantFilesTab(driver){
    driver.findElement(By.xpath("//span[text()='Files']")).click();
    driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[5]")).click();
    driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        var filesArray = new Array();
        driver.findElements(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
            for (var i = 0; i < rows.length; i++){
//                check for duplication study
                rows[i].findElement(By.tagName("a")).getAttribute('href').then(function(text){
                    text = text.split("?");
                    chai.expect('span[class="stats-panel-study-title"] > a[href="?'+text[1]+'"]').dom.to.have.count(1)
                });
                // check for attributes table
                rows[i].findElement(By.tagName("table")).getText().then(function(text){
                    chai.assert.isNotNull(text);
                });
                //check for VCF Data
                rows[i].findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
                rows[i].findElement(By.tagName("pre")).getText().then(function(vcftext){
                    assert(vcftext).startsWith('##fileformat=');
                });
                //check for duplicate content
                rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                    driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                        chai.assert.notInclude(filesArray, config.hashCode(text))
                        filesArray.push(config.hashCode(text));
                    });

                });
            }

        });
    });
    return driver;
}
function variantGenotypesTab(driver){
    driver.findElement(By.xpath("//span[text()='Genotypes']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div")).then(function(text) {
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div//a[text()]")), 10000).then(function(text) {
            driver.findElements(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                var genotypesArray = new Array();
                for (var i = 0; i < rows.length; i++){
                    // check for duplication study
                    rows[i].findElement(By.tagName("a")).getAttribute('href').then(function(text){
                        text = text.split("?");
                        chai.expect('span[class="genotype-grid-study-title"] > a[href="?'+text[1]+'"]').dom.to.have.count(1);
                    });
                    // check for pie chart study
                    rows[i].findElement(By.className("highcharts-container")).getAttribute('id').then(function(id){
                        chai.expect('#'+id).dom.to.have.count(1);
                    });
                    rows[i].findElement(By.xpath("//div[contains(@class,'genotype-grid')]//table[1]//td[1]/div[text()]")).getText();
                    //check for duplicate content
                    rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                        driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                            chai.assert.notInclude(genotypesArray, config.hashCode(text))
                            genotypesArray.push(config.hashCode(text));
                        });
                    });
                }
            });
        });
    },function(err) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//p[@class='genotype-grid-no-data']")).then(function(text){
            driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//p[@class='genotype-grid-no-data']")).getText.then(function(text) {
                assert(text).equalTo('No Genotypes data available');
            });
        },function(err) {
        });
    });

    return driver;
}

function variantPopulationTab(driver){
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).then(function(webElement) {
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
            driver.findElements(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                var popStatsArray = new Array();
                for (var i = 0; i < rows.length; i++){
                    // check for duplication study
                    rows[i].findElement(By.tagName("a")).getAttribute('href').then(function(text){
                        text = text.split("?");
                        chai.expect('span[class="popStats-panel-study-title"] > a[href="?'+text[1]+'"]').dom.to.have.count(1);
                    });
                    rows[i].findElement(By.className("population-stats-grid")).getAttribute('id').then(function(id){
                        //check Population column
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[2]/div")).getText().then(function(text){
                            assert(text).matches(/^[a-zA-Z0-9\-_.,]+$/);
                        });
                        //check MAF
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[3]/div")).getText().then(function(text){
                            assert(text).matches(/^[+-]?\d+(?:\.\d{1,3})?$/);
                        });
                        //check MAF allele
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[4]/div")).getText().then(function(text){
                            assert(text).matches(/^-$|^[ACGT]+$/);
                        });
                        //check missing alleles
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[5]/div")).getText().then(function(text){
                            assert(text).matches(/^\d+$/);
                        });
                        //check missing genotypes
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[6]/div")).getText().then(function(text){
                           assert(text).matches( /^\d+$/);
                        });
                        //check pie chart is present for every ALL population.
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table//td/div[contains(text(),'ALL')]/../..//div[contains(@class,'x-grid-row-expander')]")).click().then(function(){
                            driver.findElement(By.xpath("//div[@id='" + id + "']//table//div[@class='highcharts-container']")).getAttribute('id').then(function(chartID){
                                chai.expect('#'+chartID).dom.to.have.count(1);
                            });
                        });
                    });
                    //check for duplicate content
                    rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                        driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                            chai.assert.notInclude(popStatsArray, config.hashCode(text))
                            popStatsArray.push(config.hashCode(text));
                        });
                    });
                }
            });
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

