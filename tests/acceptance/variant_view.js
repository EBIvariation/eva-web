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
var variantView = require('./variant_view_common.js');

test.describe('Variant View - rs exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=RS884750506');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1 (ASM162521v1)", "Chromosome/Contig accession": "CM004278.1",
                            "Chromosome": "1", "Start": "672678", "ID": "rs884750506", "Type": "SNV",
                            "Created Date": "27 October 2016"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);

    expectedResults = [{"ID": "ss1996903386", "Submitter Handle": "DCAR_GENOME PAPER 1393431 SNPS", "Assembly": "GCA_001625215.1 (ASM162521v1)",
                        "Chromosome/Contig accession": "CM004278.1", "Chromosome": "1", "Start": "672678", "End": "672678", "Reference": "A",
                        "Alternate": "C", "Created Date": "19 May 2016"}
                      ];
    variantView.runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, variantView.checkSection);
});

test.describe('Variant View - ss exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1996903385');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1 (ASM162521v1)", "Submitter Handle": "DCAR_GENOME PAPER 1393431 SNPS",
                            "Chromosome/Contig accession": "CM004278.1", "Chromosome": "1", "Start": "672669", "End": "672669", "Reference": "C", "Alternate": "T",
                            "ID": "ss1996903385", "Type": "SNV", "Allele frequencies / genotypes available?": "No",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "19 May 2016"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);
});

test.describe('Variant View - rs found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs869710784');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2 (Chlorocebus_sabeus 1.1)", "Chromosome/Contig accession": "CM001952.2",
                            "Chromosome": "11", "Start": "50921862", "ID": "rs869710784", "Type": "SNV",
                            "Created Date": "16 May 2016"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);

    expectedResults = [ 
        {"ID": "ss1991442915", "Submitter Handle": "PRJEB7923", "Assembly": "GCA_000409795.2 (Chlorocebus_sabeus 1.1)", "Chromosome/Contig accession": "CM001952.2",
        "Chromosome": "11", "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G", "Created Date": "5 May 2016"},
        {"ID": "ss5227751341", "Submitter Handle": "PRJEB22988", "Assembly": "GCA_000409795.2 (Chlorocebus_sabeus 1.1)", "Chromosome/Contig accession": "CM001952.2",
        "Chromosome": "11", "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G", "Created Date": "6 July 2019"},
        {"ID": "ss7406861678", "Submitter Handle": "PRJEB22989", "Assembly": "GCA_000409795.2 (Chlorocebus_sabeus 1.1)", "Chromosome/Contig accession": "CM001952.2",
        "Chromosome": "11", "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G", "Created Date": "17 July 2021"}];
    variantView.runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, variantView.checkSection);
});

test.describe('Variant View - ss found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1991442915');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2 (Chlorocebus_sabeus 1.1)", "Submitter Handle": "PRJEB7923",
                            "Chromosome/Contig accession": "CM001952.2", "Chromosome": "11", "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G",
                            "ID": "ss1991442915", "Type": "SNV", "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "5 May 2016"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);

    expectedResults = [{"Ensembl Gene ID": "-", "Ensembl Transcript ID": "-",
                            "Accession": "SO:0001628", "Name": "intergenic_variant MODIFIER"}];
    variantView.runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, variantView.checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "11", "POS": "50921862", "ID": ".", "REF": "C", "ALT": "G"}];
    // TODO: Running tests based on table IDs doesn't seem to work because SenchaJS seems to generate multiple tables
    // with the same ID!!. If this is not remedied, the values in these tests are a moving target
    // as variants get added to the archive.
    variantView.runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, variantView.checkSection);

    expectedResults = [{"Sample": "A8518", "Genotype": "1|1"}, {"Sample": "AG23", "Genotype": "1|1"},
                       {"Sample": "AG5417", "Genotype": "1|1"}, {"Sample": "AGM126", "Genotype": "1|1"}
                      ];
    variantView.runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_G", expectedResults, variantView.checkGenotypeGrid);

    expectedResults = [{"Population": "ALL", "Minor Allele Frequency": "0.165", "MAF Allele": "C",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    variantView.runTableTest("Population Statistics Section", "Population Statistics Section for C/G has the correct values",
                    "div", "popstats_C_G", expectedResults, variantView.checkPopulationStatsGrid);
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

    var expectedResults = [{"Organism": "Human", "Assembly": "", "Submitter Handle": "", "Chromosome/Contig accession": "",
                            "Chromosome":"1", "Start": "3000017", "End": "3000017", "Reference": "C", "Alternate": "T", "ID":"ss1289423512",
                            "Type": "SNV", "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "", "Passed allele checks?": "",
                            "Validated?": "", "Created Date": ""}];

    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);

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
    variantView.runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, variantView.checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "1", "POS": "3000017", "ID": "rs557866728", "REF": "C", "ALT": "T"}];
    variantView.runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, variantView.checkSection);

    expectedResults = [{"Sample": "HG00096", "Genotype": "0|0"}, {"Sample": "HG00097", "Genotype": "0|0"},
                       {"Sample": "HG00099", "Genotype": "0|0"}, {"Sample": "HG00100", "Genotype": "0|0"}
                      ];
    variantView.runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_T", expectedResults, variantView.checkGenotypeGrid);

    expectedResults = [{"Population": "ACB", "Minor Allele Frequency": "0", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"},
                       {"Population": "ALL", "Minor Allele Frequency": "1.997e-4", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    variantView.runTableTest("Population Statistics Section", "Population Statistics Section has the correct values",
                    "div", "popstats_C_T", expectedResults, variantView.checkPopulationStatsGrid);
});

test.describe('Variant View - Invalid RS', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs1234');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    variantView.checkNoDataAvailable("Invalid RS", "Invalid RS shows proper error message", "div", "summary-grid", "No Data Available in EVA for rs1234.");
});

test.describe('Variant View - Human RS exclusive to accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs2913');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Human", "Assembly": "GCA_000001405.27 (GRCh38.p12)",
                            "Chromosome/Contig accession": "CM000684.2", "Chromosome": "22", "Start": "18994584",
                            "ID": "rs2913", "Type": "SNV", "Created Date": "19 September 2000"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, variantView.checkSection);

    //TODO: this should be updated with SS ID results after dbSNP Human SS IDs have been imported into EVA accessioning
    expectedResults = [];
    variantView.runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, variantView.checkSection);
});

test.describe('Variant View - RS with multiple entires', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs105032341');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "rat", "Assembly": "GCA_015227675.2 (mRatBN7.2)",
                            "Chromosome/Contig accession": "CM026974.1", "Chromosome": "1", "Start": "150694351",
                            "ID": "rs105032341", "Type": "SNV", "Created Date": "1 December 2021"},
                            {"Organism": "rat", "Assembly": "GCA_000001895.4 (Rnor_6.0)",
                            "Chromosome/Contig accession": "CM000072.5", "Chromosome": "1", "Start": "161315554",
                            "ID": "rs105032341", "Type": "SNV", "Created Date": "25 May 2010"},
                            {"Organism": "rat", "Assembly": "GCA_000002265.1 (Rn_Celera)",
                            "Chromosome/Contig accession": "CM000231.2", "Chromosome": "1", "Start": "148800140",
                            "ID": "rs105032341", "Type": "SNV", "Created Date": "25 May 2010"}
                        ];
    variantView.runTableTestNew("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults);

    expectedResults = [{"ID": "ss93228403", "Study": "ENSEMBL_RAT_COMPUTATIONAL_CELERA", "Assembly": "GCA_015227675.2 (mRatBN7.2)",
                        "Chromosome/Contig accession": "CM026974.1", "Chromosome": "1", "Start": "150694351",
                        "End": "150694351", "Reference": "G", "Alternate": "C", "Created Date": "3 January 2010"},
                        {"ID": "ss7306907838", "Study": "PRJEB42012", "Assembly": "GCA_015227675.2 (mRatBN7.2)",
                        "Chromosome/Contig accession": "CM026974.1", "Chromosome": "1", "Start": "150694351",
                        "End": "150694351", "Reference": "G", "Alternate": "C", "Created Date": "8 February 2021"},
                        {"ID": "ss93228403", "Study": "ENSEMBL_RAT_COMPUTATIONAL_CELERA", "Assembly": "GCA_000001895.4 (Rnor_6.0)",
                        "Chromosome/Contig accession": "CM000072.5", "Chromosome": "1", "Start": "161315554",
                        "End": "161315554", "Reference": "G", "Alternate": "C", "Created Date": "3 January 2010"},
                        {"ID": "ss93228403", "Study": "ENSEMBL_RAT_COMPUTATIONAL_CELERA", "Assembly": "GCA_000002265.1 (Rn_Celera)",
                        "Chromosome/Contig accession": "CM000231.2", "Chromosome": "1", "Start": "148800140",
                        "End": "148800140", "Reference": "G", "Alternate": "C", "Created Date": "3 January 2010"}
                      ];
    variantView.runTableTestNew("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults);
});
