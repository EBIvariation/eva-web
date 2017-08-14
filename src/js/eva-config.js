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

function getSpeciesList(){
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