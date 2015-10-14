var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Study View', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });

    test.it('EVA Study Summary Table', function() {
        driver.get(baseURL+'?eva-study=PRJEB4019');
        sleep(10);
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        assert(value).contains('Organism');
        value = driver.findElement(By.xpath("//div[@id='publication-section']")).getText();
        assert(value).contains('Nature');

    });

    test.it('EVA Study Files Table', function() {
        var value = driver.findElement(By.xpath("//table[@id='filesTable']")).getText();
        assert(value).contains('File Name');
        value = driver.findElement(By.xpath("//table[@id='filesTable']//td[@class='link']/a")).getText();

    });

    test.it('DGVA Study Summary Table', function() {
        driver.get(baseURL+'?dgva-study=estd199');
        sleep(10);
        var value = driver.findElement(By.xpath("//table[@id='summaryTable']")).getText();
        assert(value).contains('Organism');
        value = driver.findElement(By.xpath("//div[@id='publication-section']")).getText();
        assert(value).contains('Nature');
    });


});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

