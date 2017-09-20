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

function DgvaStatistics(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("DGVAStatistcis");
    _.extend(this, args);
    this.rendered = false;
    this.render();
}

DgvaStatistics.prototype = {
    render: function () {
        var _this = this;
        if (!this.rendered) {
            var el = document.querySelector("#" + this.targetId);
            var dgvaStatDiv = '<div class="row">' +
                                 '<div class="small-12 medium-12 large-6 columns">' +
                                    '<div id="dgva-statistics-chart-species" style="width:350px;height:350px;"></div>' +
                                 '</div>' +
                                 '<div class="small-12 medium-12 large-6 columns">' +
                                    '<div id="dgva-statistics-chart-type" style="width:350px;height:350px;"></div>' +
                                 '</div>' +
                             '</div>'
            el.innerHTML = dgvaStatDiv;
            EvaManager.get({
                category: 'meta/studies',
                resource: 'stats',
                params: {structural: true},
                success: function (response) {
                    try {
                        var stats = response.response[0].result[0];
                    } catch (e) {
                        console.log(e);
                    }
                    _this.parseData(stats);
                }
            });
        }
    },
    parseData: function (data) {
        var _this = this;
        var species_data = data.species
        var type_data = data.type
        var speciesArray = [];
        for (key in species_data) {
            speciesArray.push([key, species_data[key]]);
        }
        var speciesChartData = {id: 'dgva-statistics-chart-species', title: 'Species', chartData: speciesArray};
        _this._drawChart(speciesChartData)
        var typeArray = [];
        for (key in type_data) {
            // TODO We must take care of the types returned
            if (key.indexOf(',') == -1) {
                typeArray.push([key, type_data[key]]);
            }
        }
        var typeChartData = {id: 'dgva-statistics-chart-type', title: 'Type', chartData: typeArray};
        _this._drawChart(typeChartData);
    },
    _drawChart: function (data) {
        var label = 'Type';
        if (data.id == 'dgva-statistics-chart-species') {
            data.chartData = data.chartData.slice(0, 5);
            label = 'Species';
        }
        var id = '#' + data.id;
        var chartData = data.chartData;
        chartData.unshift([label, 'count']);
        var title = 'Top 5 '+data.title;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){
            var data = google.visualization.arrayToDataTable(chartData);
            var container = $(id),
                width = (container.width() - 15),
                height = (container.height() - 15);
            var options = {
                title: title,
                chartArea: {width: width, height:height, top:50},
                colors: ['#207A7A', '#2BA32B', '#2E4988', '#54BDBD', '#5DD15D'],
                legend:{position: 'right', alignment:'center'}
            };

            var chart = new google.visualization.PieChart($(id)[0]);
            chart.draw(data, options);
            $(id+" svg text").first().attr("x", (($(id+" svg").width() - parseInt($(id+" svg text").first().attr('x'),10)) / 4.5).toFixed(0));
            $(id+" svg text").first().attr("y", (($(id+" svg").width() - parseInt($(id+" svg text").first().attr('x'),10)) / 4).toFixed(0));
        });

    }

}