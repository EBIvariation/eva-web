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

    test.describe('Summary Section', function() {
        test.it('Table should not be empty', function() {
            checkSummaryGrid(driver)
        });
    });
    test.describe('SO Terms Section', function() {
        test.it('Table should not be empty', function() {
            checkSOTermGrid(driver)
        });
    });

    test.describe('Studies Section', function() {
        test.it(' Grid should not be empty', function() {
            checkStudyGrid(driver)
        });
    });

    test.describe('Population Stats Section', function() {
        test.it('Grid should not be empty', function() {
            checkPopulationGrid(driver)
        });
    });
});


function checkSummaryGrid(driver) {
    driver.wait(until.elementLocated(By.id("summary-grid")), 15000).then(function(text) {
        chai.expect('#variant-view-organism').dom.to.have.text(/\w+\s\/\s\w+/);
        driver.findElement(By.id('variant-view-id')).then(function(webElement) {
            chai.expect('#variant-view-id').dom.to.have.text(/\w+\d+$/);
        },function(err) {
        });
        chai.expect('#variant-view-type').dom.to.have.text(/\w+$/);
        chai.expect('#variant-view-chr').dom.to.have.text(/^\d\:\d+\-\d+$/);
        chai.expect('#variant-view-ref').dom.to.have.text(/^[ACGT]+/);
        chai.expect('#variant-view-ale').dom.to.have.text(/^[ACGT]+/);
    });

    return driver;
}
function checkSOTermGrid(driver) {
    driver.wait(until.elementLocated(By.id("consequence-types-grid")), 15000).then(function(text) {
        var value = driver.findElement(By.xpath("//div[@id='consequence-types-grid']")).getText();
        chai.expect('.variant-view-ensemblGeneId').dom.to.have.text(/^[A-Z]+/);
        chai.expect('.variant-view-ensemblTranscriptId').dom.to.have.text(/^[A-Z]+/);
        chai.expect('.variant-view-link').dom.to.have.text(/^SO\:\d+$/);
        chai.expect('.variant-view-soname').dom.to.contain.text(/^[a-z0-9]+/);
    });
    return driver;
}
function checkStudyGrid(driver) {
    driver.wait(until.elementLocated(By.id("studies-grid")), 15000).then(function(text) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
            driver.findElements(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                for (var i = 0; i < rows.length; i++){
                    // check for duplication study
                    rows[i].findElement(By.tagName("a")).getAttribute('href').then(function(text){
                        text = text.split("?");
                        chai.expect('span[class="stats-panel-study-title"] > a[href="?'+text[1]+'"]').dom.to.have.count(1)
                    });
                    // check for attributes table
                    rows[i].findElement(By.tagName("table")).getText().then(function(text){
                        assert(text).matches(/^\w+/);
                    });
                    //check for VCF Data
                    rows[i].findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), '+')]")).click();
                    rows[i].findElement(By.tagName("pre")).getText().then(function(text){
                        assert(text).startsWith('##fileformat=');
                    });
                }

            });
        });
    });

    return driver;
}
function checkPopulationGrid(driver) {
    driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).then(function(webElement) {
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 10000).then(function(text) {
            driver.findElements(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                for (var i = 0; i < rows.length; i++){
                    // check for duplication study
                    rows[i].findElement(By.tagName("a")).getAttribute('href').then(function(text){
                        text = text.split("?");
                        chai.expect('span[class="popStats-panel-study-title"] > a[href="?'+text[1]+'"]').dom.to.have.count(1);
                    });
                    rows[i].findElement(By.className("population-stats-grid")).getAttribute('id').then(function(id){
                        //check Population column
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[2]/div")).getText().then(function(text){
                            assert(text).matches(/^[a-zA-Z0-9\-_.,]+$/);
                        });
                        //check MAF
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[3]/div")).getText().then(function(text){
                            assert(text).matches(/^[+-]?\d+(?:\.\d{1,3})?$/);
                        });
                        //check MAF allele
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[4]/div")).getText().then(function(text){
                            assert(text).matches(/-|^[ACGT]+$/);
                        });
                        //check missing alleles
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[5]/div")).getText().then(function(text){
                            assert(text).matches(/^\d+$/);
                        });
                        //check missing genotypes
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[6]/div")).getText().then(function(text){
                            assert(text).matches( /^\d+$/);
                        });
                        //check pie chart is present for every ALL population.
                        driver.findElement(By.xpath("//div[@id='" + id + "']//table//td/div[contains(text(),'ALL')]/../..//div[contains(@class,'x-grid-row-expander')]")).click().then(function(){
                            driver.findElement(By.xpath("//div[@id='" + id + "']//table//div[@class='highcharts-container']")).getAttribute('id').then(function(chartID){
                                chai.expect('#'+chartID).dom.to.have.count(1);
                            });
                        });
                    });
                }
            });
        });
    },function(err) {
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//h5")).then(function(text) {
            assert(text).equalTo('Currently for 1000 Genomes Project data only')
        },function(err) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[@class='popstats-no-data']")).getText().then(function(text){
                assert(text).equalTo('No Population data available')
            });
        });
    });


    return driver;
}

