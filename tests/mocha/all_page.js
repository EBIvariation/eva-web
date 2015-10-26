var config = require('./config.js');
config.loadModules();

test.describe('Checking All Browser Pages ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('The study browser is displayed', function() { visitBrowser(driver,'study') });
    test.it('The variant browser is displayed', function() { visitBrowser(driver,'variant') });
    test.it('The clinical browser is displayed', function() { visitBrowser(driver,'clinical') });

});

function visitBrowser(driver, type) {

    if(type == 'study'){
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")), 10000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[2]//td[4]/div[text()]")).getText();
            assert(value).equalTo('Human');
        });
    }
    else if(type == 'variant'){
        driver.findElement(By.xpath("//li//a[text()='Variant Browser']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='variant-browser-grid-body']//table[2]//tr[1]//td[1]/div[text()]")).getText();
            assert(value).equalTo('1');
        });
    }
    else if(type = 'clinical'){
        driver.findElement(By.xpath("//li//a[text()='Clinical Browser']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")), 10000).then(function(text) {
            var value = driver.findElement(By.xpath("//div[@id='clinvar-browser-grid-body']//table[2]//td[1]/div[text()]")).getText();
            assert(value).equalTo('2');
        });
    }
    else{
        throw new Error('No Page Found');
    }

    return driver;
}





