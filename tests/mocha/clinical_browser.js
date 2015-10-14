var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Clinical Browser', function() {
    var driver;
    var value;

    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('search by ClinVar Accession', function() {
        driver.findElement(By.id("cookie-dismiss")).click();
        driver.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='ClinVar Accession']")).click();
        driver.findElement(By.name("accessionId")).clear();
        driver.findElement(By.name("accessionId")).sendKeys("RCV000074666");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(2);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[7]/div/a[text()]")).getText();
        assert(value).equalTo('RCV000074666');
    });

    test.it('search by Chromosomal Location', function() {

        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.name("clinvarRegion")).clear();
        driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(2);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('2');
    });

    test.it('search by Gene', function() {
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Reset']")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='Ensembl Gene Symbol/Accession']")).click();
        driver.findElement(By.name("gene")).clear();
        driver.findElement(By.name("gene")).sendKeys("BRCA1");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(5);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');

    });

    test.it('search by Trait', function() {
        driver.findElement(By.xpath("//div[contains(@id,'ClinVarPositionFilterFormPanel')]//div[contains(@id,'selectFilter-trigger-picker')]")).click();
        driver.findElement(By.xpath("//li[text()='Chromosomal Location']")).click();
        driver.findElement(By.name("clinvarRegion")).clear();
        driver.findElement(By.name("clinvarRegion")).sendKeys("2:47000000-49000000");
        driver.findElement(By.name("phenotype")).clear();
        driver.findElement(By.name("phenotype")).sendKeys("Lung cancer");
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(5);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[5]/div[text()]")).getText();
        assert(value).contains('Lung cancer');
        driver.findElement(By.name("phenotype")).clear();
    });

    test.it('Filter by Consequence Type', function() {
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(3);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[4]/div/tpl[text()]")).getText();
        assert(value).contains('inframe_deletion');
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'inframe_deletion')]//..//input")).click();
    });

    test.it('Filter by Variation Type', function() {
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Deletion')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(3);
        value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='variationType']")).getText();
        assert(value).equalTo('Deletion');
    });

    test.it('Filter by Clinical Significance', function() {
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Uncertain significance')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(3);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[6]/div[text()]")).getText();
        assert(value).equalTo('Uncertain significance');
    });

    test.it('Filter by Review Status', function() {
        driver.findElement(By.xpath("//div[contains(@class,'x-tree-view')]//span[contains(text(),'Single submitter')]//..//input")).click();
        driver.findElement(By.xpath("//div[contains(@id,'ClinvarWidgetPanel')]//span[text()='Submit']")).click();
        sleep(3);
        value = driver.findElement(By.xpath("//div[contains(@id,'ClinVarSummaryDataPanel')]//table//td[@id='reviewStatus']")).getText();
        assert(value).equalTo('CLASSIFIED_BY_SINGLE_SUBMITTER');
    });

    test.it('Summary Tab', function() {
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")).getText();
        assert(value).contains('Reference');
    });

    test.it('Clinical Assertion Tab', function() {
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Clinical Assertion']")).click();
        sleep(1);
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@id='clinVarAccession']")).getText();
        assert(value).contains('SCV');
    });

    test.it('Annotation Tab', function() {
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
        sleep(1);
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[3]/div/a[text()]")).getText();
    });

    test.it('External Links Tab', function() {
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
        sleep(1);
        value = driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")).getText();
        assert(value).contains('Database');
    });
});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

