const path = require('path');
const { pathToFileURL } = require('url');

const chrome = require('selenium-webdriver/chrome');
const { Builder, By, until } = require('selenium-webdriver');

require('chromedriver');

const testRunnerUrl = pathToFileURL(path.resolve(__dirname, 'test-runner.html')).href;
const timeout = Number(process.env.UNIT_TEST_TIMEOUT || 60000);

async function main() {
    const options = new chrome.Options()
        .addArguments(
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--allow-file-access-from-files',
            '--window-size=1280,960'
        );

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(testRunnerUrl);
        await driver.wait(until.elementLocated(By.id('mocha')), timeout);
        await driver.wait(async function () {
            return driver.executeScript('return window.__mochaDone === true;');
        }, timeout);

        const failures = await driver.executeScript('return window.__mochaFailures || 0;');
        if (failures > 0) {
            const failureText = await driver.executeScript(`
                return Array.prototype.map.call(
                    document.querySelectorAll('#mocha .test.fail'),
                    function (test) { return test.innerText; }
                ).join('\\n\\n');
            `);
            console.error(failureText || failures + ' unit test(s) failed');
            process.exitCode = 1;
        }
    } finally {
        await driver.quit();
    }
}

main().catch(function (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
});
