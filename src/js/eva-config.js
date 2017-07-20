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

clinVarSpeciesList = [
    {
        assemblyCode: "grch37",
        taxonomyCode: "hsapiens",
        taxonomyEvaName: "Human",
        assemblyName: "GRCh37"

    }
];


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

var AVAILABLE_SPECIES = {
    "text": "Species",
    "items": [
        {
            "text": "Vertebrates",
            "items": [
                {"text": "Homo sapiens", "assembly": "GRCh37.p10"},
                {"text": "Chlorocebus sabaeus", "assembly": "Chlorocebus_sabeus 1.1"},
                {"text": "Oryzias latipes", "assembly": "ASM31367v1"},
                {"text": "Bos taurus", "assembly": "Bos_taurus_UMD_3.1"},
                {"text": "Ovis aries", "assembly": "Oar_v3.1"},
                {"text": "Mus musculus", "assembly": "GRCm38.p3"},
                {"text": "Capra hircus", "assembly": "CHIR_1.0"},
            ]
        },
        {
            "text": "Metazoa",
            "items": [
                {"text": "Anopheles gambiae", "assembly": "AgamP3"}
            ]
        },
        {
            "text": "Plants",
            "items": [
                {"text": "Solanum lycopersicum", "assembly": "SL2.40"},
                {"text": "Zea Mays", "assembly": "AGPv3"},
                {"text": "Shorgum bicolor", "assembly": "Sorbi1"},
            ]
        }
    ]
};

DISABLE_STUDY_LINK = ['PRJX00001'];