var config = require('./config.js');

config.loadModules();
var value;
test.describe('Study View ('+config.browser()+')', function() {
    var driver;
    var driver2;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('EVA Study', function() {
        test.it('Summary Table should not be empty', function() {
//            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
//                for (i = 1; i < 10; i++) {
//                    value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")).getText().then(function(text){
//                        var url = '?eva-study='+text;
//                        driver.get(config.baseURL()+'?eva-study='+text);
//                        evaCheckSummaryTable(driver);
//                    });
//                }
//            });
            driver.get(config.baseURL()+'?eva-study=PRJEB4019');
            evaCheckSummaryTable(driver);
        });

        test.it('Publications should not be empty', function() {
            checkPublications(driver);
        });

        test.it('Files Table should not be empty', function() { checkFilesTable(driver) });
        test.it('Files Table should contain links', function() { checkFilesTableLinks(driver) });
        test.it('Files Table should contain Iobio links', function() { checkIobioLinks(driver) });
    });

    test.describe('DGVA Study', function() {
        test.it('Summary Table should not be empty', function() {
            driver.get(config.baseURL()+'?dgva-study=estd199');
            dgvaCheckSummaryTable(driver);
        });

        test.it('Publications should not be empty', function() {
            checkPublications(driver);
        });
    });

});


function evaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        chai.expect('#organism-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#scientific-name-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#taxonomy-id-div').dom.to.have.text(/[0-9]/);
        chai.expect('#center-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#material-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#scope-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#type-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#source-type-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#platform-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#samples-div').dom.to.have.text(/[0-9]/);
        chai.expect('#description-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#resource-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#download-div').dom.to.have.text(/[a-z]/i);

    });

    return driver;
}

function dgvaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        chai.expect('#organism-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#scientific-name-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#taxonomy-id-div').dom.to.have.text(/[0-9]/);
        chai.expect('#study-type-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#exp-type-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#platform-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#assembly-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#variants-div').dom.to.have.text(/[0-9]/);
        chai.expect('#description-div').dom.to.have.text(/[a-z]/i);
        chai.expect('#download-div').dom.to.have.text(/[a-z]/i);

    });

    return driver;
}

function checkPublications(driver){
    driver.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
       driver.findElement(By.xpath("//div[@id='publication-section']")).getText().then(function(text){
//           assert(text).contains('Nature');
           text = text.split("\n");
           assert(text[0]).matches(/[a-z]/i);
           assert(text[1]).matches(/[a-z]/i);
           assert(text[2]).matches(/[a-z0-9]/i);
       });
    });

    return driver;
}

function checkFilesTable(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']")).getText();
        assert(value).contains('File Name');
        chai.expect('.samples_count').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.variants_ount').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.snps_count').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.indels_count').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.pass_count').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.transition_count').dom.to.have.text(/[a-z0-9]/i);
        chai.expect('.mean_count').dom.to.have.text(/[a-z0-9]/i);    });

    return driver;
}

function checkFilesTableLinks(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();
        assert(value).contains('vcf.gz');
    });

    return driver;
}

function checkIobioLinks(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@class='iobio_link']/a")).getText();
        assert(value).equalTo('Iobio');
    });

    return driver;
}

