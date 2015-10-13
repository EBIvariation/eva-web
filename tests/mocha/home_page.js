var test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

var baseURL = 'http://mysite.com/apps/eva-web/src/index.html';

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
        driver.findElement(By.id("twitter-widget-0"));
    });

    test.it('Charts', function() {
        driver.findElement(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        driver.findElement(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

