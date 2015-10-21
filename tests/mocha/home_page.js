var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();


test.describe('Home Page', function() {
    var driver1;
    var driver2;
    var chai;
    var chaiWebdriver;
    test.before(function() {
        driver1 = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver1.manage().window().maximize();
        driver1.get(baseURL);
        chai = require('chai');
        chaiWebdriver = require('chai-webdriver');
        driver2 = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        driver2.manage().window().maximize();
        driver2.get(baseURL);
        chai.use(chaiWebdriver(driver1));
        chai.use(chaiWebdriver(driver2));
    });

    test.after(function() {
        driver1.quit();
        driver2.quit();
    });

    test.it('Twitter Widget present and rendered only once', function() {
        driver1.findElement(By.id("cookie-dismiss")).click();
        driver1.findElement(By.id("twitter-widget-0"));
        driver1.wait(until.elementLocated(By.className("twitter-timeline-rendered")), 10000).then(function(text) {
            chai.expect('.twitter-timeline-rendered').dom.to.have.count(1)
        });
        driver2.findElement(By.id("cookie-dismiss")).click();
        driver2.findElement(By.id("twitter-widget-0"));
        driver2.wait(until.elementLocated(By.className("twitter-timeline-rendered")), 10000).then(function(text) {
            chai.expect('.twitter-timeline-rendered').dom.to.have.count(1)
        });
    });

    test.it('Statistics all four charts rendered', function() {
        driver1.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        });
        driver1.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        });
        driver1.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        });
        driver1.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        });

        driver2.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        });
        driver2.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        });
        driver2.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")).getText();
        });
        driver2.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")).getText();
        });
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

