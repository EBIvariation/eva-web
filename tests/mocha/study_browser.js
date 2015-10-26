

var config = require('./config.js');

config.loadModules();

test.describe('Study Browser ('+config.browser()+')', function() {
    var driver;
    var species;
    var type;
    test.before(function() {
       driver = config.initDriver(config.browser());
       driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });
    test.it('Short Genetic Variants search by Species and Type', function() { studySearchBySpeciesType(driver,'sgv') });

    test.it('Short Genetic Variants search search by Text', function() { studySearchByText(driver) });

    test.it('Structural Variants search by Species and Type', function() { studySearchBySpeciesType(driver,'sv') });

});

function studySearchBySpeciesType(driver, browserType){

    if(browserType == 'sgv'){
        driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Human')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Whole Genome Sequencing')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[4]/div[text()]")).getText();
                    type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div/tpl[text()]")).getText();
                    var speciesRegex =   new RegExp('(Barley|Human)', 'g');
                    var typeRegex =   new RegExp('(ES|WGS)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });
        });
    }
    else if(browserType == 'sv'){
        driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Dog')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Control Set')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3])+1;
                for (i = 1; i < rows; i++) {
                    species = driver.findElement(By.xpath("//div[@id='study-browser-grid-body']//table["+i+"]//td[4]/div/div[text()]")).getText();
                    type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div[text()]")).getText();
                    var speciesRegex =   new RegExp('(Chimpanzee|Dog)', 'g');
                    var typeRegex =   new RegExp('(Control Set)', 'g');
                    assert(species).matches(speciesRegex);
                    assert(type).matches(typeRegex);
                }
                return rows;
            });

        });
    }
    else{
        throw new Error('No '+browserType+' Found');
    }

    return driver;

}

function studySearchByText(driver){
    driver.findElement(By.xpath("//span[text()='Reset']")).click();
    driver.findElement(By.name("search")).clear();
    driver.findElement(By.name("search")).sendKeys("1000");
    driver.findElement(By.id("study-submit-button")).click();
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
        var regex =   new RegExp('1000', 'g');
        assert(value).matches(regex);
    });
    driver.findElement(By.xpath("//span[text()='Reset']")).click();

    return driver;

}


