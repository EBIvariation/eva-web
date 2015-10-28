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

    test.it('Summary', function() { checkSummaryGrid(driver) });

    test.it('SO Terms Table', function() { checkSOTermGrid(driver) });

    test.it('Studies', function() { checkStudyGrid(driver) });

    test.it('Population Stats', function() { checkPopulationGrid(driver) });

});


function checkSummaryGrid(driver) {
    driver.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='summary-grid']")).getText();
        assert(value).contains('Human / GRCh37');
    });

    return driver;
}
function checkSOTermGrid(driver) {
    driver.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
        assert(value).contains('SO:');
    });

    return driver;
}
function checkStudyGrid(driver) {
    driver.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='studies-grid']//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        assert(value).contains('1000');
    });

    return driver;
}
function checkPopulationGrid(driver) {
    driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).getText();
    driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[2]/div[text()]")).getText();
    driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//table[1]//td[1]/div/div[@class='x-grid-row-expander']")).click();
    driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")), 10000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//tr[@class='x-grid-rowbody-tr']//div[@class='highcharts-container']")).getText();
    });

    return driver;
}

