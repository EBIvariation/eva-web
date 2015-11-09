//var baseURL = 'http://wwwint.ebi.ac.uk/eva';
//var baseURL = 'http://localhost/eva-web/build/1.0.0/index.html';
var baseURL = 'http://localhost/eva-web/src/index.html';
var browser = process.env.BROWSER;

module.exports = {
    initDriver: function (driverName) {
        driver = new webdriver.Builder()
            .forBrowser(driverName)
            .build();
        driver.manage().window().maximize();
        driver.get(baseURL);
        chai.use(chaiWebdriver(driver));
        driver.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver.findElement(By.id("cookie-dismiss")).click();
        });
        return driver;
    },
    shutdownDriver: function (driver) {
            driver.quit();
    },
    browser: function (driver) {
       return browser;
    },
    baseURL: function () {
        return baseURL;
    },
    loadModules: function(){
     return test = require('selenium-webdriver/testing'),
            webdriver = require('selenium-webdriver'),
            By = require('selenium-webdriver').By,
            until = require('selenium-webdriver').until,
            assert = require('selenium-webdriver/testing/assert'),
            flow = webdriver.promise.controlFlow(),
            chai = require('chai'),
            chaiWebdriver = require('chai-webdriver');

    },
    sleep:function(value){
        flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
    },
    reset:function (driver){
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
        return driver;
    },
    submit:function (driver){
        driver.findElement(By.xpath("//span[text()='Submit']")).click();
        return driver;
    },
    back:function(){
        driver.navigate().back();
        return driver;
    }
};




