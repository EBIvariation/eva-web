/*
 *
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014-2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var baseURL = '@@BASE_URL';
var browser = process.env.BROWSER;
var sleep_time = 5000;
var waitTime = 60000;

module.exports = {
    initDriver: function (driverName) {
        require('chromedriver');
        require('geckodriver');
        let chrome_options = new chrome.Options();
        chrome_options.addArguments("--no-sandbox")
        chrome_options.addArguments("--headless")
        chrome_options.addArguments("--disable-dev-shm-usage")
        chrome_options.addArguments("--disable-gpu")
        chrome_options.addArguments("--window-size=1920,1080")
        driver = new webdriver.Builder()
            .forBrowser(driverName)
            .withCapabilities(chrome_options.toCapabilities())
            .build();
        driver.manage().window().maximize();
        driver.get(baseURL);

        chai.use(chaiWebdriver(driver));
        driver.wait(until.elementLocated(By.id("cookie-dismiss")), 10000).then(function(text) {
            driver.findElement(By.xpath("//*[@id='data-protection-agree']")).click();
            driver.findElement(By.xpath("//div[@id='cookie-dismiss']//button[@class='close-button']")).click();
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
            chrome = require('selenium-webdriver/chrome'),
            By = require('selenium-webdriver').By,
            until = require('selenium-webdriver').until,
            assert = require('selenium-webdriver/testing/assert'),
            flow = webdriver.promise.controlFlow(),
            chai = require('chai'),
            chaiWebdriver = require('chai-webdriver');
    },
    sleep:function(driver){
        driver.sleep(sleep_time);
        return driver;
    },
    reset:function (driver){
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
        return driver;
    },
    submit:function (driver, submitButtonId){
        driver.findElement(By.id(submitButtonId)).click();
        return driver;
    },
    back:function(){
        driver.navigate().back();
        return driver;
    },
    hashCode:function(string){
        var hash = 0;
        if (string.length == 0) return hash;
        for (i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
    wait:function(){
        return waitTime;
    }
};




