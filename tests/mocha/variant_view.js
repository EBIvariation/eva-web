var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Variant View', function() {
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

    test.it('Summary', function() {
        driver1.get(baseURL+'?variant=1:3000017:C:T&species=hsapiens_grch37');
        driver1.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='summary-grid']")).getText();
            assert(value).contains('Human / GRCh37');
        });
        
        driver2.get(baseURL+'?variant=1:3000017:C:T&species=hsapiens_grch37');
        driver2.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='summary-grid']")).getText();
            assert(value).contains('Human / GRCh37');
        });

    });

    test.it('SO Terms Table', function() {
        driver1.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
            assert(value).contains('SO:');
        }); 
        
        driver2.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
            assert(value).contains('SO:');
        });

    });

    test.it('Studies', function() {
        driver1.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
            var value = driver1.findElement(By.xpath("//div[@id='studies-grid']//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
            assert(value).contains('1000');
        });
        
        driver2.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
            var value = driver2.findElement(By.xpath("//div[@id='studies-grid']//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
            assert(value).contains('1000');
        });

    });

    test.it('Population Stats', function() {
        driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        });
        
        driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        });
    });

});

function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

