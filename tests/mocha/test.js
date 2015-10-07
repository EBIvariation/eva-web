var test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert');

var baseURL = 'http://mysite.com/apps/eva-web/src/index.html';

test.describe('European Variation Archive', function() {
    test.it('Home Page', function() {
        var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
        driver.findElement(By.id("cookie-dismiss")).click();
    });
    test.it('Study Browser', function() {
        var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();

    });
    test.it('Variant Browser', function() {
        var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        driver.findElement(By.name("selectFilter")).click();
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver.findElement(By.name("snp")).clear();
        driver.findElement(By.name("snp")).sendKeys("rs666");
        driver.findElement(By.id("vb-submit-button")).click();
        var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[1]//td[1]/div[text()]")).getText();
        assert(value).equalTo('17');
    });
});