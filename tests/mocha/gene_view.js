var config = require('./config.js');
config.loadModules();
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

    test.describe('ClinVar widget', function() {
        test.it('Check Grid is present', function() {
            checkClinvarGrid(driver);
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
        driver.findElement(By.xpath("//div[contains(@id,'clinvar-browser-grid-body')]//table[2]//td[1]/div[text()]")).getText().then(function(text){
            assert(text).equalTo('2');
        });
    });
    return driver;
}