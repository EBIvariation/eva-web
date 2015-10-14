var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Home Page', function() {
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

    test.it('Twitter Widget', function() {
        sleep(3);
        driver.findElement(By.id("cookie-dismiss")).click();
        driver.findElement(By.id("twitter-widget-0"));
    });

    test.it('Statistics Charts', function() {
        driver.findElement(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

