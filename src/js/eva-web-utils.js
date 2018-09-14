/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014, 2015 EMBL - European Bioinformatics Institute
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

var getStudyStats = function (manager, defaultSpecies = [], defaultType = []) {
    var webServiceResponse = manager.get({
                category: 'meta/studies',
                resource: 'stats',
                params: {},
                async: false
            });

    try {
        var statsDataArray = [];
        var statsData = {};
        var responseStatsData = webServiceResponse.response[0].result[0];

        for (key in responseStatsData) {
            var stat = responseStatsData[key];
            var arr = [];
            for (key2 in stat) {
                var obj = {};
                var checked = false;
                if (key == 'species') {
                    if (_.indexOf(defaultSpecies, key2) > -1) {
                        checked = true;
                    }
                } else if (key == 'type') {
                    if (_.indexOf(defaultType, key2) > -1) {
                        checked = true;
                    }
                }
                // TODO We must take care of the types returned
                if (key2.indexOf(',') == -1) {
                    obj['display'] = key2;
                    obj['leaf'] = true;
                    obj['checked'] = checked;
                    obj['iconCls'] = "no-icon";
                    obj['count'] = stat[key2];
                }
                if (!_.isEmpty(obj)) {
                    arr.push(obj);
                }
            }

            statsData[key] = arr;
            statsData[key] = _.sortBy(statsData[key], 'display');
            statsDataArray.push(statsData);
        }
        return statsDataArray;
    } catch (e) {
        console.log(e);
    }
}