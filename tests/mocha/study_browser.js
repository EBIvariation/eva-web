var should = require('./config.js');
var test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

test.describe('Study Browser', function() {
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
    test.it('Short Genetic Variants search by Species and Type should not be empty', function() {
        var species;
        var type;
        driver1.findElement(By.id("cookie-dismiss")).click();
        driver1.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver1.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver1.findElement(By.xpath("//span[contains(text(),'Human')]//..//input")).click();
        driver1.findElement(By.id("study-submit-button")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver1.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[4]/div[text()]")).getText();
                    type = driver1.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div/tpl[text()]")).getText();
                    var speciesRegex =   new RegExp('(Barley|Human)', 'g');
                    var typeRegex =   new RegExp('(ES|WGS)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });
        });
        driver2.findElement(By.id("cookie-dismiss")).click();
        driver2.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver2.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver2.findElement(By.xpath("//span[contains(text(),'Human')]//..//input")).click();
        driver2.findElement(By.id("study-submit-button")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver2.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[4]/div[text()]")).getText();
                    type = driver2.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div/tpl[text()]")).getText();
                    var speciesRegex =   new RegExp('(Barley|Human)', 'g');
                    var typeRegex =   new RegExp('(ES|WGS)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });
        });

    });

    test.it('Short Genetic Variants search by Text term should macth match with Name column', function() {
        var value;
        driver1.findElement(By.xpath("//span[text()='Reset']")).click();
        driver1.findElement(By.name("search")).clear();
        driver1.findElement(By.name("search")).sendKeys("1000");
        driver1.findElement(By.id("study-submit-button")).click();
        sleep(1);
        driver1.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")), 10000).then(function(text) {
            value = driver1.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
            var regex =   new RegExp('1000', 'g');
            assert(value).matches(regex);
        });
        driver1.findElement(By.xpath("//span[text()='Reset']")).click();

        driver2.findElement(By.xpath("//span[text()='Reset']")).click();
        driver2.findElement(By.name("search")).clear();
        driver2.findElement(By.name("search")).sendKeys("1000");
        driver2.findElement(By.id("study-submit-button")).click();
        sleep(1);
        driver2.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")), 10000).then(function(text) {
            value = driver2.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
            var regex =   new RegExp('1000', 'g');
            assert(value).matches(regex);
        });
        driver2.findElement(By.xpath("//span[text()='Reset']")).click();
    });

    test.it('Structural Variants search by Species and Type', function() {
        var species;
        var type;
        driver1.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        driver1.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver1.findElement(By.xpath("//span[contains(text(),'Dog')]//..//input")).click();
        driver1.findElement(By.id("study-submit-button")).click();
        driver1.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
            driver1.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver1.findElement(By.xpath("//div[@id='study-browser-grid-body']//table["+i+"]//td[4]/div/div[text()]")).getText();
                    type = driver1.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div[text()]")).getText();
                    var speciesRegex =   new RegExp('(Chimpanzee|Dog)', 'g');
                    var typeRegex =   new RegExp('(Control Set)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });

        });

        driver2.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        driver2.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver2.findElement(By.xpath("//span[contains(text(),'Dog')]//..//input")).click();
        driver2.findElement(By.id("study-submit-button")).click();
        driver2.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
            driver2.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver2.findElement(By.xpath("//div[@id='study-browser-grid-body']//table["+i+"]//td[4]/div/div[text()]")).getText();
                    type = driver2.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div[text()]")).getText();
                    var speciesRegex =   new RegExp('(Chimpanzee|Dog)', 'g');
                    var typeRegex =   new RegExp('(Control Set)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });

        });
    });

});


function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

