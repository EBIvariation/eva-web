var config = require('./config.js');
config.loadModules();

test.describe('Home Page ('+config.browser()+')', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    test.it('Twitter Widget should  be rendered only once', function() { twitterWidgetRendered(driver)});

    test.it('Statistics all four charts rendered', function() {statisticsChartsRendered(driver)});

});

function twitterWidgetRendered(driver){
    driver.wait(until.elementLocated(By.className("twitter-timeline-rendered")), 10000).then(function(text) {
        chai.expect('.twitter-timeline-rendered').dom.to.have.count(1)
    });
    return driver;
}

function statisticsChartsRendered(driver){
    driver.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
        chai.expect('div[id="eva-statistics-chart-species"] > div[class="highcharts-container"]').dom.to.have.count(1);
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='eva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
        chai.expect('div[id="eva-statistics-chart-type"] > div[class="highcharts-container"]').dom.to.have.count(1);
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-species']//div[@class='highcharts-container']")), 10000).then(function(text) {
        chai.expect('div[id="dgva-statistics-chart-species"] > div[class="highcharts-container"]').dom.to.have.count(1);
    });
    driver.wait(until.elementLocated(By.xpath("//div[@id='dgva-statistics-chart-type']//div[@class='highcharts-container']")), 10000).then(function(text) {
        chai.expect('div[id="dgva-statistics-chart-type"] > div[class="highcharts-container"]').dom.to.have.count(1);
    });

    return driver;
}



