var config = require('./config.js');
config.loadModules();

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

    test.it('search by ClinVar Accession', function() { clinVarSearchByAccession(driver) });

    test.it('search by Chromosomal Location', function() { clinVarSearchByLocation(driver) });

    test.it('search by Gene', function() { clinVarSearchByGene(driver) });

    test.it('search by Trait', function() { clinVarSearchByTrait(driver) });

    test.it('Filter by Consequence Type', function() { clinVarFilterByConseqType(driver) });

    test.it('Filter by Variation Type', function() { clinVarFilterByVariationType(driver) });

    test.it('Filter by Clinical Significance', function() { clinVarFilterByClincalSignificance(driver) });

    test.it('Filter by Review Status', function() { clinVarFilterByReviewStatus(driver) });

    test.it('Summary Tab', function() { clinVarSummaryTab(driver) });

    test.it('Clinical Assertion Tab', function() { clinVarAssertionTab(driver) });

    test.it('Annotation Tab', function() { clinVarAnnotationTab(driver) });

    test.it('External Links Tab', function() { clinVarLinksTab(driver) });
});

function clinVarSearchByAccession(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
    driver.findElement(By.name("accessionId")).clear();
    driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText();
        assert(value).equalTo('RCV000074666');
    });

    return driver;
}

function clinVarSearchByLocation(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
        assert(value).equalTo('2');
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');
    });

    return driver;
}
function clinVarSearchByTrait(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
    driver.findElement(By.name("phenotype")).clear();
    driver.findElement(By.name("phenotype")).sendKeys("Lung cancer");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")).getText();
        assert(value).contains('Lung cancer');
    });
    driver.findElement(By.name("phenotype")).clear();

    return driver;

}

function clinVarFilterByConseqType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")).getText();
        assert(value).contains('inframe_deletion');
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();

    return driver;
}

function clinVarFilterByVariationType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")).getText();
        assert(value).equalTo('Deletion');
    });

    return driver;
}
function clinVarFilterByClincalSignificance(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")).getText();
        assert(value).equalTo('Uncertain significance');
    });

    return driver;
}
function clinVarFilterByReviewStatus(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")).getText();
        assert(value).equalTo('CLASSIFIED_BY_SINGLE_SUBMITTER');
    });

    return driver;
}


function clinVarSummaryTab(driver){
    value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")).getText();
    assert(value).contains('Reference');

    return driver;
}
function clinVarAssertionTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")).getText();
        assert(value).contains('SCV');
    });

    return driver;
}
function clinVarAnnotationTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
    });

    return driver;
}
function clinVarLinksTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")).getText();
        assert(value).contains('Database');
    });

    return driver;
}


