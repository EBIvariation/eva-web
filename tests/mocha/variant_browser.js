var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Variant Browser', function() {
    var driver1;
    var driver2;
    test.before(function() {
        driver1 = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver1.manage().window().maximize();
        driver1.get(baseURL); 
        driver2 = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        driver2.manage().window().maximize();
        driver2.get(baseURL);
    });

    test.after(function() {
        driver1.quit();
        driver2.quit();
    });

    test.it('search by Variant ID', function() {
        driver1.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver1.findElement(By.id("cookie-dismiss")).click();
        });
        driver1.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        //search by Variant ID
        driver1.findElement(By.id("selectFilter-trigger-picker")).click();
        driver1.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver1.findElement(By.name("snp")).clear();
        driver1.findElement(By.name("snp")).sendKeys("rs666");
        driver1.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
            assert(value).equalTo('17');
        });

        driver2.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver2.findElement(By.id("cookie-dismiss")).click();
        });
        driver2.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        //search by Variant ID
        driver2.findElement(By.id("selectFilter-trigger-picker")).click();
        driver2.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver2.findElement(By.name("snp")).clear();
        driver2.findElement(By.name("snp")).sendKeys("rs666");
        driver2.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
            assert(value).equalTo('17');
        });

    });
    test.it('search by Species', function() {
        //search by Chromosomal Location
        driver1.findElement(By.id("selectFilter-trigger-picker")).click();
        driver1.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver1.findElement(By.id("speciesFilter-trigger-picker")).click();

        //search by species
        driver1.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
        driver1.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var mValue = driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
            assert(mValue).equalTo('X');
        });
        
        driver2.findElement(By.id("selectFilter-trigger-picker")).click();
        driver2.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver2.findElement(By.id("speciesFilter-trigger-picker")).click();

        //search by species
        driver2.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
        driver2.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var mValue = driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
            assert(mValue).equalTo('X');
        });

    });
    test.it('search by Gene', function() {
        // search by gene
        driver1.findElement(By.id("selectFilter-trigger-picker")).click();
        driver1.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver1.findElement(By.name("gene")).clear();
        driver1.findElement(By.name("gene")).sendKeys("BRCA2");
        driver1.findElement(By.id("speciesFilter-trigger-picker")).click();
        driver1.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
        driver1.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            var mValue = driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(mValue).equalTo('13');
        });
        
        // search by gene
        driver2.findElement(By.id("selectFilter-trigger-picker")).click();
        driver2.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver2.findElement(By.name("gene")).clear();
        driver2.findElement(By.name("gene")).sendKeys("BRCA2");
        driver2.findElement(By.id("speciesFilter-trigger-picker")).click();
        driver2.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
        driver2.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            var mValue = driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(mValue).equalTo('13');
        });

    });

    test.it('search by Polyphen and Sift Filters', function() {
        driver1.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//img[@class='x-tool-img x-tool-expand-bottom']")).click();
        driver1.findElement(By.name("polyphen")).clear();
        driver1.findElement(By.name("polyphen")).sendKeys("0.9");
        driver1.findElement(By.name("sift")).clear();
        driver1.findElement(By.name("sift")).sendKeys("0.02");
        driver1.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            for (i = 1; i < 11; i++) {
                driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[7]/div[text()]")).getText().then(function(text) {
                    var polyphen = parseFloat(text);
                    return assert(polyphen).greaterThanEqualTo(0.9);
                });
                driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[8]/div[text()]")).getText().then(function(text) {
                    var sift = parseFloat(text);
                    return assert(sift).lessThanEqualTo(0.02);
                });
            }
        });

        driver1.findElement(By.id("selectFilter-trigger-picker")).click();
        driver1.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver1.findElement(By.id("vb-submit-button")).click();

        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), 10000).then(function(text) {
            var empty  = driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText();
            assert(empty).equalTo('No records to display');
        });
        driver1.findElement(By.name("polyphen")).clear();
        driver1.findElement(By.name("sift")).clear();
        
        driver2.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//img[@class='x-tool-img x-tool-expand-bottom']")).click();
        driver2.findElement(By.name("polyphen")).clear();
        driver2.findElement(By.name("polyphen")).sendKeys("0.9");
        driver2.findElement(By.name("sift")).clear();
        driver2.findElement(By.name("sift")).sendKeys("0.02");
        driver2.findElement(By.id("vb-submit-button")).click();
//        sleep(3);
        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            for (i = 1; i < 11; i++) {
                driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[7]/div[text()]")).getText().then(function(text) {
                    var polyphen = parseFloat(text);
                    return assert(polyphen).greaterThanEqualTo(0.9);
                });
                driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table["+i+"]//td[8]/div[text()]")).getText().then(function(text) {
                    var sift = parseFloat(text);
                    return assert(sift).lessThanEqualTo(0.02);
                });
            }
        });

        driver2.findElement(By.id("selectFilter-trigger-picker")).click();
        driver2.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver2.findElement(By.id("vb-submit-button")).click();

        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")), 10000).then(function(text) {
            var empty  = driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText();
            assert(empty).equalTo('No records to display');
        });
        driver2.findElement(By.name("polyphen")).clear();
        driver2.findElement(By.name("sift")).clear();
    });

    test.it('Annotation Tab', function() {
        driver1.findElement(By.xpath("//span[text()='Reset']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
        }); 
        
        driver2.findElement(By.xpath("//span[text()='Reset']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
        });

    });
    test.it('Files Tab', function() {
        driver1.findElement(By.xpath("//span[text()='Files']")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
            driver1.findElement(By.tagName("pre")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '-')]")).click();
        });
        
        driver2.findElement(By.xpath("//span[text()='Files']")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
            driver2.findElement(By.tagName("pre")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '-')]")).click();
        });

    });

    test.it('Genotypes Tab', function() {
        driver1.findElement(By.xpath("//span[text()='Genotypes']")).click();
//        sleep(1);
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div[@class='highcharts-container']")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//table[1]//td[1]/div[text()]")).getText();
        });
        
        driver2.findElement(By.xpath("//span[text()='Genotypes']")).click();
//        sleep(1);
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div[@class='highcharts-container']")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//table[1]//td[1]/div[text()]")).getText();
        });


    });

    test.it('Population Statistics', function() {
        driver1.findElement(By.xpath("//span[text()='Population Statistics']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
            driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
                driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
            });
        }); 
        
        driver2.findElement(By.xpath("//span[text()='Population Statistics']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
            driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
                driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
            });
        });

    });
});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

