var config = require('./config.js');

config.loadModules();
var value;
test.describe('Study View ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.describe('EVA Study', function() {
        test.it('Check Summary and File Table Values are not empty', function() {
            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
                driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                    var rows = parseInt(text.split(" ")[3]);
                    for (var i = 1; i <= 5; i++) {
                        driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")), 10000);
                        driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")).getText().then(function(text){
//                            driver.findElement(By.linkText(text)).click();
                            driver.get(config.baseURL()+'?eva-study='+text);
                            evaCheckSummaryTable(driver);
                            checkPublications(driver);
                            driver.findElement(By.id('filesTable')).then(function(webElement) {
                                checkFilesTable(driver);
                                checkFilesTableLinks(driver);
                            },function(err) {});
                            config.back(driver);
                        });
                    }
                });
            });
        });

    });

    test.describe('DGVA Study', function() {
        test.it('Check Summary Table Values are not empty', function() {
            driver.wait(until.elementLocated(By.xpath("//label[@id='sv-boxLabelEl']")), 10000).then(function(text) {
                driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
                config.submit(driver);
                driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[2]//td[2]/div/a")), 10000).then(function(text) {
                    driver.findElement(By.xpath("//div[@id='study-browser-grid-panel-body']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                        var rows = parseInt(text.split(" ")[3]);
                        for (var i = 1; i <= 5; i++) {
                            driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")), 10000);
                            driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[2]/div/a[text()]")).getText().then(function(text){
//                            driver.findElement(By.linkText(text)).click();
                                driver.get(config.baseURL()+'?dgva-study='+text);
                                dgvaCheckSummaryTable(driver);
                                checkPublications(driver);
                                config.back(driver);
                            });
                        }
                    });
                });
            });
        });
    });

});


function evaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        var regExp = /^-$|^\w+/
        var numExp = /^\d+$/;
        var resourceExp = /^\w+|\d+$/;
        chai.expect('#organism-span').dom.to.have.text(regExp);
        chai.expect('#scientific-name-span').dom.to.have.text(regExp);
        chai.expect('#taxonomy-id-span').dom.to.have.text(numExp);
        chai.expect('#center-span').dom.to.have.text(regExp);
        chai.expect('#material-span').dom.to.have.text(regExp);
        chai.expect('#scope-span').dom.to.have.text(regExp);
        chai.expect('#type-span').dom.to.have.text(regExp);
        chai.expect('#assembly-span').dom.to.have.text(regExp);
        chai.expect('#source-type-span').dom.to.have.text(regExp);
        chai.expect('#platform-span').dom.to.have.text(regExp);
        chai.expect('#samples-span').dom.to.have.text(numExp);
        chai.expect('#description-span').dom.to.have.text(regExp);
        chai.expect('#resource-span').dom.to.match(resourceExp);
        chai.expect('#download-span').dom.to.have.text(regExp);
    });

    return driver;
}

function dgvaCheckSummaryTable(driver){
    driver.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        var regExp = /^\w+/;
        var numExp = /^\d+$/;
        chai.expect('#organism-span').dom.to.have.text(regExp);
        chai.expect('#scientific-name-span').dom.to.have.text(regExp);
        chai.expect('#taxonomy-id-span').dom.to.have.text(numExp);
        chai.expect('#study-type-span').dom.to.have.text(regExp);
        chai.expect('#exp-type-span').dom.to.have.text(regExp);
        chai.expect('#platform-span').dom.to.have.text(regExp);
        chai.expect('#assembly-span').dom.to.have.text(regExp);
        chai.expect('#variants-span').dom.to.have.text(numExp);
        chai.expect('#description-span').dom.to.have.text(regExp);
        chai.expect('#download-span').dom.to.have.text(regExp);

    });

    return driver;
}

function checkPublications(driver){
    driver.wait(until.elementLocated(By.className("pubmed-id")), 15000).then(function(text) {
       driver.findElement(By.className('pubmed-id')).getText().then(function(text){
           var regExp = /^-$|^\w+/;
           if(text != '-'){
               text = text.split("\n");
               assert(text[0]).matches(regExp);
               assert(text[1]).matches(regExp);
               assert(text[2]).matches(regExp);
           }
       });
    });

    return driver;
}

function checkFilesTable(driver){
    driver.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']")).getText();
        assert(value).contains('File Name');

        //expression to math NA or 12334
        var countRegExp = /NA|^\d+$/;

        //expression to match NA or 0.00
        var meanCountRegExp = /NA|^[+-]?\d+(?:\.\d{1,2})?$/;

        //expression to match NA or 0.00 (123/123)
        var transitionCountRegExp =  /NA|^[+-]?\d+(?:\.\d{1,2})\s\(\d+\/\d+\)?$/;

        chai.expect('.samples_count').dom.to.have.text(countRegExp);
        chai.expect('.variants_ount').dom.to.have.text(countRegExp);
        chai.expect('.snps_count').dom.to.have.text(countRegExp);
        chai.expect('.indels_count').dom.to.have.text(countRegExp);
        chai.expect('.pass_count').dom.to.have.text(countRegExp);
        chai.expect('.transition_count').dom.to.have.text(transitionCountRegExp);
        chai.expect('.mean_count').dom.to.have.text(meanCountRegExp);
    });

    return driver;
}

function checkFilesTableLinks(driver){
    driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText().then(function(text) {
        assert(text).contains('vcf.gz');
//        var value = driver.findElement(By.xpath("//span[@class='iobio_link']/a")).getText();
//        assert(value).equalTo('Iobio');

    },function(err) {
        if (err.state && err.state === 'no such element') {

        } else {
            webdriver.promise.rejected(err);
        }
        return false;
    });
    return driver;
}



