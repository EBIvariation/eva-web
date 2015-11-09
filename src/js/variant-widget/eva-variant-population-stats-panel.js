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
    load: function (data,params) {
        var _this = this;
        this.clear();

        var panels = [];

//        var availableStudies = ['301','8616'];
        var availableStudies = ['301','8616', 'PRJEB6930','PRJEB4019'];

        if(params.species == 'hsapiens_grch37'){
            for (var key in data) {
                var study = data[key];
                if(params.species == 'hsapiens_grch37'){
                    if(_.indexOf(availableStudies, study.studyId) > -1){
                        var studyPanel = this._createPopulationGridPanel(study,params);
                    }else{
                        Ext.getCmp('populationStats').update('<h4>Population Statistics</h4><h5 style="color:#436883;margin-left:-15px;font-size:14px;">Currently for 1000 Genomes Project data only</h5>')
                    }
                }else{
                    var studyPanel = this._createPopulationGridPanel(study,params);
                }


                panels.push(studyPanel);

            }
            this.studiesContainer.add(panels);
        }else{
            var grid = Ext.create('Ext.view.View', {
                tpl: new Ext.XTemplate(['<div style="margin-left:5px;">No Population data available</div>'])
            });
            var studyPanel = Ext.create('Ext.panel.Panel', {
//                header:{
//                    titlePosition:1
//                },
                id:'popStats',
                title: '',
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'fit'
                },
                overflowX:true,
                items: [grid]
            });
//            Ext.getCmp('populationStats').update('<h4>Population Statistics</h4>')
            this.studiesContainer.add(studyPanel);
            if(Ext.getCmp('popStats').getHeader()){
                Ext.getCmp('popStats').getHeader().hide();
            }

        }


    },
    _createPanel: function () {
        this.studiesContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'accordion',
                titleCollapse: true,
//                fill: false,
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
                    id:'populationStats',
                    cls: 'ocb-header-4',
                    html: '<h4>Population Statistics <img class="title-header-icon" data-qtip="Population frequency data. Currently available only for the 1000 Genomes project." style="margin-bottom:2px;" src="img/icon-info.png"/></h4>',
                    margin: '5 0 10 15'
                },
                this.studiesContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createPopulationGridPanel: function (data,params) {
        var _this = this;

        var populationData = [];
        _.each(_.keys(data.cohortStats), function(key){
            var tempObj =  _.extend(this[key], {id:key})
            populationData.push(tempObj);

        },data.cohortStats);

//        if(params.species == 'hsapiens_grch37'){
//            Ext.getCmp('populationStats').update('<h4>Population Statistics</h4><h5 style="color:#436883;margin-left:-15px;font-size:14px;">Population frequencies from 1000 Genomes</h5>')
//        }else{
//            Ext.getCmp('populationStats').update('<h4>Population Statistics</h4>')
//        }

        console.log(data)




        //TO BE REMOVED
        var study_title;
        var projectList = '';
        EvaManager.get({
            category: 'meta/studies',
            resource: 'list',
            params:{species:params.species},
            async: false,
//            params:{species:params.species},
            success: function (response) {
                try {
                    projectList = response.response[0].result;
//                    console.log(projectList)
                } catch (e) {
                    console.log(e);
                }
            }
        });

        if(projectList){
            for (var i = 0; i < projectList.length; i++) {
                if (projectList[i].studyId === data.studyId) {
                    study_title = '<a href="?eva-study='+projectList[i].studyId+'" target="_blank">'+projectList[i].studyName+'</a> ('+ projectList[i].studyId +')';
                }
            }
        }else{
            study_title = '<a href="?eva-study='+data.studyId+'" target="_blank">'+data.studyId+'</a>';
        }

        var populationStatsColumns = {
            items:[
                {
                    text: "Population",
                    dataIndex: "id",
                    flex: 0.4
                },
                {
                    text: "Minor Allele Frequency",
                    dataIndex: "maf",
                    xtype: "templatecolumn",
//                    tpl: '<tpl if="maf == -1 || maf == 0">NA <tpl else>{maf:number( "0.000" )} </tpl>',
                    tpl: '<tpl if="maf == -1">NA <tpl else>{maf:number( "0.000" )} </tpl>',
                    flex: 0.75
                },
                {
                    text: "MAF Allele",
                    dataIndex: "mafAllele",
                    xtype: "templatecolumn",
//                    tpl: '<tpl if="mafAllele">{mafAllele} <tpl else>NA</tpl>',
                    tpl: '<tpl if="mafAllele">{mafAllele} <tpl else>-</tpl>',
                    flex: 0.5
                },
//                {
//                    text: "Mendelian Errors",
//                    dataIndex: "mendelianErrors",
//                    xtype: "templatecolumn",
//                    tpl:'<tpl if="mendelianErrors == -1">NA <tpl else>{mendelianErrors}</tpl>',
//                    flex: 0.5
//                },
                {
                    text: "Missing Alleles",
                    dataIndex: "missingAlleles",
                    xtype: "templatecolumn",
                    tpl:'<tpl if="missingAlleles == -1">NA <tpl else>{missingAlleles}</tpl>',
                    flex: 0.6
                },
                {
                    text: "Missing Genotypes",
                    dataIndex: "missingGenotypes",
                    xtype: "templatecolumn",
                    tpl:'<tpl if="missingGenotypes == -1">NA <tpl else>{missingGenotypes}</tpl>',
                    flex: 0.7
                },
//                {
//                    text: "Genotypes Count",
//                    dataIndex: "genotypesCount",
//                    tpl:'<tpl if="missingGenotypes == -1">NA <tpl else>{missingGenotypes}</tpl>',
//                    flex: 1
//                }
            ],
            defaults: {
                align:'center' ,
                sortable : true
            }
        };

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
            sorters:
            {
                property: 'id',
                direction: 'ASC'
            }
        });



        var plugins =  [{
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(),
        }];

        var grid = Ext.create('Ext.grid.Panel', {
            store: store,
            loadMask: true,
            width: 900,
//            height: 600,
            cls:'population-stats-grid',
            margin: 20,
            viewConfig: {
                emptyText: 'No records to display',
                enableTextSelection: true,
                deferEmptyText:false
            },
            columns: populationStatsColumns,
            plugins:plugins


        });

        grid.view.on('expandbody', function(rowNode, record, body, rowIndex){

            var genotypesCount = record.data.genotypesCount;
            var divID = 'population-stats-grid-'+record.data.id+data.fileId;
            if(!_.isEmpty(genotypesCount)){
//                var divID = 'population-stats-grid-'+record.data.id;
                body.innerHTML = '<div style="width:800px;" id="'+divID+'"></div>';
                var genotypesCountArray=[];
                _.each(_.keys(genotypesCount), function(key){
                    genotypesCountArray.push([key,  this[key]]);

                },genotypesCount);
                var genotypesCountChartData = {id:divID,title:'Genotype Count',chartData:genotypesCountArray};
                _this._drawChart(genotypesCountChartData);
            }else{
                body.innerHTML = '<div style="width:800px;">No Genotypes Count available</div>';
            }

        });

        var studyPanel = Ext.create('Ext.panel.Panel', {
            header:{
                titlePosition:1
            },
            title: '<span class="popStats-panel-study-title">'+study_title+'</span>',
            border: false,
            layout:'fit',
            overflowX:true,
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
    _drawChart:function(data){
        var _this = this;
        var height = 290;
        var width = 250;
        var id = '#'+data.id;
        var render_id = document.querySelector(id);
        var dataArray  = data.chartData;
        var title = data.title;

        $(function () {
            Highcharts.setOptions({
                colors: ['#207A7A', '#2BA32B','#2E4988','#54BDBD', '#5DD15D','#6380C4', '#70BDBD', '#7CD17C','#7D92C4','#295C5C', '#377A37','#344366','#0A4F4F', '#0E6A0E','#0F2559' ],
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
//                    width: width,
                    marginLeft:50,
                    marginTop:50

                },
                legend: {
                    enabled: true,
//                    width: 50,
                    margin: 0,
                    labelFormatter: function() {
                        return '<div>' + this.name + '('+ this.y + ')</div>';
                    },
                    layout:'horizontal',
                    useHTML:true,
                    align:'center'

                },
                title: {
                    text: title,
                    style: {
//                                    display: 'none'
                    },
                    align: 'center'
                },
                tooltip: {
                    pointFormat: '<b>{point.y}</b>'
    //                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                series: [{
                    type: 'pie',
                    name: 'Studies by '+title,
                    data: dataArray
                }],
                credits: {
                    enabled: false
                }
            });

        });

    }
};

String.prototype.escapeHTML = function () {
    return(
        this.replace(/>/g,'&gt;').
            replace(/</g,'&lt;').
            replace(/"/g,'&quot;')
        );
};

