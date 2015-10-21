var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Clinical Browser', function() {
    var driver1;
    var driver2;
    var value;

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

    test.it('search by ClinVar Accession', function() {
        driver1.findElement(By.id("cookie-dismiss")).click();
        driver1.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver1.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
        driver1.findElement(By.name("accessionId")).clear();
        driver1.findElement(By.name("accessionId")).sendKeys("RCV000074666");
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText();
            assert(value).equalTo('RCV000074666');
        });

        driver2.findElement(By.id("cookie-dismiss")).click();
        driver2.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver2.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
        driver2.findElement(By.name("accessionId")).clear();
        driver2.findElement(By.name("accessionId")).sendKeys("RCV000074666");
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText();
            assert(value).equalTo('RCV000074666');
        });


    });

    test.it('search by Chromosomal Location', function() {

        driver1.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver1.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver1.findElement(By.name("clinvarRegion")).clear();
        driver1.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });

        driver2.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver2.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver2.findElement(By.name("clinvarRegion")).clear();
        driver2.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });
    });

    test.it('search by Gene', function() {
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver1.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver1.findElement(By.name("gene")).clear();
        driver1.findElement(By.name("gene")).sendKeys("BRCA1");
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('17');
        });

        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver2.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver2.findElement(By.name("gene")).clear();
        driver2.findElement(By.name("gene")).sendKeys("BRCA1");
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('17');
        });

    });

    test.it('search by Trait', function() {
        driver1.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver1.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver1.findElement(By.name("clinvarRegion")).clear();
        driver1.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver1.findElement(By.name("phenotype")).clear();
        driver1.findElement(By.name("phenotype")).sendKeys("Lung cancer");
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")).getText();
            assert(value).contains('Lung cancer');
        });
        driver1.findElement(By.name("phenotype")).clear();

        driver2.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver2.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver2.findElement(By.name("clinvarRegion")).clear();
        driver2.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver2.findElement(By.name("phenotype")).clear();
        driver2.findElement(By.name("phenotype")).sendKeys("Lung cancer");
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[5]/div[text()]")).getText();
            assert(value).contains('Lung cancer');
        });
        driver2.findElement(By.name("phenotype")).clear();
    });

    test.it('Filter by Consequence Type', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")).getText();
            assert(value).contains('inframe_deletion');
        });
        driver1.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();

        driver2.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[4]/div/tpl[text()]")).getText();
            assert(value).contains('inframe_deletion');
        });
        driver2.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
    });

    test.it('Filter by Variation Type', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")).getText();
            assert(value).equalTo('Deletion');
        });

        driver2.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")).getText();
            assert(value).equalTo('Deletion');
        });
    });

    test.it('Filter by Clinical Significance', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")).getText();
            assert(value).equalTo('Uncertain significance');
        });

        driver2.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[6]/div[text()]")).getText();
            assert(value).equalTo('Uncertain significance');
        });

    });

    test.it('Filter by Review Status', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
        driver1.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")).getText();
            assert(value).equalTo('CLASSIFIED_BY_SINGLE_SUBMITTER');
        });

        driver2.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
        driver2.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")).getText();
            assert(value).equalTo('CLASSIFIED_BY_SINGLE_SUBMITTER');
        });
    });

    test.it('Summary Tab', function() {
        value = driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")).getText();
        assert(value).contains('Reference');
        value = driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")).getText();
        assert(value).contains('Reference');
    });

    test.it('Clinical Assertion Tab', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")).getText();
            assert(value).contains('SCV');
        });

        driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")).getText();
            assert(value).contains('SCV');
        });

    });

    test.it('Annotation Tab', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
        });

        driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
            driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
        });

    });

    test.it('External Links Tab', function() {
        driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")).getText();
            assert(value).contains('Database');
        });

        driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")).getText();
            assert(value).contains('Database');
        });
    });

});



function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

