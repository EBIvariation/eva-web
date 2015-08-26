//var casper = require('casper').create();
URL = 'http://mysite.com/apps/eva-web/src/index.html';
casper.options.viewportSize = {width: 1680, height: 1050};
casper.start(URL, function() {
    this.wait(5000, function() {
        this.echo(this.getTitle());
//        this.clickLabel('Dismiss this notice', 'button');
        this.click('#cookie-dismiss')
        casper.capture('tests/casperjs/screenshots/home_page.png');

    });
});

casper.thenOpen(URL+'?Variant%20Browser', function() {
    this.echo(this.getTitle());
    this.wait(5000, function() {
        casper.capture('tests/casperjs/screenshots/Variant_Browser_page.png');
        this.clickLabel('Study Browser', 'a');
        casper.capture('tests/casperjs/screenshots/study_Browser_page.png');
    });
});


casper.run();