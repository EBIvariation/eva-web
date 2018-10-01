/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 - 2017 EMBL - European Bioinformatics Institute
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

function getEVASpeciesList(){
    var speciesList = '';
    EvaManager.get({
        category: 'meta/species',
        resource: 'list',
//    params: {loaded: true},
        async: false,
        success: function (response) {
            try {
                speciesList = response.response[0].result;
            } catch (e) {
                console.log(e);
            }
        }
    });

    return speciesList;
}

function getSpeciesList() {
    //TODO: This hard-coded list should eventually be removed after a web-service is made available for retrieving the set of accessioned species
    var evaAccessionedSpeciesList = [
        {"taxonomyEvaName": "carrot", "taxonomyId": 79200, "taxonomyCode": "dcarota", "assemblyAccession" : "GCA_001625215.1", "assemblyName": "ASM162521v1",
            "assemblyCode": "ASM162521v1"},
        {"taxonomyEvaName": "bony fish", "taxonomyId": 7994, "taxonomyCode": "amexicanus", "assemblyAccession" : "GCF_000372685.1",
            "assemblyName": "Astyanax_mexicanus-1.0.2", "assemblyCode": "Astyanax_mexicanus-1.0.2"}
    ]
    var speciesList = getEVASpeciesList();
    speciesList = speciesList.concat(evaAccessionedSpeciesList);
    return speciesList;
}

function getProjects(){
    var projects = '';
    EvaManager.get({
        category: 'meta/studies',
        resource: 'all',
        async: false,
        success: function (response) {
            try {
                projects = response.response[0].result;
            } catch (e) {
                console.log(e);
            }
        }
    });

    return projects;
}

DISABLE_STUDY_LINK = ['PRJX00001'];
ACCESSIONING_SERVICE = 'accessioning-service';
VARIANT_TYPE_SO_MAP = {"SNV": "SO:0001483", "DEL": "SO:0000159", "INS": "SO:0000667", "INDEL": "SO:1000032",
                       "TANDEM_REPEAT": "SO:0000705", "SEQUENCE_ALTERATION": "SO:0001059",
                       "NO_SEQUENCE_ALTERATION" : "SO:0002073", "MNV": "SO:0002007"};
SO_SERVICE = "http://www.sequenceontology.org/browser/current_release/term";
ENA_ASSEMBLY_LOOKUP_SERVICE = "https://www.ebi.ac.uk/ena/data/view";