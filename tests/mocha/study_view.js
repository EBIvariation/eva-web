var config = require('./config.js');

config.loadModules();

test.describe('Study View ('+config.browser()+')', function() {
    var driver;
    var driver2;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('EVA Study Summary Table', function() {
        driver.get(config.baseURL()+'?eva-study=PRJEB4019');
        checkSummaryTable(driver);
    });

    test.it('EVA Study Files Table', function() { checkFilesTable(driver) });

    test.it('DGVA Study Summary Table', function() {
        driver.get(config.baseURL()+'?dgva-study=estd199');
        checkSummaryTable(driver);
    });

});


function checkSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        assert(value).contains('Organism');
    });
    driver.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='publication-section']")).getText();
        assert(value).contains('Nature');
    });

    return driver;
}

function checkFilesTable(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']")).getText();
        assert(value).contains('File Name');
        value = driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();
    });

    return driver;
}

