var test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

var baseURL = 'http://wwwint.ebi.ac.uk/eva';
test.describe('Study Browser', function() {
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
    test.it('Short Genetic Variants search by Species', function() {
        var value;
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[4]/div[text()]")).getText();
        assert(value).equalTo('Barley');

    });

    test.it('Structural Variants search by Species', function() {
        var value;
        driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        sleep(3);
        driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")).getText();
        assert(value).equalTo('Chimpanzee');
    });

});


function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

