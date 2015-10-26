var config = require('./config.js');
config.loadModules();


test.describe('Variant View ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant=1:3000017:C:T&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('Summary', function() { checkComponents(driver, 'summary') });

    test.it('SO Terms Table', function() { checkComponents(driver, 'soTerm') });

    test.it('Studies', function() { checkComponents(driver, 'study') });

    test.it('Population Stats', function() { checkComponents(driver, 'population') });

});

function checkComponents (driver, table) {
    if (table == 'summary'){
        driver.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='summary-grid']")).getText();
            assert(value).contains('Human / GRCh37');
        });
    }
    else if (table == 'soTerm'){
        driver.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
            assert(value).contains('SO:');
        });
    }
    else if (table == 'study'){
        driver.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='studies-grid']//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
            assert(value).contains('1000');
        });
    }
    else if (table == 'population'){
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
        });
    }
}

