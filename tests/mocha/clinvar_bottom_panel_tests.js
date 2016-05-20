module.exports = {
    clinVarSummaryTab:function(driver){
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")), 10000).then(function(text) {
            chai.expect('.clinvar-reviewStatus').dom.to.have.match(/^\w+/);
            chai.expect('.clinvar-lastEvaluated').dom.to.have.match(/^\w+/);
            chai.expect('.clinvar-hgvs').dom.to.have.match(/^-$|^\w+/);
            chai.expect('.clinvar-soTerms').dom.to.have.match(/^\w+/);
            chai.expect('.clinvar-variationType').dom.to.have.match(/^\w+/);
            chai.expect('.clinvar-publications').dom.to.have.match(/^-$|^\w+/);
        });

        return driver;
    },
    clinVarAssertionTab:function(driver, browser){
        driver.findElement(By.xpath("//div[contains(@class,'"+ browser +"')]//span[text()='Clinical Assertion']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'"+ browser +"')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@class='clinVarAccession']")), 10000).then(function(text) {
            driver.findElements(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                var regex = /^-$|^\w+/;
                for (var i = 0; i < rows.length; i++){
                    // check for duplication study
                    rows[i].findElement(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]//span[@class='clinvarAssertionTitle']")).getText().then(function(text){
                        chai.expect('span:contains('+text+')').dom.to.have.count(1);
                    });
                    rows[i].findElement(By.className("clinVarAccession")).getText().then(function(text){
                        assert(text).matches(/^SCV+\d+$/);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-significance")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-reviewStatus")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-submittedDate")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-submitter")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-methodType")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-alleOrigin")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                    rows[i].findElement(By.className("clinVarAssertion-type")).getText().then(function(text){
                        assert(text).matches(regex);
                    });
                }
            });
        });

        return driver;
    },
    clinVarAnnotationTab:function(driver){
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='Annotation']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div/a[text()]")), 10000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//div[contains(@id,'_annotatPagingToolbar-targetEl')]//div[contains(text(), 'Transcripts 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3]);
                for (var i = 1; i <= rows; i++) {
                    //check Ensemble Gene ID
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[1]/div/a[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[A-Z]+/);
                    });
                    //check Ensemble Gene symbol
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[2]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^\w[\w\d-]+$/);
                    });
                    //check Ensemble Transcript ID
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[3]/div/a[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[A-Z]+/);
                    });
                    //check SO terms
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[4]/div/tpl[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[a-zA-Z0-9_]+/);
                    });
                    //check Biotype
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[5]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[a-zA-Z0-9_]+/);
                    });
                    //check codon
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[6]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^\w+\/\w+$/);
                    });
                    //check cDna position
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[7]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|\d+$/);
                    });
                    //check AA change
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[8]/div[text()]")).getText().then(function(text){
                        assert(text).matches( /^-$|^\w+\/\w+$/);
                    });
                }
            });
        });

        return driver;
    },
    clinVarLinksTab:function(driver){
        driver.findElement(By.xpath("//div[contains(@class,'clinical-widget')]//span[text()='External Links']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarLinksDataPanel')]//table")), 10000).then(function(text) {
            var regex = /^-$|^\w+/;
            driver.findElement(By.className("clinvar-links-db")).getText().then(function(text){
                assert(text).matches(regex);
            });
            driver.findElement(By.className("clinvar-links-id")).getText().then(function(text){
                assert(text).matches(regex);
            });
            driver.findElement(By.className("clinvar-links-type")).getText().then(function(text){
                assert(text).matches(regex);
            });
            driver.findElement(By.className("clinvar-links-status")).getText().then(function(text){
                assert(text).matches(regex);
            });
            driver.findElement(By.className("lovd_link")).getText().then(function(text){
                assert(text).equalTo('Search for variant at LOVD');
            });
        });

        return driver;
    }
};