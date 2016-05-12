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
function EvaVariantPopulationStatsPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("VariantPopulationPanel");
    this.target;
    this.title = "Stats";
    this.height = 500;
    this.autoRender = true;
    this.statsTpl = new Ext.XTemplate(
        '<table class="ocb-stats-table">' +
            '<tr>' +
            '<td class="header">Minor Allele Frequency:</td>' +
            '<td>{maf} ({mafAllele})</td>' +
            '</tr>',
        '<tr>' +
            '<td class="header">Minor Genotype Frequency:</td>' +
            '<td>{mgf} ({mgfAllele})</td>' +
            '</tr>',
        '<tr>' +
            '<td class="header">Mendelian Errors:</td>' +
            '<td>{mendelianErrors}</td>' +
            '</tr>',
        '<tr>' +
            '<td class="header">Missing Alleles:</td>' +
            '<td>{missingAlleles}</td>' +
            '</tr>',
        '<tr>' +
            '<td class="header">Missing Genotypes:</td>' +
            '<td>{missingGenotypes}</td>' +
            '</tr>',
        '</table>'
    );
    this.tooltipText = "Population frequency data. N.B. “*” in the genotype denotes ‘not reference but exact ALT not known’. This is a temporary solution whilst we work with the VCF specification team to better describe these complex cases";
    _.extend(this, args);
    this.on(this.handlers);
    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
}

EvaVariantPopulationStatsPanel.prototype = {
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
        if (params.species) {
            for (var key in data) {
                var study = data[key];
                var studyPanel = this._createPopulationGridPanel(study, params, studies);
                panels.push(studyPanel);
            }
            panels = _.sortBy(panels, 'projectName');
            this.studiesContainer.add(panels);
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
            overflowY: true,
            overflowX: true,
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    id: 'populationStats',
                    cls: 'ocb-header-4',
                    html: '<h4>Population Statistics <img class="title-header-icon" data-qtip="'+this.tooltipText+'" style="margin-bottom:2px;" src="img/icon-info.png"/></h4><p style="margin-left:-15px;" class="genotype-grid-no-data">&nbsp;No Population data available</p>',
                    margin: '5 0 10 15'
                },
                this.studiesContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createPopulationGridPanel: function (data, params, studies) {
        var _this = this;
        var populationData = [];
        var fileId = data.fileId;
        _.each(_.keys(data.cohortStats), function (key) {
            var tempObj = _.extend(this[key], {id: key})
            populationData.push(tempObj);

        }, data.cohortStats);

        //TO BE REMOVED
        var study_title;
        var project_name = data.studyId;
        if (studies) {
            for (var i = 0; i < studies.length; i++) {
                if (studies[i].studyId === data.studyId) {
                    project_name = studies[i].studyName;
                    link = studies[i].link;
                }
            }
        }

        study_title = project_name + ' (' + data.studyId +' - <a href="ftp://ftp.ebi.ac.uk/pub/databases/eva/' + data.studyId + '/'+fileId+'" class="ftp_link" target="_blank">' + fileId + '</a>)';
        if(link){
            study_title = '<a href="?eva-study=' + data.studyId + '" class="study_link" target="_blank">' + project_name + '</a> (<a href="?eva-study=' + data.studyId + '" class="project_link" target="_blank">' + data.studyId +'</a> - <a href="ftp://ftp.ebi.ac.uk/pub/databases/eva/' + data.studyId + '/'+fileId+'" class="ftp_link" target="_blank">' + fileId + '</a>)';
        }


        var populationStatsColumns = {
            items: [
                {
                    text: "Population",
                    dataIndex: "id",
                    flex: 0.4
                },
                {
                    text: "Minor Allele Frequency",
                    dataIndex: "maf",
                    xtype: "templatecolumn",
                    tpl: new Ext.XTemplate('<tpl if="maf == -1">NA <tpl else>{[this.testInfo(values)]} </tpl>',
                    {
                        testInfo: function (data) {
                           var value = '';
                            if(data.maf){
                                if(data.maf < 0.001){
                                    value = data.maf.toExponential(3);
                                }else{
                                    value = (Math.floor(1000 * data.maf) / 1000).toFixed(3);
                                }
                            }else if (data.maf == 0){
                               value = data.maf;
                            }else{
                               value = 0;
                            }

                            return value;
                        }
                    }),
                    flex: 0.75
                },
                {
                    text: "MAF Allele",
                    dataIndex: "mafAllele",
                    xtype: "templatecolumn",
                    tpl: '<tpl if="mafAllele">{mafAllele:htmlEncode} <tpl else>-</tpl>',
                    flex: 0.5
                },
                {
                    text: "Missing Alleles",
                    dataIndex: "missingAlleles",
                    xtype: "templatecolumn",
                    tpl: '<tpl if="missingAlleles == -1">NA <tpl else>{missingAlleles}</tpl>',
                    flex: 0.6
                },
                {
                    text: "Missing Genotypes",
                    dataIndex: "missingGenotypes",
                    xtype: "templatecolumn",
                    tpl: '<tpl if="missingGenotypes == -1">NA <tpl else>{missingGenotypes}</tpl>',
                    flex: 0.7
                }
            ],
            defaults: {
                align: 'center',
                sortable: true
            }
        };

        if (_.isEmpty(populationData)) {
            Ext.getCmp('populationStats').update('<h4>Population Statistics <img class="title-header-icon" data-qtip="'+this.tooltipText+'" style="margin-bottom:2px;" src="img/icon-info.png"/></h4><p style="margin-left:-15px;" class="genotype-grid-no-data">&nbsp;No Population data available</p>')
            return;
        } else {
            Ext.getCmp('populationStats').update('<h4>Population Statistics <img class="title-header-icon" data-qtip="'+this.tooltipText+'" style="margin-bottom:2px;" src="img/icon-info.png"/></h4>')
        }
        var store = Ext.create("Ext.data.Store", {
            //storeId: "GenotypeStore",
            pageSize: 10,
            fields: [
                {name: "altAllele", type: "string" },
                {name: "altAlleleCount", type: "string"}
            ],
            data: populationData,
            proxy: {
                type: 'memory'
            },
            sorters: {
                property: 'id',
                direction: 'ASC'
            }
        });

        var plugins = [
            {
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate()
            }
        ];

        var gridHeight = '';
        if (_.isEmpty(populationData)) {
            gridHeight = 100;
        }

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            loadMask: true,
            height:gridHeight,
            width: 900,
            cls: 'population-stats-grid',
            margin: 20,
            viewConfig: {
                emptyText: 'No records to display',
                enableTextSelection: true,
                deferEmptyText: false
            },
            columns: populationStatsColumns,
            plugins: plugins
        });

        grid.view.on('expandbody', function (rowNode, record, body, rowIndex) {
            var genotypesCount = record.data.genotypesCount;
            console.log(genotypesCount)
            var divID = 'population-stats-grid-' + record.data.id + data.fileId;
            if (!_.isEmpty(genotypesCount)) {
                body.innerHTML = '<div style="width:800px;" id="' + divID + '"></div>';
                var tempArray = [];
                _.each(_.keys(genotypesCount), function (key) {
//                    genotypesCountArray.push([key.formatAlleles(), this[key]]);
                    tempArray.push({Name:key.formatAlleles(), Value:this[key]});
                }, genotypesCount);
                var linq = Enumerable.from(tempArray);
                var result =
                    linq.groupBy(function(x){return x.Name;})
                        .select(function(x){return { Name:x.key(), Value: x.sum(function(y){return y.Value|0;}) };})
                        .toArray();
                var genotypesCountArray = [];
                _.each(_.keys(result), function (key) {
                    console.log(this[key])
                    genotypesCountArray.push([this[key].Name, this[key].Value]);
                },result);
                var genotypesCountChartData = {id: divID, title: 'Genotype Count', chartData: genotypesCountArray};
                _this._drawChart(genotypesCountChartData);
            } else {
                body.innerHTML = '<div class="popstats-no-genotype-data"style="width:800px;">No Genotypes Count available</div>';
            }
        });

        var studyPanel = Ext.create('Ext.panel.Panel', {
            header: {
                titlePosition: 1
            },
            title: '<span class="popStats-panel-study-title">' + study_title + '</span>',
            projectName:project_name,
            border: false,
            layout: 'fit',
            overflowX: true,
            items: [grid]
        });

        return studyPanel;
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
        var _this = this;
        var height = 290;
        var width = 250;
        var id = '#' + data.id;
        var render_id = document.querySelector(id);
        var dataArray = data.chartData;
        var title = data.title;

        $(function () {
            Highcharts.setOptions({
                colors: ['#207A7A', '#2BA32B', '#2E4988', '#54BDBD', '#5DD15D', '#6380C4', '#70BDBD', '#7CD17C', '#7D92C4', '#295C5C', '#377A37', '#344366', '#0A4F4F', '#0E6A0E', '#0F2559' ],
                chart: {
                    style: {
                        fontFamily: 'sans-serif;'
                    }
                }
            });
            $(render_id).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    height: height,
                    marginLeft: 50,
                    marginTop: 50
                },
                legend: {
                    enabled: true,
                    margin: 0,
                    labelFormatter: function () {
                        return '<div>' + this.name + '(' + this.y + ')</div>';
                    },
                    layout: 'horizontal',
                    useHTML: true,
                    align: 'center'
                },
                title: {
                    text: title,
                    style: {},
                    align: 'center'
                },
                tooltip: {
                    pointFormat: '<b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [
                    {
                        type: 'pie',
                        name: 'Studies by ' + title,
                        data: dataArray
                    }
                ],
                credits: {
                    enabled: false
                }
            });

        });

    }
};

String.prototype.escapeHTML = function () {
    return(
        this.replace(/>/g, '&gt;').
            replace(/</g, '&lt;').
            replace(/"/g, '&quot;')
        );
};


