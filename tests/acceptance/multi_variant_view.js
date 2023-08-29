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
var variantView = require('./variant_view_common.js');

test.describe('Multiple Variant View - rs IDs', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs8281491,rs8281492,rs8281493');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"ID": "rs8281491", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000020.3",
                            "Chromosome": "20", "Start": "22241636", "Type": "SNV", "Created Date": "27 October 2003"},
                        {"ID": "rs8281491", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                        "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Chromosome/Contig accession": "CM025119.1",
                         "Chromosome": "20", "Start": "22270364", "Type": "SNV", "Created Date": "4 December 2021"},
                            {"ID": "rs8281492", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000018.3",
                            "Chromosome": "18", "Start": "22111824", "Type": "SNV", "Created Date": "27 October 2003"},
                        {"ID": "rs8281492", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                        "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Chromosome/Contig accession": "CM025117.1",
                        "Chromosome": "18", "Start": "22561983", "Type": "SNV", "Created Date": "4 December 2021"},
                            {"ID": "rs8281493", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000018.3",
                            "Chromosome": "18", "Start": "22110973", "Type": "SNV", "Created Date": "27 October 2003"},
                        {"ID": "rs8281493", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                        "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Chromosome/Contig accession": "CM025117.1",
                        "Chromosome": "18", "Start": "22561140", "Type": "SNV", "Created Date": "4 December 2021"}];
    variantView.runTableTestNew("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults);
});

test.describe('Multiple Variant View - ss IDs - with pagination', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL() +'?variant&accessionID=ss33584607,ss34622339,ss34818982,ss32675902,ss1915496708,ss34345272,ss1917607577,ss1917629243,ss1914435361,ss1914691448,ss1914332513&page=2');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"ID": "ss34345272", "Associated RS ID": "rs23872429",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Study": "BROAD_DBSNP.2005.2.4.16.57",
                            "Chromosome/Contig accession": "CM000034.3",
                            "Chromosome": "34", "Start": "13434863", "End": "13434863",
                            "Reference": "G", "Alternate": "A", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "Yes",
                            "Created Date": "7 May 2005"},

                            {"ID": "ss34345272", "Associated RS ID": "rs23872429",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Study": "BROAD_DBSNP.2005.2.4.16.57",
                            "Chromosome/Contig accession": "CM025133.1",
                            "Chromosome": "34", "Start": "13333178", "End": "13333178",
                            "Reference": "A", "Alternate": "G", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "No",
                            "Created Date": "7 May 2005"},

                            {"ID": "ss1917607577", "Associated RS ID": "rs852006601",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Study": "BROAD_VGB_CANINE_PON_SNP_DISCOVERY",
                            "Chromosome/Contig accession": "CM000009.3",
                            "Chromosome": "9", "Start": "49511840", "End": "49511840",
                            "Reference": "C", "Alternate": "T", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "No",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "No",
                            "Created Date": "13 October 2015"},

                            {"ID": "ss1917607577", "Associated RS ID": "rs852006601",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Study": "BROAD_VGB_CANINE_PON_SNP_DISCOVERY",
                            "Chromosome/Contig accession": "CM025108.1",
                            "Chromosome": "9", "Start": "50391111", "End": "50391111",
                            "Reference": "C", "Alternate": "T", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "No",
                            "Created Date": "13 October 2015"},

                            {"ID": "ss1917629243", "Associated RS ID": "rs851857849",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Study": "BROAD_VGB_CANINE_PON_SNP_DISCOVERY",
                            "Chromosome/Contig accession": "CM000009.3",
                            "Chromosome": "9", "Start": "55023329", "End": "55023329",
                            "Reference": "T", "Alternate": "C", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "No",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "No",
                            "Created Date": "13 October 2015"},

                           {"ID": "ss1917629243", "Associated RS ID": "rs851857849",
                            "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_014441545.1 (ROS_Cfam_1.0)", "Study": "BROAD_VGB_CANINE_PON_SNP_DISCOVERY",
                            "Chromosome/Contig accession": "CM025108.1",
                            "Chromosome": "9", "Start": "55945664", "End": "55945664",
                            "Reference": "T", "Alternate": "C", "Type": "SNV",
                            "Allele frequencies / genotypes available?": "Yes",
                            "Alleles match reference assembly?": "Yes",
                            "Passed allele checks?": "Yes", "Validated?": "No",
                            "Created Date": "13 October 2015"},
                          ];
    variantView.runTableTestNew("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults);
});
