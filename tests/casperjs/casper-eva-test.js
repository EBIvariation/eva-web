////var casper = require('casper').create();
//URL = 'http://mysite.com/apps/eva-web/src/index.html';
//casper.options.viewportSize = {width: 1680, height: 1050};
//casper.start(URL, function() {
//    this.wait(5000, function() {
//        this.echo(this.getTitle());
////        this.clickLabel('Dismiss this notice', 'button');
//        this.click('#cookie-dismiss');
//        casper.capture('tests/casperjs/screenshots/home_page.png');
//
//    });
//});
//
//casper.thenOpen(URL+'?Variant%20Browser', function() {
//    this.echo(this.getTitle());
//    this.wait(5000, function() {
//        casper.capture('tests/casperjs/screenshots/Variant_Browser_page.png');
//        this.clickLabel('Files and Statistics', 'span');
//        this.evaluate(function() {
//            $("[name='region']").val('1:310000-500000')
//        });
//
//        this.echo(this.getTitle());
//
//        this.wait(5000, function() {
//            this.evaluate(function() {
//                $("[name='selectFilter']").val('gene')
//            });
//            casper.capture('tests/casperjs/screenshots/Variant_Browser_page1.png')
//        });
//
//
//
//        this.clickLabel('Submit', 'span');
//        this.clickLabel('Study Browser', 'a');
//        this.wait(5000, function() {
//            casper.capture('tests/casperjs/screenshots/study_Browser_page.png');
//        });
//    });
//});
//
//casper.then(function() {
//    this.clickLabel('Reset', 'span');
//    this.wait(5000, function() {
//        casper.capture('tests/casperjs/screenshots/Variant_Browser_page2.png');
//    });
//});
//
//
//casper.run();

var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver');

function writeScreenshot(data, name) {
    name = name || 'ss.png';
    var screenshotPath = '/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

test.describe('Vapid Space', function() {
    test.it('should show home page', function() {

        var driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();

        driver.get('http://www.vapidspace.com');


        driver.takeScreenshot().then(function(data) {
            writeScreenshot(data, 'out1.png');
        });

        driver.quit();
    });
});