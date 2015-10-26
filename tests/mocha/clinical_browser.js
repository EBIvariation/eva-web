var config = require('./config.js');
config.loadModules();

test.describe('Clinical Browser ('+config.browser()+')', function() {
    var driver;
    var value;

    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('search by ClinVar Accession', function() { clinVarSearchBy(driver,'clinVarAccession') });

    test.it('search by Chromosomal Location', function() { clinVarSearchBy(driver,'location') });

    test.it('search by Gene', function() { clinVarSearchBy(driver,'gene') });

    test.it('search by Trait', function() { clinVarSearchBy(driver,'trait') });

    test.it('Filter by Consequence Type', function() { clinVarFilterBy(driver,'consequenceType') });

    test.it('Filter by Variation Type', function() { clinVarFilterBy(driver,'variationType') });

    test.it('Filter by Clinical Significance', function() { clinVarFilterBy(driver,'clincalSignificance') });

    test.it('Filter by Review Status', function() { clinVarFilterBy(driver,'reviewStatus') });

    test.it('Summary Tab', function() { clinVarBottomPanel(driver,'summary') });

    test.it('Clinical Assertion Tab', function() { clinVarBottomPanel(driver,'clinicalAssertion') });

    test.it('Annotation Tab', function() { clinVarBottomPanel(driver,'annotation') });

    test.it('External Links Tab', function() { clinVarBottomPanel(driver,'links') });
});

function clinVarSearchBy(driver, searchType){
    if(searchType == 'clinVarAccession'){
        driver.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
        driver.findElement(By.name("accessionId")).clear();
        driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText();
            assert(value).equalTo('RCV000074666');
        });
    }
    else if(searchType == 'location'){
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.name("clinvarRegion")).clear();
        driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });
    }
    else if(searchType == 'gene'){
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
    }
    else if(searchType == 'trait'){
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
    }
    else{
        throw new Error('No search type found');
    }

    return driver;
}

function clinVarFilterBy(driver, filterType){
    if (filterType == 'consequenceType'){
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")).getText();
            assert(value).contains('inframe_deletion');
        });
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
    }
    else if (filterType == 'variationType'){
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")).getText();
            assert(value).equalTo('Deletion');
        });
    }
    else if (filterType == 'clincalSignificance'){
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")).getText();
            assert(value).equalTo('Uncertain significance');
        });
    }
    else if (filterType == 'reviewStatus'){
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")).getText();
            assert(value).equalTo('CLASSIFIED_BY_SINGLE_SUBMITTER');
        });
    }
    else{
        throw new Error('No filter found');
    }

    return driver;
}

function clinVarBottomPanel(driver, panel){

    if (panel == 'summary'){
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")).getText();
        assert(value).contains('Reference');
    }
    else if (panel == 'clinicalAssertion'){
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")).getText();
            assert(value).contains('SCV');
        });
    }
    else if (panel == 'annotation'){
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
            driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
        });
    }
    else if (panel == 'links'){
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
            value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")).getText();
            assert(value).contains('Database');
        });
    }
    else{
        throw new Error('No Tab Found');
    }

    return driver;
}


