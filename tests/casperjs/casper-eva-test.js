//var casper = require('casper').create();
URL = 'http://mysite.com/apps/eva-web/src/index.html';
casper.options.viewportSize = {width: 1680, height: 1050};
casper.start(URL, function() {
    this.wait(5000, function() {
        this.echo(this.getTitle());
//        this.clickLabel('Dismiss this notice', 'button');
        this.click('#cookie-dismiss'
        casper.capture('tests/casperjs/screenshots/home_page.png');

    });
});

casper.thenOpen(URL+'?Variant%20Browser', function() {
    this.echo(this.getTitle());
    this.wait(5000, function() {
        casper.capture('tests/casperjs/screenshots/Variant_Browser_page.png');
        this.clickLabel('Files and Statistics', 'span');
        this.evaluate(function() {
            $("[name='region']").val('1:310000-500000')
        });
        this.clickLabel('Submit', 'span');
//        this.clickLabel('Study Browser', 'a');
        this.wait(5000, function() {
            casper.capture('tests/casperjs/screenshots/Variant_Browser_page1.png');
        });
    });
});

casper.then(function() {
    this.clickLabel('Reset', 'span');
    this.wait(5000, function() {
        casper.capture('tests/casperjs/screenshots/Variant_Browser_page2.png');
    });
});


casper.run();