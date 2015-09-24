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