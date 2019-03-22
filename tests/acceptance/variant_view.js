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
var variantBrowser = require('./variant_browser_bottom_panel_tests.js');

function runTableTest(sectionName, testName, element, elementID, expectedResults, checkFunction) {
    test.describe(sectionName, function() {
        test.it(testName, function() {
            var rowIndex = 1;
            expectedResults.forEach(function(expectedResult) {
                var colIndex = 1;
                for (var expectedResultKey in expectedResult) {
                    checkFunction(driver, element, elementID, rowIndex, colIndex, expectedResult[expectedResultKey]);
                    colIndex += 1;
                }
                rowIndex += 1;
            });
        });
    });
}

function checkSection(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var tableToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = tableToFind + "//tr[" + rowIndex + "]" + "//td[" + colIndex + "]";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkGenotypeGrid(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var divToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + colIndex + "]//div";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkPopulationStatsGrid(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var divToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + (colIndex + 1) + "]//div";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkElementContent(sectionName, testName, element, elementID, expectedValue) {
    test.describe(sectionName, function() {
        test.it(testName, function() {
            var elementToFind = "//" + element + "[@id='" + elementID + "']";
            driver.wait(until.elementLocated(By.xpath(elementToFind)), config.wait()).then(function(text) {
                driver.findElement(By.xpath(elementToFind)).getText().then(function(text){
                    assert(text).equalTo(expectedValue);
                });
            });
        });
    });
}

function checkNoDataAvailable(sectionName, testName, element, elementID, expectedValue) {
    test.describe(sectionName, function() {
        test.it(testName, function() {
            var elementToFind = "//" + element + "[@id='" + elementID + "']//div[1]//span";
            driver.wait(until.elementLocated(By.xpath(elementToFind)), config.wait()).then(function(text) {
                driver.findElement(By.xpath(elementToFind)).getText().then(function(text){
                    assert(text).equalTo(expectedValue);
                });
            });
        });
    });
}

test.describe('Variant View - rs exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs884750506&species=dcarota_ASM162521v1');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1", "Contig": "CM004278.1",
                            "Start": "672678", "ID": "rs884750506", "Type": "SNV",
                            "Created Date": "27 October 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"ID": "ss1996903386", "Submitter Handle": "DCAR_GENOME PAPER 1393431 SNPS",
                        "Contig": "CM004278.1", "Start": "672678", "End": "672678", "Reference": "A",
                        "Alternate": "C,G,T", "Created Date": "19 May 2016"}
                      ];
    runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, checkSection);
});

test.describe('Variant View - ss exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1996903385&species=dcarota_ASM162521v1');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1", "Submitter Handle": "DCAR_GENOME PAPER 1393431 SNPS",
                            "Contig": "CM004278.1", "Start": "672669", "End": "672669", "Reference": "C", "Alternate": "T",
                            "ID": "ss1996903385", "Type": "SNV", "Allele frequencies / genotypes available?": "No",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "19 May 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);
});

test.describe('Variant View - rs found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs869710784&species=csabaeus_chlsab11');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2", "Contig": "11",
                            "Start": "50921862", "ID": "rs869710784", "Type": "SNV",
                            "Created Date": "16 May 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"ID": "ss1991442915", "Submitter Handle": "PRJEB7923", "Contig": "11", "Start": "50921862",
                        "End": "50921862", "Reference": "C", "Alternate": "G", "Created Date": "5 May 2016"}
                      ];
    runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, checkSection);
});

test.describe('Variant View - ss found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1991442915&species=csabaeus_chlsab11');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2", "Submitter Handle": "PRJEB7923",
                            "Contig": "11", "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G",
                            "ID": "ss1991442915", "Type": "SNV", "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "5 May 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"Ensembl Gene ID": "-", "Ensembl Transcript ID": "-",
                            "Accession": "SO:0001628", "Name": "intergenic_variant MODIFIER"}];
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "11", "POS": "50921862", "ID": ".", "REF": "C", "ALT": "G"}];
    // TODO: Running tests based on table IDs doesn't seem to work because SenchaJS seems to generate multiple tables
    // with the same ID!!. If this is not remedied, the values in these tests are a moving target
    // as variants get added to the archive.
    runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, checkSection);

    expectedResults = [{"Sample": "A8518", "Genotype": "1|1"}, {"Sample": "AG23", "Genotype": "1|1"},
                       {"Sample": "AG5417", "Genotype": "1|1"}, {"Sample": "AGM126", "Genotype": "1|1"}
                      ];
    runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_G", expectedResults, checkGenotypeGrid);

    expectedResults = [{"Population": "ALL", "Minor Allele Frequency": "0.165", "MAF Allele": "C",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    runTableTest("Population Statistics Section", "Population Statistics Section for C/G has the correct values",
                    "div", "popstats_C_G", expectedResults, checkPopulationStatsGrid);
});

test.describe('Variant View - ss by position', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant=1:3000017:C:T&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Human", "Assembly": "GCA_000001405.1", "Submitter Handle": "", "Contig": "1",
                            "Start": "3000017", "End": "3000017", "Reference": "C", "Alternate": "T", "ID":"ss1289423512",
                            "Type": "", "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "", "Passed allele checks?": "",
                            "Validated?": "", "Created Date": ""}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000270722",
                                "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000378391",
                                "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000378398",
                               "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000441472",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000442529",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000511072",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000514189",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000607632",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000607632",
                             "Accession": "SO:0001619", "Name": "non_coding_transcript_variant MODIFIER"},
                      ];
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "1", "POS": "3000017", "ID": "rs557866728", "REF": "C", "ALT": "T"}];
    runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, checkSection);

    expectedResults = [{"Sample": "HG00096", "Genotype": "0|0"}, {"Sample": "HG00097", "Genotype": "0|0"},
                       {"Sample": "HG00099", "Genotype": "0|0"}, {"Sample": "HG00100", "Genotype": "0|0"}
                      ];
    runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_T", expectedResults, checkGenotypeGrid);

    expectedResults = [{"Population": "ACB", "Minor Allele Frequency": "0", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"},
                       {"Population": "ALL", "Minor Allele Frequency": "1.997e-4", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    runTableTest("Population Statistics Section", "Population Statistics Section has the correct values",
                    "div", "popstats_C_T", expectedResults, checkPopulationStatsGrid);
});

test.describe('Variant View - Invalid SS', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs123&species=dcarota_ASM162521v1');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    checkNoDataAvailable("Invalid SS", "Invalid SS shows proper error message", "div", "summary-grid", "No Data Available");
});
