var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Study View', function() {
    var driver1;
    var driver2;
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

    test.it('EVA Study Summary Table', function() {
        driver1.get(baseURL+'?eva-study=PRJEB4019');
        driver1.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver1.findElement(By.id("cookie-dismiss")).click();
        });
        driver1.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//table[@id='summaryTable']")).getText();
            assert(value).contains('Organism');
        });
        driver1.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='publication-section']")).getText();
            assert(value).contains('Nature');
        });

        driver2.get(baseURL+'?eva-study=PRJEB4019');
        driver2.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver2.findElement(By.id("cookie-dismiss")).click();
        });
        driver2.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//table[@id='summaryTable']")).getText();
            assert(value).contains('Organism');
        });
        driver2.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='publication-section']")).getText();
            assert(value).contains('Nature');
        });
    });

    test.it('EVA Study Files Table', function() {
        driver1.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
            var value = driver1.findElement(By.xpath("//table[@id='filesTable']")).getText();
            assert(value).contains('File Name');
            value = driver1.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();
        });
        driver2.wait(until.elementLocated(By.xpath("//table[@id='filesTable']")), 10000).then(function(text) {
            var value = driver2.findElement(By.xpath("//table[@id='filesTable']")).getText();
            assert(value).contains('File Name');
            value = driver2.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();
        });
    });

    test.it('DGVA Study Summary Table', function() {
        driver1.get(baseURL+'?dgva-study=estd199');
        driver1.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//table[@id='summaryTable']")).getText();
            assert(value).contains('Organism');
        });
        driver1.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='publication-section']")).getText();
            assert(value).contains('Nature');
        }); 
        
        driver2.get(baseURL+'?dgva-study=estd199');
        driver2.wait(until.elementLocated(By.id("summaryTable")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//table[@id='summaryTable']")).getText();
            assert(value).contains('Organism');
        });
        driver2.wait(until.elementLocated(By.id("publication-section")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='publication-section']")).getText();
            assert(value).contains('Nature');
        });
    });


});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

