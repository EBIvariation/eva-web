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
        test.it('Search term "2:47000000-49000000" should match with column "Chr" and "Position"', function() {
            clinVarSearchByLocation(driver);
        });
    });

    test.describe('search by Gene', function() {
        test.it('Search term "BRCA1" should match with column "Affected Gene"', function() {
            clinVarSearchByGene(driver);
        });
    });

    test.describe('search by Trait', function() {
        test.it('Search term "Lung cancer" should match with column "Trait"', function() {
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
        test.it('filter term "Single submitter"  should match with  column "Review Status" in Summary tab', function() {
            clinVarFilterByReviewStatus(driver);
        });
    });

    test.describe('Bottom Panel', function() {
        test.it('Summary Tab should not be empty', function() {
            clinvar.clinVarSummaryTab(driver);
        });
        test.it('Clinical Assertion Tab should not be empty and no duplicate items', function() {
            clinvar.clinVarAssertionTab(driver);
        });
        test.it('Annotation Tab should not be empty', function() {
            clinvar.clinVarAnnotationTab(driver);
        });
        test.it('External Links Tab should not be empty', function() {
            clinvar.clinVarLinksTab(driver);
        });
    });

});

function clinVarSearchByAccession(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
    driver.findElement(By.name("accessionId")).clear();
    driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[1]//td[7]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('RCV000074666');
        });
    });

    return driver;
}

function clinVarSearchByLocation(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            chai.assert.operator(text, '>=', 47000000);
            chai.assert.operator(text, '<=', 49000000);
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
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), 15000).then(function(text) {
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
    driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
    driver.findElement(By.name("clinvarRegion")).clear();
    driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
    driver.findElement(By.name("phenotype")).clear();
    driver.findElement(By.name("phenotype")).sendKeys("Lung cancer");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[5]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[5]/div[text()]")).getText().then(function(text){
            assert(text).contains('Lung cancer');
        });
    });
    driver.findElement(By.name("phenotype")).clear();

    return driver;
}

function clinVarFilterByConseqType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[4]/div/tpl[text()]")).getText().then(function(text){
            assert(text).contains('inframe_deletion');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//..//div[@role='button']")).click();

    return driver;
}

function clinVarFilterByVariationType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@class='clinvar-variationType']")), 10000).then(function(text) {
        chai.expect('.clinvar-variationType').dom.to.have.text('Deletion');
    });

    return driver;
}
function clinVarFilterByClincalSignificance(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[6]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('Uncertain significance');
        });
    });

    return driver;
}
function clinVarFilterByReviewStatus(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@class='clinvar-reviewStatus']")), 10000).then(function(text) {
        chai.expect('.clinvar-reviewStatus').dom.to.have.text('CLASSIFIED_BY_SINGLE_SUBMITTER');
    });

    return driver;
}



