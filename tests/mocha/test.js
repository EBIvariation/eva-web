var assert = require('assert'),
    test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;




function writeScreenshot(data, name) {
    this.timeout(15000);
    name = name || 'ss.png';
    var screenshotPath = '/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

test.describe('European Variation Archive', function() {
    test.it('should show home page', function() {

        var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();

        driver.get('http://mysite.com/apps/eva-web/src/index.html');
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        driver.findElement(By.name("selectFilter")).click();
        driver.findElement(By.id("selectFilter-trigger-picker")).click();
        driver.findElement(By.xpath("//li[text()='Variant ID']")).click();
        driver.findElement(By.name("snp")).clear();
        driver.findElement(By.name("snp")).sendKeys("rs666");
        driver.findElement(By.id("vb-submit-button")).click();
//        driver.wait(function() {
////            return driver.findElement(By.name("selectFilter")).isDisplayed();
//
//        }, timeout);
        driver.quit();
    });
});