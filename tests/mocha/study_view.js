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

    test.describe('EVA Study', function() {
        test.it('Summary Table should not be empty', function() {
            driver.get(config.baseURL()+'?eva-study=PRJEB4019');
            checkSummaryTable(driver);
        });

        test.it('Publications should not be empty', function() {
            driver.get(config.baseURL()+'?eva-study=PRJEB4019');
            checkPublications(driver);
        });

        test.it('Files Table should not be empty', function() { checkFilesTable(driver) });
        test.it('Files Table should contain links', function() { checkFilesTableLinks(driver) });
    });

    test.describe('DGVA Study', function() {
        test.it('Summary Table should not be empty', function() {
            driver.get(config.baseURL()+'?dgva-study=estd199');
            checkSummaryTable(driver);
        });

        test.it('Publications should not be empty', function() {
            driver.get(config.baseURL()+'?eva-study=PRJEB4019');
            checkPublications(driver);
        });
    });

});


function checkSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        assert(value).contains('Organism');
    });

    return driver;
}

function checkPublications(driver){
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
    });

    return driver;
}

function checkFilesTableLinks(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();
        assert(value).contains('vcf.gz');
    });

    return driver;
}

