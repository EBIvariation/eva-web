var config = require('./config.js');
config.loadModules();
var ERZLinkRegEx = /ftp\:\/\/ftp\.ebi\.ac\.uk\/pub\/databases\/eva\/PRJ[A-Z0-9]+\/ERZ[A-Z0-9]\d+$/;
module.exports = {
    filesTab:function(driver){
        driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")), 15000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div//a[text()]")).getText();
            var filesArray = new Array();
            var studyTitleArray = new Array();
            driver.findElements(By.xpath("//div[contains(@id,'VariantStatsPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                for (var i = 0; i < rows.length; i++){
                    //check for duplication study title
                    rows[i].findElement(By.className("stats-panel-study-title")).getText().then(function(text){
                        chai.assert.notInclude(studyTitleArray, config.hashCode(text))
                        studyTitleArray.push(config.hashCode(text));
                    });
                    //check study title links
                    rows[i].findElement(By.className("study_link")).getAttribute('href').then(function(text){
                        assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                    },function(err) {});
                    rows[i].findElement(By.className("project_link")).getAttribute('href').then(function(text){
                        assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                    },function(err) {});
                    rows[i].findElement(By.className("ftp_link")).getAttribute('href').then(function(text){
                        assert(text).matches(ERZLinkRegEx);
                    });
                    // check for chrom table
                    rows[i].findElement(By.className("chrom-table")).getText().then(function(text){
                        chai.assert.isNotNull(text);
                    });
                    // check for attributes table
                    rows[i].findElement(By.className("attributes-table")).getText().then(function(text){
                        chai.assert.isNotNull(text);
                    });
                    //check for Header Data
                    rows[i].findElement(By.xpath("//div[contains(@id,'VariantStatsPanel')]//span[contains(text(), 'Show Full Header')]")).click();
                    rows[i].findElement(By.tagName("pre")).getText().then(function(vcftext){
                        assert(vcftext).startsWith('##fileformat=');
                    });
                    //check for duplicate content
                    rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                        driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                            chai.assert.notInclude(filesArray, config.hashCode(text))
                            filesArray.push(config.hashCode(text));
                        });
                    });
                }
            });
        });
        return driver;
    },
    annotationTab:function(driver){
        driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table[1]//td[1]/div[text()]")), 15000).then(function(text) {
            driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//div[contains(@id,'_annotatPagingToolbar-targetEl')]//div[contains(text(), 'Transcripts 1 -')]")).getText().then(function(text) {
                var rows = parseInt(text.split(" ")[3]);
                for (var i = 1; i <= rows; i++) {
                    //check Ensemble Gene ID
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[1]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^[A-Z]+/);
                    });
                    //check Ensemble Gene symbol
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[2]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^\w[\w\d-]+$/);
                    });
                    //check Ensemble Transcript ID
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[3]/div[text()]")).getText().then(function(text){
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
                        assert(text).matches(/^-$|\d$/);
                    });
                    //check AA change
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[8]/div[text()]")).getText().then(function(text){
                        assert(text).matches( /^-$|^\w+\/\w+$/);
                    });
                    //check Polyphen
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[9]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^\d+([,.]\d+)?$/);
                    });
                    //check Sift
                    driver.findElement(By.xpath("//div[contains(@id,'ClinVarAnnotationDataPanel')]//table["+i+"]//td[9]/div[text()]")).getText().then(function(text){
                        assert(text).matches(/^-$|^\d+([,.]\d+)?$/);
                    });
                }
            });

        });

        return driver;
    },
    genotypesTab:function(driver){
        driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div")).then(function(text) {
            driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div//a[text()]")), 15000).then(function(text) {
                driver.findElements(By.xpath("//div[contains(@id,'VariantGenotypeGrid-')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                    var genotypesArray = new Array();
                    var studyTitleArray = new Array();
                    for (var i = 0; i < rows.length; i++){
                        // check for duplication study
                        rows[i].findElement(By.className("genotype-grid-study-title")).getText().then(function(text){
                            chai.assert.notInclude(studyTitleArray, config.hashCode(text))
                            studyTitleArray.push(config.hashCode(text));
                        });
                        //check study title links
                        rows[i].findElement(By.className("study_link")).getAttribute('href').then(function(text){
                            assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                        },function(err) {});
                        rows[i].findElement(By.className("project_link")).getAttribute('href').then(function(text){
                            assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                        },function(err) {});
                        rows[i].findElement(By.className("ftp_link")).getAttribute('href').then(function(text){
                            assert(text).matches(ERZLinkRegEx);
                        });
                        // check for pie chart study
                        rows[i].findElement(By.className("highcharts-container")).getAttribute('id').then(function(id){
                            chai.expect('#'+id).dom.to.have.count(1);
                        });
                        rows[i].findElement(By.xpath("//div[contains(@class,'genotype-grid')]//table[1]//td[1]/div[text()]")).getText();
                        //check for duplicate content
                        rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                            driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                                chai.assert.notInclude(genotypesArray, config.hashCode(text))
                                genotypesArray.push(config.hashCode(text));
                            });
                        });
                    }
                });
            },function(err) {});
        },function(err) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//p[@class='genotype-grid-no-data']")).then(function(text){
                driver.findElement(By.xpath("//div[contains(@id,'VariantGenotypeGrid')]//p[@class='genotype-grid-no-data']")).getText.then(function(text) {
                    assert(text).equalTo('No Genotypes data available');
                });
            },function(err) {
            });
        });

        return driver;
    },
    populationTab:function(driver){
        driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")).then(function(webElement) {
            driver.wait(until.elementLocated(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div//a[text()]")), 15000).then(function(text) {
                driver.findElements(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[contains(@class,'x-accordion-item')]")).then(function(rows){
                    var popStatsArray = new Array();
                    var studyTitleArray = new Array();
                    for (var i = 0; i < rows.length; i++){
                        // check for duplication study
                        rows[i].findElement(By.className("popStats-panel-study-title")).getText().then(function(text){
                            chai.assert.notInclude(studyTitleArray, config.hashCode(text))
                            studyTitleArray.push(config.hashCode(text));
                        });
                        //check study title links
                        rows[i].findElement(By.className("study_link")).getAttribute('href').then(function(text){
                            assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                        },function(err) {});
                        rows[i].findElement(By.className("project_link")).getAttribute('href').then(function(text){
                            assert(text.split("?")[1]).matches(/^eva-study\=PRJ[A-Z0-9]+$/);
                        },function(err) {});
                        rows[i].findElement(By.className("ftp_link")).getAttribute('href').then(function(text){
                            assert(text).matches(ERZLinkRegEx);
                        });
                        rows[i].findElement(By.className("population-stats-grid")).getAttribute('id').then(function(id){
                            //check Population column
                            for (var i = 1; i <=6; i++){
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[2]/div")).getText().then(function(text){
                                    assert(text).matches(/^[a-zA-Z0-9\-_.,]+$/);
                                },function(err) {});
                                //check MAF
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table["+i+"]//td[3]/div")).getText().then(function(text){
                                    assert(text).matches(/^[+-]?\d+(?:\.\d{1,3})?$|^[+-]?\d+(?:\.\d{3})[e]\-\d$/);
                                },function(err) {});
                                //check MAF allele
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[4]/div")).getText().then(function(text){
                                    assert(text).matches(/^-$|^[ACGT]+$/);
                                },function(err) {});
                                //check missing alleles
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[5]/div")).getText().then(function(text){
                                    assert(text).matches(/^NA$|^\d+$/);
                                },function(err) {});
                                //check missing genotypes
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table[1]//td[6]/div")).getText().then(function(text){
                                    assert(text).matches( /^NA$|^\d+$/);
                                },function(err) {});

                            }
                            //check pie chart is present for every ALL population.
                            driver.findElement(By.xpath("//div[@id='" + id + "']//table//td/div[contains(text(),'ALL')]/../..//div[contains(@class,'x-grid-row-expander')]")).click().then(function(){
                                driver.findElement(By.xpath("//div[@id='" + id + "']//table//div[@class='highcharts-container']")).getAttribute('id').then(function(chartID){
                                    chai.expect('#'+chartID).dom.to.have.count(1);
                                },function(err) {
                                    driver.findElement(By.xpath("//div[@id='" + id + "']//div[@class='popstats-no-genotype-data']")).getText().then(function(text){
                                        assert(text).equalTo('No Genotypes Count available');
                                    },function(err) {});
                                });
                            },function(err) {});
                        });
                        //check for duplicate content
                        rows[i].findElement(By.className("x-accordion-body")).getAttribute('id').then(function(id){
                            driver.findElement(By.xpath("//div[@id='"+id+"']")).getText().then(function(text){
                                chai.assert.notInclude(popStatsArray, config.hashCode(text))
                                popStatsArray.push(config.hashCode(text));
                            });
                        });
                    }
                });
            });
        },function(err) {
            driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//h5")).then(function(text) {
                assert(text).equalTo('Currently for 1000 Genomes Project data only');
            },function(err) {
                driver.findElement(By.xpath("//div[contains(@id,'VariantPopulationPanel')]//div[@class='popstats-no-data']")).getText().then(function(text){
                    assert(text).equalTo('No Population data available');
                });
            });
        });

        return driver;
    }
};