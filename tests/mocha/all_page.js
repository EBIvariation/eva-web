var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver= require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Checking All Browser Pages', function() {
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

    test.it('Study Browser', function() {
        driver1.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")).getText();
            assert(value).equalTo('Human');
        });

        //driver2
        driver2.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")).getText();
            assert(value).equalTo('Human');
        });
    });

    test.it('Variant Browser', function() {
        driver1.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")).getText();
            assert(value).equalTo('1');
        });

        //driver2
        driver2.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")).getText();
            assert(value).equalTo('1');
        });
    });
    test.it('Clinical Browser', function() {
        driver1.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });

        //driver2
        driver2.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

