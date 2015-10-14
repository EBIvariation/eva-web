var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Checking All Browser Pages', function() {
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

    test.it('Study Browser', function() {
        sleep(3);
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        var value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[4]/div[text()]")).getText();
        assert(value).equalTo('Human');
    });

    test.it('Variant Browser', function() {
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        sleep(3);
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//tr[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('1');
    });
    test.it('Clinical Browser', function() {
        driver.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        sleep(3);
        value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('2');
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

