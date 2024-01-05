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

function getAccessionedSpeciesList() {
    var speciesList = '';
    EvaManager.get({
        category: 'meta/species',
        resource: 'accessioned',
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
    //Use assembly accession to de-duplicate common accessions between the
    //browsable assemblies list and the accessioned assemblies list
    return _.uniq(getEVASpeciesList().concat(getAccessionedSpeciesList()),
                    function(listItem, key, unused) { return [listItem.taxonomyId, listItem.assemblyAccession].join(); });
}

function deDuplicatedSpeciesList(speciesList) {
    //In the case of multiple assemblies like Grch37 and Grch37.p13 in the species list, use only the first one since
    //they both have the same assembly name and variants from either assembly reside within the same database
    speciesList = _.sortBy(speciesList, function(listItem) {
                                            return [listItem.assemblyAccession,
                                                    listItem.taxonomyEvaName.toLowerCase()].join(); });
    return _.uniq(speciesList, function(listItem, key, unused) {
        // Different species can have assembly codes which coincide with each other, e. g. "Pepper Zunla 1 Ref_v1.0"
        // (taxonomy ID 4072) and L_crocea_1.0 (taxonomy ID 215358) both have the assembly code of "10". Because of
        // this, we need to have uniq over a tuple of taxonomy ID and assembly code.
        return [listItem.taxonomyId, listItem.assemblyCode].join();
    });
}

function deDuplicateSpeciesListWithAssemblyAccession(speciesList) {
    //Show multiple assemblies within a single build in the same species as opposed to deDuplicatedSpeciesList
    //which only shows only one entry per species ex: Human only shows grch37 and grch38
    //ex: Human should show grch38.p3, grch38.p12 etc.,
    speciesList = _.sortBy(speciesList, function(listItem) {
                                            return [listItem.assemblyAccession,
                                                    listItem.taxonomyEvaName.toLowerCase()].join(); });
    return _.uniq(speciesList, function(listItem, key, unused) {
        return [listItem.taxonomyId, listItem.assemblyAccession].join();
    });
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

function getReverseMap (forwardMap) {
    var reverseMap = {};
    for (var key in forwardMap) {
        if (forwardMap.hasOwnProperty(key)) {
            reverseMap[forwardMap[key]] = key;
        }
    }
    return reverseMap;
}

DISABLE_STUDY_LINK = ['PRJX00001'];
ACCESSIONING_SERVICE = 'accessioning-service';
VARIANT_TYPE_SO_MAP = {"SNV": "SO:0001483",
                       "DEL": "SO:0000159",
                       "INS": "SO:0000667",
                       "INDEL": "SO:1000032",
                       "TANDEM_REPEAT": "SO:0000705",
                       "SEQUENCE_ALTERATION": "SO:0001059",
                       "NO_SEQUENCE_ALTERATION" : "SO:0002073",
                       "MNV": "SO:0002007"};
SO_SERVICE = "http://www.sequenceontology.org/browser/current_release/term";
ENA_XML_API_SERVICE = "https://www.ebi.ac.uk/ena/browser/api/xml";
ENA_TEXT_API_SERVICE = "https://www.ebi.ac.uk/ena/browser/api/text";
ENA_VIEW_LINK_SERVICE = "https://www.ebi.ac.uk/ena/browser/view";
NCBI_ASSEMBLY_LOOKUP_SERVICE = "https://www.ncbi.nlm.nih.gov/assembly";
ASSEMBLY_GCA_TO_GCF_SYNONYMS = {"GCA_000409795.2" : "GCF_000409795.2" /*Vervet Monkey*/,
                                "GCA_001625215.1" : "GCF_001625215.1" /*Carrot*/,
                                "GCA_000372685.1" : "GCF_000372685.1" /*Mexican tetra*/,
                                "GCA_000001735.1" : "GCF_000001735.3" /*Arabidopsis*/,
                                "GCA_000331145.1" : "GCF_000331145.1" /*Chickpea*/,
                                "GCA_000695525.1" : "GCF_000695525.1" /*Wild cabbage*/,
                                "GCA_000309985.1" : "GCF_000309985.1" /*Field mustard*/,
                                "GCA_000219495.1" : "GCF_000219495.1" /*Barrel medic*/,
                                "GCA_000001215.4" : "GCF_000001215.4" /*Fruit fly*/,
                                "GCA_000002305.1" : "GCF_000002305.2" /*Horse*/,
                                "GCA_000002775.1" : "GCF_000002775.1" /*Cottonwood*/,
                                "GCA_000317765.1" : "GCF_000317765.1" /*Goat*/,
                                "GCA_000442705.1" : "GCF_000442705.1" /*Oil Palm*/,
                                "GCA_000004665.1" : "GCF_000004665.1" /*Common Marmoset*/}
ASSEMBLY_GCF_TO_GCA_SYNONYMS = getReverseMap(ASSEMBLY_GCA_TO_GCF_SYNONYMS);
