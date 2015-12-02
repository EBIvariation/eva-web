var config = require('./config.js');
config.loadModules();
var variantBrowser = require('./variant_browser_bottom_panel_tests.js');

test.describe('Variant View ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant=1:3000017:C:T&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('Summary Section', function() {
        test.it('Table should not be empty', function() {
            checkSummaryGrid(driver);
        });
    });
    test.describe('SO Terms Section', function() {
        test.it('Table should not be empty', function() {
            checkSOTermGrid(driver);
        });
    });

    test.describe('Studies Section', function() {
        test.it('Grid should not be empty and no duplicate Items', function() {
            checkStudyGrid(driver);
        });
    });

    test.describe('Population Stats Section', function() {
        test.it('Grid should not be empty and no duplicate Items', function() {
            checkPopulationGrid(driver);
        });
    });
});


function checkSummaryGrid(driver) {
    driver.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
        chai.expect('#variant-view-organism').dom.to.have.text(/\w+\s\/\s\w+/);
        driver.findElement(By.id('variant-view-id')).then(function(webElement) {
            chai.expect('#variant-view-id').dom.to.have.text(/\w+\d+$/);
        },function(err) {
        });
        chai.expect('#variant-view-type').dom.to.have.text(/\w+$/);
        chai.expect('#variant-view-chr').dom.to.have.text(/^\d\:\d+\-\d+$/);
        chai.expect('#variant-view-ref').dom.to.have.text(/^[ACGT]+/);
        chai.expect('#variant-view-ale').dom.to.have.text(/^[ACGT]+/);
    });
    return driver;
}
function checkSOTermGrid(driver) {
    driver.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
        chai.expect('.variant-view-ensemblGeneId').dom.to.have.text(/^[A-Z]+/);
        chai.expect('.variant-view-ensemblTranscriptId').dom.to.have.text(/^[A-Z]+/);
        chai.expect('.variant-view-link').dom.to.have.text(/^SO\:\d+$/);
        chai.expect('.variant-view-soname').dom.to.contain.text(/^[a-z0-9]+/);
    });
    return driver;
}
function checkStudyGrid(driver) {
    driver.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
        variantBrowser.filesTab(driver);
    });
    return driver;
}
function checkPopulationGrid(driver) {
    variantBrowser.populationTab(driver);
    return driver;
}

