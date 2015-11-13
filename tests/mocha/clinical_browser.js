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
            clinVarSummaryTab(driver)
        });
        test.it('Clinical Assertion Tab should not be empty and no duplicate items', function() {
            clinVarAssertionTab(driver)
        });
        test.it('Annotation Tab should not be empty', function() {
            clinVarAnnotationTab(driver)
        });
        test.it('External Links Tab should not be empty', function() {
            clinVarLinksTab(driver)
        });
    });

});

function clinVarSearchByAccession(driver){
    driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
    driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
    driver.findElement(By.name("accessionId")).clear();
    driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText().then(function(text){
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            assert(text).greaterThanEqualTo(47000000);
            assert(text).lessThanEqualTo(49000000);
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('17');
        });
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[3]/div/a[text()]")).getText().then(function(text){
            assert(text).equalTo('BRCA1');
        });
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[2]/div[text()]")).getText().then(function(text){
            text = parseInt(text);
            assert(text).greaterThanEqualTo(41196312);
            assert(text).lessThanEqualTo(41277500);
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
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")).getText().then(function(text){
            assert(text).contains('Lung cancer');
        });
    });
    driver.findElement(By.name("phenotype")).clear();

    return driver;
}

function clinVarFilterByConseqType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")).getText().then(function(text){
            assert(text).contains('inframe_deletion');
        });
    });
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();

    return driver;
}

function clinVarFilterByVariationType(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@class='clinvar-variationType']")), 10000).then(function(text) {
        chai.expect('.clinvar-variationType').dom.to.have.text('Deletion');
    });;

    return driver;
}
function clinVarFilterByClincalSignificance(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('Uncertain significance');
        });
    });

    return driver;
}
function clinVarFilterByReviewStatus(driver){
    driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
    driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@class='clinvar-reviewStatus']")), 10000).then(function(text) {
        chai.expect('.clinvar-reviewStatus').dom.to.have.text('CLASSIFIED_BY_SINGLE_SUBMITTER');
    });

    return driver;
}


function clinVarSummaryTab(driver){
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")), 10000).then(function(text) {
        chai.expect('.clinvar-reference').dom.to.have.match(/-|^[ACGT]+/);
        chai.expect('.clinvar-alternate').dom.to.have.match(/-|^[ACGT]+/);
        chai.expect('.clinvar-reviewStatus').dom.to.have.match(/^\w+/);
        chai.expect('.clinvar-lastEvaluated').dom.to.have.match(/^\w+/);
        chai.expect('.clinvar-hgvs').dom.to.have.match(/-|^\w+/);
        chai.expect('.clinvar-soTerms').dom.to.have.match(/^\w+/);
        chai.expect('.clinvar-variationType').dom.to.have.match(/^\w+/);
        chai.expect('.clinvar-publications').dom.to.have.match(/-|^\w+/);
    });

    return driver;
}
function clinVarAssertionTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@class='clinVarAccession']")), 10000).then(function(text) {
        driver.findElements(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
            var regex = /-|^\w+/;
            for (var i = 0; i < rows.length; i++){
                // check for duplication study
                rows[i].findElement(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]//span[@class='clinvarAssertionTitle']")).getText().then(function(text){
                    chai.expect('span:contains('+text+')').dom.to.have.count(1);
                });
                rows[i].findElement(By.className("clinVarAccession")).getText().then(function(text){
                    assert(text).matches(/^SCV+\d+$/);
                });
                rows[i].findElement(By.className("clinVarAssertion-significance")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-reviewStatus")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-submittedDate")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-submitter")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-methodType")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-alleOrigin")).getText().then(function(text){
                    assert(text).matches(regex);
                });
                rows[i].findElement(By.className("clinVarAssertion-type")).getText().then(function(text){
                    assert(text).matches(regex);
                });
            }
        });
    });

    return driver;
}
function clinVarAnnotationTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
    config.sleep(10)
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//div[contains(@id,'_annotatPagingToolbar-targetEl')]//div[contains(text(), 'Transcripts 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (var i = 1; i <= rows; i++) {
                //check Ensemble Gene ID
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[1]/div/a[text()]")).getText().then(function(text){
                    assert(text).matches(/-|^[A-Z]+/);
                });
                //check Ensemble Gene symbol
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[2]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/-|\w\d+$/);
                });
                //check Ensemble Transcript ID
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[3]/div/a[text()]")).getText().then(function(text){
                    assert(text).matches(/-|^[A-Z]+/);
                });
                //check SO terms
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[4]/div/tpl[text()]")).getText().then(function(text){
                    assert(text).matches(/-|^[a-zA-Z0-9_]+/);
                });
                //check Biotype
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[5]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/-|^[a-zA-Z0-9_]+/);
                });
                //check codon
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[6]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/-|^\w+\/\w+$/);
                });
                //check cDna position
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[7]/div[text()]")).getText().then(function(text){
                    assert(text).matches(/-|\d+$/);
                });
                //check AA change
                driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[8]/div[text()]")).getText().then(function(text){
                    assert(text).matches( /-|^\w+\/\w+$/);
                });
            }
        });
    });

    return driver;
}
function clinVarLinksTab(driver){
    driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
        var regex = /-|^\w+/;
        driver.findElement(By.className("clinvar-links-db")).getText().then(function(text){
            assert(text).matches(regex);
        });
        driver.findElement(By.className("clinvar-links-id")).getText().then(function(text){
            assert(text).matches(regex);
        });
        driver.findElement(By.className("clinvar-links-type")).getText().then(function(text){
            assert(text).matches(regex);
        });
        driver.findElement(By.className("clinvar-links-status")).getText().then(function(text){
            assert(text).matches(regex);
        });
        driver.findElement(By.className("lovd_link")).getText().then(function(text){
            assert(text).equalTo('Search for variant at LOVD');
        });
    });

    return driver;
}


