

var config = require('./config.js');

config.loadModules();
var species;
var type;

test.describe('Study Browser ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
       driver = config.initDriver(config.browser());
       driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });
    test.describe('Short Genetic Variants', function() {
        test.describe('search by Species', function() {
            test.it('Search by Barley should match with column Organism', function() {
                sgvStudySearchBySpecies(driver);
            });
        });
        test.describe('search by Type', function() {
            test.it('Search by Curation should match with column Type', function() {
                sgvStudySearchByType(driver);
            });
        });

        test.describe('search by Species and Types', function() {
            test.it('Search by (Barley,Human) and Exome Sequencing should match with column Organism and Type', function() {
                sgvStudySearchBySpeciesType(driver);
            });
        });

        test.describe('search by Text', function() {
            test.it('Search term 1000 should match with Name', function() {
                sgvStudySearchByText(driver);
            });
        });
    });
    test.describe('Structural Variants', function() {

        test.describe('search by Species', function() {
            test.it('Search by (Chimpanzee,Dog) should match with column Organism', function() {
                svStudySearchBySpecies(driver);
            });
        });
        test.describe('search by Type', function() {
            test.it('Search by Control Set should match with column Type', function() {
                svStudySearchByType(driver);
            });
        });

        test.describe('search by Species and Types', function() {
            test.it('Search by (Chimpanzee,Dog) and Control Set should match with column Organism and Type', function() {
                svStudySearchBySpeciesType(driver);
            });
        });

        test.describe('search by Text', function() {
            test.it('Search term 1000 should match with Name', function() {
                svStudySearchByText(driver);
            });
        });
    });

});

function sgvStudySearchBySpeciesType(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Human')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Exome Sequencing')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
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

    return driver;
}

function sgvStudySearchByType(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//span[contains(text(),'Curation')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
                type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div/tpl[text()]")).getText();
                assert(type).equalTo('Curation');
            }
            return rows;
        });
    });

    return driver;
}

function sgvStudySearchBySpecies(driver){
    driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[4]/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
                species = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[4]/div[text()]")).getText();
                assert(species).equalTo('Barley');
            }
            return rows;
        });
    });

    return driver;
}


function svStudySearchBySpeciesType(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Dog')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Control Set')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
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

    return driver;
}

function svStudySearchByType(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Control Set')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
                type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div[text()]")).getText();
                assert(type).equalTo('Control Set');
            }
            return rows;
        });
    });

    return driver;
}

function svStudySearchBySpecies(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//..//div[@role='button']")).click();
    driver.findElement(By.xpath("//span[contains(text(),'Dog')]//..//..//div[@role='button']")).click();
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid-body']//table[1]//td[4]/div/div[text()]")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[@id='study-browser-grid']//div[contains(@id,'_pagingToolbar-targetEl')]//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            var rows = parseInt(text.split(" ")[3]);
            for (i = 1; i <= rows; i++) {
                species = driver.findElement(By.xpath("//div[@id='study-browser-grid-body']//table["+i+"]//td[4]/div/div[text()]")).getText();
                var speciesRegex =   new RegExp('(Chimpanzee|Dog)', 'g');
                assert(species).matches(speciesRegex);
            }
            return rows;
        });

    });

    return driver;
}

function sgvStudySearchByText(driver){
    config.reset(driver);
    driver.findElement(By.name("search")).clear();
    driver.findElement(By.name("search")).sendKeys("1000");
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
        var regex =   new RegExp('1000', 'g');
        assert(value).matches(regex);
    });
    config.reset(driver);

    return driver;
}

function svStudySearchByText(driver){
    config.reset(driver);
    driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
    driver.findElement(By.name("search")).clear();
    driver.findElement(By.name("search")).sendKeys("1000");
    config.submit(driver);
    driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")), 10000).then(function(text) {
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
        var regex =   new RegExp('1000', 'g');
        assert(value).matches(regex);
    });
    config.reset(driver);

    return driver;
}




