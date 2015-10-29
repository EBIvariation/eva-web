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

    test.it('should be able to search by Variant ID', function() { variantSearchById(driver) });
    test.it('should be able to search by Species', function() { variantSearchBySpecies(driver) });
    test.it('should be able to search by Gene', function() { variantSearchByGene(driver) });
    test.it('should be able to filter by Polyphen and Sift Filters', function() { variantFilterByPolyphenSift(driver) });
    test.it('Annotation Tab should not be empty', function() { variantAnnotationTab(driver) });
    test.it('Files Tab should not be empty', function() { variantFilesTab(driver) });
    test.it('Genotypes Tab should not be empty', function() { variantGenotypesTab(driver) });
    test.it('Population Statistics should not be empty', function() { variantPopulationTab(driver) });
});

function variantSearchById(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
    driver.findElement(By.name("snp")).clear();
    driver.findElement(By.name("snp")).sendKeys("rs666");
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');
    });

    return driver;
}
function variantSearchBySpecies(driver){
    driver.findElement(By.id("selectFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.id("speciesFilter-trigger-picker")).click();
    driver.findElement(By.xpath("//li[text()='Mosquito / AgamP3']")).click();
    driver.findElement(By.id("vb-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")), 10000).then(function(text) {
        var mValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(mValue).equalTo('X');
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
        var mValue = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
        assert(mValue).equalTo('13');
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
        var empty  = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//div[@class='x-grid-empty']")).getText();
        assert(empty).equalTo('No records to display');
    });
    driver.findElement(By.name("polyphen")).clear();
    driver.findElement(By.name("sift")).clear();

    return driver;
}


function variantAnnotationTab(driver){
    driver.findElement(By.xpath("//span[text()='Reset']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
    });

    return driver;
}
function variantFilesTab(driver){
    driver.findElement(By.xpath("//span[text()='Files']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
    driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
        driver.findElement(By.tagName("pre")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '-')]")).click();
    });

    return driver;
}
function variantGenotypesTab(driver){
    driver.findElement(By.xpath("//span[text()='Genotypes']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//table[1]//td[1]/div[text()]")).getText();
    });

    return driver;
}

function variantPopulationTab(driver){
    driver.findElement(By.xpath("//span[text()='Population Statistics']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        });
    });

    return driver;
}

