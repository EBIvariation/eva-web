/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 -2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = require('./config.js');
config.loadModules();
module.exports = {
    clinVarSummaryTab:function(driver){
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'clinical-widget')]//div[contains(@id,'ClinVarSummaryDataPanel')]//table")), 10000).then(function(text) {

            driver.findElement(By.className("clinvar-reviewStatus")).getText().then(function(text){
                assert(text).matches(/^\w+/);
            });
            driver.findElement(By.className("clinvar-lastEvaluated")).getText().then(function(text){
                assert(text).matches(/^\w+/);
            });
            driver.findElement(By.className("clinvar-hgvs")).getText().then(function(text){
                assert(text).matches(/^-$|^\w+/);
            });
            driver.findElement(By.className("clinvar-soTerms")).getText().then(function(text){
                assert(text).matches(/^\w+/);
            });
            driver.findElement(By.className("clinvar-variationType")).getText().then(function(text){
                assert(text).matches(/^\w+/);
            });
            driver.findElement(By.className("clinvar-publications")).getText().then(function(text){
                assert(text).matches(/^-$|^\w+/);
            });
        });

        return driver;
    },
    clinVarAssertionTab:function(driver, browser){
        driver.findElement(By.xpath("//div[contains(@class,'"+ browser +"')]//span[text()='Clinical Assertion']")).click();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'"+ browser +"')]//div[contains(@id,'ClinVarAssertionDataPanel')]//table//td[@class='clinVarAccession']")), 10000).then(function(text) {
            driver.findElements(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                var regex = /^-$|^\w+/;
                var assertTitleArray = new Array();
                for (var i = 0; i < rows.length; i++){
                    // check for duplication Clinical Assertions
                    rows[i].findElement(By.xpath("//div[contains(@id,'ClinVarAssertionDataPanel')]//div[contains(@class,'x-accordion-item')]//span[@class='clinvarAssertionTitle']")).getText().then(function(text){
                        // chai.expect('span:contains('+text+')').dom.to.have.count(1);
                        chai.assert.notInclude(assertTitleArray, config.hashCode(text))
                        assertTitleArray.push(config.hashCode(text));
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
                    //check Biotype
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[4]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[a-zA-Z0-9_]+/);
                    });
                    //check SO terms
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[5]/div/tpl[text()]")).getText().then(function(text){
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