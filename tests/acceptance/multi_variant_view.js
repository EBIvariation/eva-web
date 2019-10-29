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
var variantView = require('./variant_view.js');

test.describe('Multiple Variant View - rs IDs', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs8281491,rs8281492,rs8281493&species=cfamiliaris_31');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"ID": "rs8281491", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000020.3",
                            "Chromosome": "20", "Start": "22241636", "Type": "SNV", "Created Date": "27 October 2003"},
                            {"ID": "rs8281492", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000018.3",
                            "Chromosome": "18", "Start": "22111824", "Type": "SNV", "Created Date": "27 October 2003"},
                            {"ID": "rs8281493", "Detailed Variant view": "Detailed view", "Organism": "Dog",
                            "Assembly": "GCA_000002285.2 (CanFam3.1)", "Chromosome/Contig accession": "CM000018.3",
                            "Chromosome": "18", "Start": "22110973", "Type": "SNV", "Created Date": "27 October 2003"}];
    variantView.runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);
});
