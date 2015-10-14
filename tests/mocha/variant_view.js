var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Variant View', function() {
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

    test.it('Summary', function() {
        driver.get(baseURL+'?variant=1:3000017:C:T&species=hsapiens_grch37');
        sleep(10);
        var value = driver.findElement(By.xpath("//div[@id='summary-grid']")).getText();
        assert(value).contains('Human / GRCh37');
    });

    test.it('SO Terms Table', function() {
        var value = driver.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
        assert(value).contains('SO:');
    });

    test.it('Studies', function() {
        var value = driver.findElement(By.xpath("//div[@id='studies-grid']//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        assert(value).contains('1000');
    });

    test.it('Population Stats', function() {
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        sleep(2);
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        sleep(2);
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

