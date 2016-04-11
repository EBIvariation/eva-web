var config = require('./config.js');
config.loadModules();
var clinvar = require('./clinvar_bottom_panel_tests.js');
var value;
test.describe('Gene View ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?gene=MSH6&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('Summary Section', function() {
        test.it('Check fields are not empty', function() {
            checkSummaryTable(driver);
        });
    });

    test.describe('ClinVar widget Top grid', function() {
        test.it('Check Grid is present and not empty', function() {
            checkClinvarGrid(driver);
        });
    });

    test.describe('ClinVar widget Bottom Panel', function() {
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


function checkSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("gene-view-summary-table")), 15000).then(function(text) {
        var regex = /\w+/;
        chai.expect('#gene-view-hgnc > a').dom.to.have.text(regex);
        chai.expect('#gene-view-biotype').dom.to.have.text(regex);
        chai.expect('#gene-view-location').dom.to.have.text(/^\d\:\d+\-\d+$/);
        chai.expect('#gene-view-assembly').dom.to.have.text(regex);
        chai.expect('#gene-view-description').dom.to.have.text(regex);
        chai.expect('#gene-view-source > a').dom.to.have.text(regex);
    });
    return driver;
}

function checkClinvarGrid(driver){
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            for (var i = 1; i <= 10; i++){
                driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table["+i+"]//td[1]/div[text()]")).getText().then(function(text){
                    assert(text).equalTo('2');
                });
                driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table["+i+"]//td[2]/div[text()]")).getText().then(function(text){
                    text = parseInt(text);
                    chai.assert.operator(text, '>=', 47922669);
                    chai.assert.operator(text, '<=', 48037240);
                });
                driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table["+i+"]//td[3]/div/a[text()]")).getText().then(function(text){
                    assert(text).equalTo('MSH6');
                });
            }

        });
        return driver;
}