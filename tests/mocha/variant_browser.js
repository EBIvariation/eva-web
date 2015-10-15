var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Variant Browser', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('search by Variant ID', function() {
        driver.findElement(By.id("cookie-dismiss")).click();
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        //search by Variant ID
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver.findElement(By.name("snp")).clear();
        driver.findElement(By.name("snp")).sendKeys("rs666");
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');
    });
    test.it('search by Species', function() {
        //search by Chromosomal Location
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.id("speciesFilter-trigger-picker")).click();

        //search by species
        driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        driver.findElement(By.id("variant-browser-grid-body"));
        until.elementIsVisible(driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")));
        var mValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(mValue).equalTo('X');

    });
    test.it('search by Gene', function() {
        // search by gene
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver.findElement(By.name("gene")).clear();
        driver.findElement(By.name("gene")).sendKeys("BRCA2");
        driver.findElement(By.id("speciesFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Human / GRCh37']")).click();
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        var gValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(gValue).contains('13');
    });

    test.it('search by Polyphen and Sift Filters', function() {
        driver.findElement(By.xpath("//div[@class='variant-browser-option-div form-panel-variant-filter']//div[contains(@id,'ProteinSubstitutionScoreFilterFormPanel')]//img[@class='x-tool-img x-tool-expand-bottom']")).click();
        driver.findElement(By.name("polyphen")).clear();
        driver.findElement(By.name("polyphen")).sendKeys("0.9");
        driver.findElement(By.name("sift")).clear();
        driver.findElement(By.name("sift")).sendKeys("0.02");
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
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
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.id("vb-submit-button")).click();
        sleep(3);
        var empty  = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText();
        assert(empty).equalTo('No records to display');
        driver.findElement(By.name("polyphen")).clear();
        driver.findElement(By.name("sift")).clear();
    });

    test.it('Annotation Tab', function() {
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
        sleep(3);
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
    });
    test.it('Files Tab', function() {
        driver.findElement(By.xpath("//span[text()='Files']")).click();
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
        sleep(2);
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
        driver.findElement(By.tagName("pre")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '-')]")).click();
    });

    test.it('Genotypes Tab', function() {
        driver.findElement(By.xpath("//span[text()='Genotypes']")).click();
        sleep(1);
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//table[1]//td[1]/div[text()]")).getText();

    });

    test.it('Population Statistics', function() {
        driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
        sleep(1);
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        sleep(2);
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        sleep(2);

    });
});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

