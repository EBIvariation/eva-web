/*
 * Copyright (c) 2014 Francisco Salavert (SGL-CIPF)
 * Copyright (c) 2014 Alejandro Alemán (SGL-CIPF)
 * Copyright (c) 2014 Ignacio Medina (EBI-EMBL)
 *
 * This file is part of JSorolla.
 *
 * JSorolla is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JSorolla is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSorolla. If not, see <http://www.gnu.org/licenses/>.
 */
function EvaVariantGenotypeGridPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("VariantGenotypeGrid");
    this.autoRender = true;
    this.storeConfig = {};
    this.gridConfig = {};
    this.height = 200;
    this.target;
    this.columns = [
        {
            text: "Sample",
            dataIndex: "sample",
            flex: 1
        },
        {
            text: "Genotype",
            dataIndex: "genotype",
            flex: 1
        },
        {
            text: "Sex",
            dataIndex: "sex",
            flex: 1
        },
        {
            text: "Phenotype",
            dataIndex: "phenotype",
            flex: 1
        }
    ];

    this.tooltipText = "Genotype data for the selected variant, split by study. N.B. “*” in the genotype denotes ‘not reference but exact ALT unknown’. This is a temporary solution whilst we work with the VCF specification team to better describe these complex cases";

    _.extend(this, args);
    this.genotypesPanelID = 'genotypes' + (this.panelID ? this.panelID : '');

    this.on(this.handlers);

    this.rendered = false;

    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaVariantGenotypeGridPanel.prototype = {
    render: function () {
        var _this = this;

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        this.panel = this._createPanel();

    },
    draw: function () {
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);
        this.panel.render(this.div);
    },
    clear: function () {
        this.studiesContainer.removeAll(true);
    },
    load: function (data, params, studies) {
        var _this = this;
        this.clear();
        var panels = [];
        var genotypeData = [];
        var genotypeChartData = [];


        var genotypesHeading = "<h4>Genotypes" +
                                                (this.variantAlleles? " for " + this.variantAlleles: "") + "</h4>";
        for (var key in data) {
            var study = data[key];
            if (!_.isUndefined(study.samplesData) && Object.keys(study.samplesData).length > 0) {
                Ext.getCmp(this.genotypesPanelID).update(genotypesHeading + '<h6><small>' + this.tooltipText + '</small></h6>');
                var genotypePanel = this._createGenotypePanel(study, params, studies);
                genotypeChartData.push(genotypePanel.chartData)
                panels.push(genotypePanel);
            }
        }

        if (_.isEmpty(panels)) {
            Ext.getCmp(this.genotypesPanelID).update(genotypesHeading + '<p class="genotype-grid-no-data">No Genotypes data available</p>');
            this._lowerPanelHeightWhenDataAbsent();
        }
        this.clear();
        panels = _.sortBy(panels, 'projectName');
        this.studiesContainer.add(panels);

        _.each(_.keys(genotypeChartData), function (key) {
            _this._drawChart(this[key]);
        }, genotypeChartData);
    },
    _lowerPanelHeightWhenDataAbsent: function() {
        if (this.invokedFromVariantView) {
            Ext.getCmp("genotypes-containing-panel-" + this.genotypesPanelID).setHeight(120);
        }
    },
    _createPanel: function () {
        this.studiesContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'accordion',
                titleCollapse: true,
                multi: true
            }
        });

        this.panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            id: "genotypes-containing-panel-" + this.genotypesPanelID,
            overflowY: true,
            padding: 0,
            items: [
                {
                    xtype: 'box',
                    id: this.genotypesPanelID,
                    cls: 'ocb-header-4',
                    html: '<h4>Genotypes</h4><h6><small>'+this.tooltipText+'</small></h6>',
                    margin: '5 0 10 10'
                },
                this.studiesContainer
            ],
            height: this.height,
            margin: '5 0 10 10'
        });
        return this.panel;
    },
    _createGenotypePanel: function (data, params, studies) {
        var study_title;
        var fileId = data.fileId;
        var project_name = data.studyId;
        if (studies) {
            for (var i = 0; i < studies.length; i++) {
                if (studies[i].studyId === data.studyId) {
                    project_name = studies[i].studyName;
                    link = studies[i].link;
                }
            }
        }

        study_title = project_name + ' (' + data.studyId +')';
        if(link){
            study_title = '<a href="?eva-study=' + data.studyId + '" class="study_link" target="_blank">' + project_name + '</a> (<a href="?eva-study=' + data.studyId + '" class="project_link" target="_blank">' + data.studyId +'</a>)';
        }

        var samples = data.samplesData;
        var finalData = [];
        var chartData = [];

        for (var key in samples) {
            var s = samples[key];
            var allels = s.GT.formatAlleles();

            chartData.push({value: allels});
            finalData.push({
                sample: key,
                genotype: allels
            });
        }


        var store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'sample'},
                {name: 'genotype'}
            ],
            data: finalData,
            sorters: [
                {
                    property: 'sample',
                    direction: 'ASC'
                }
            ]
        });

        var genotypeColumns = {
            items: [
                {
                    text: 'Sample',
                    flex: 1.6,
                    dataIndex: 'sample'
                },
                {
                    text: 'Genotype',
                    flex: 1,
                    dataIndex: 'genotype'
                }
            ],
            defaults: {
                align: 'left',
                sortable: true
            }
        };

        var grid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            store: store,
            loadMask: true,
            overflowY: true,
            height: 300,
            cls: 'genotype-grid',
            margin: 20,
            columns: genotypeColumns
        });

        var divID = Utils.genId("genotype-count-chart-") + data.studyId;
        var tpl = new Ext.XTemplate(['<div id="' + divID + '" style="height:300px;"></div>']);
        var view = Ext.create('Ext.view.View', {
            tpl: tpl,
            margin: '20 0 0 0'
        });



        var tempGenotypeCount = _.groupBy(chartData, 'value');
        var genotypeCountArray = [];

        _.each(_.keys(tempGenotypeCount), function (key) {
            var obj = {};
            obj[key] = this[key].length;
            genotypeCountArray.push([key, this[key].length]);
        }, tempGenotypeCount);

        var chartData = {id: divID, data: genotypeCountArray, title: 'Genotype Count'}

        var panel = Ext.create('Ext.panel.Panel', {
            header: {
                titlePosition: 1
            },
            title: '<span class="genotype-grid-study-title">' + study_title + '</span>',
            projectName:project_name,
            border: false,
            layout: {
                type: 'hbox',
                align: 'fit'
            },
            items: [
                {
                    xtype: 'panel',
                    flex: 1.5,
                    border: false,
                    items: [grid]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    border: false,
                    height: 300,
                    items: [view]
                }
            ]
        });

        _.extend(panel, {chartData: chartData});

        return  panel;

    },
    _getGenotypeCount: function (gc) {
        var res = [];
        for (var key in gc) {
            res.push({
                genotype: key,
                count: gc[key]
            })
        }
        return res;
    },
    _drawChart: function (data) {
        google.charts.load('current', {'packages':['corechart']});
        var id = '#' + data.id;
        var chartData = data.data;
        var title = data.title;
        chartData.unshift(['Genotypes', 'count']);
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){
            var data = google.visualization.arrayToDataTable(chartData);
            var container = $(id),
                width = (container.width() - 100),
                height = (container.height() - 100);
            var options = {
                title: title,
                chartArea: {width: width, height:height, top:50},
                colors: ['#207A7A', '#2BA32B', '#2E4988', '#54BDBD', '#5DD15D', '#6380C4', '#70BDBD', '#7CD17C', '#7D92C4', '#295C5C', '#377A37', '#344366', '#0A4F4F', '#0E6A0E', '#0F2559'],
                legend:{position: 'right', alignment:'center'}
            };

            var chart = new google.visualization.PieChart($(id)[0]);
            chart.draw(data, options);
            $(id+" svg text").first().attr("x", (($(id+" svg").width() - parseInt($(id+" svg text").first().attr('x'),10)) / 3.5).toFixed(0));
        });
    }
};
String.prototype.formatAlleles = function () {
    var allels = this;
    var temp;
    var first;
    var second;
    var split;
    var haploid_genotype = (this.indexOf("/") == -1 && this.indexOf("|") == -1);

    if (!haploid_genotype) {
        if (allels.match(/-1\/-1/)) {
            allels = './.';
        }else if(allels.match(/-1\|-1/)){
            allels = '.|.';
        }

        if (this.indexOf("|") > -1) {
            temp = allels.split("|");
            split = '|';
        }else if(this.indexOf("/") > -1) {
            temp = allels.split("/");
            split = '/';
        }
        if(!_.isEmpty( temp[0]) && !_.isUndefined(temp[0]) && temp[0] > 1){
            first = '*';
        }else{
            first = temp[0];
        }

        if(!_.isEmpty( temp[1]) && !_.isUndefined(temp[1]) && temp[1] > 1){
            second = '*';
        }else{
            second = temp[1];
        }
        allels = first+split+second;
    }

    return allels;
};
