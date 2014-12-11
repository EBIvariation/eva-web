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
function EvaVariantStatsPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("VariantStatsPanel");

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

EvaVariantStatsPanel.prototype = {
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
        this.clear();

        var panels = [];

        for (var key in data) {
            var study = data[key];
            var studyPanel = this._createStudyPanel(study,params);
            panels.push(studyPanel);

        }

        this.studiesContainer.add(panels);
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

        var panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
//            overflowY: true,
            overflowX: true,
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    cls: 'ocb-header-4',
                    html: '<h4>Studies</h4>',
                    margin: '5 0 10 10'
                },
                this.studiesContainer
            ],
            height: this.height
        });
        return panel;
    },
    _createStudyPanel: function (data,params) {

        console.log(params)
        var stats = (data.stats) ? data.stats : {};
        var attributes = (data.attributes) ? data.attributes : {};
        // removing src from attributes
        var attributesData = {};
        _.extend(attributesData,attributes);
        delete attributesData['src'];
        delete attributesData['ACC'];

        //TO BE REMOVED
        var study_title;
        if(projects){
            for (var i = 0; i < projects.length; i++) {
                if (projects[i].studyId === data.studyId) {
                    study_title = '<a href="?eva-study='+projects[i].studyId+'" target="_blank">'+projects[i].studyName+'</a> ('+ projects[i].studyId +')';
                }
            }
        }else{
            study_title = '<a href="?eva-study='+data.studyId+'" target="_blank">'+data.studyId+'</a>';
        }
        var infoTags = '';
        EvaManager.get({
            category: 'studies',
            resource: 'files',
            query:data.studyId,
            async: false,
            params:{species:params.species},
            success: function (response) {
                try {
                    infoTags = response.response[0].result[0].metadata.INFO;
                } catch (e) {
                    console.log(e);
                }


            }
        });

        attributesData =  _.invert(attributesData);
        var vcfHeader = attributes['src'];
        var vcfHeaderId = Utils.genId("vcf-data");
        var studyPanel = Ext.create('Ext.panel.Panel', {
            header:{
                titlePosition:1
            },
            title: study_title,
            border: false,
            layout: {
                type: 'vbox',
                align: 'fit'
            },
            overflowX:true,
            items: [
                {
                    xtype: 'container',
                    data: attributesData,
                    tpl: new Ext.XTemplate(
                        '<table class="ocb-attributes-table"><tr>',
                        '<tpl foreach=".">',
                        '<td class="header"  data-qtip="{[this.getInfo(values)]}"><span>{.}&nbsp;<if><img class="eva-help-img" src="img/help.jpg"/></if></span></td>', // the special **`{$}`** variable contains the property name
                            '</tpl>' +
                            '</tr><tr>',
                        '<tpl foreach=".">',
                        '<td>{$}</td>', // within the loop, the **`{.}`** variable is set to the property value
                        '</tpl>',
                        '</tr></table>',
                        {
                            getInfo:function(value){
                                var info =_.findWhere(infoTags, {id:value});
                                if(!_.isUndefined(info)){
                                    return info.description
                                }
                            }
                        }),
                    margin: '10 5 5 10'
                },
                {
                    xtype: 'container',
                    cls: 'ocb-header-5',
                    margin: '5 5 10 10',
                    html: '<h5>VCF data</h5>',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'button',
                            text : '+',
                            margin: '5 10 10 90',
                            enableToggle: true,
                            handler: function () {
                                var vcfHeaderCtn = Ext.getCmp(vcfHeaderId);
                                if(vcfHeaderCtn.isHidden()) {
                                    vcfHeaderCtn.show();
                                    this.setText('-')
                                }
                                else {
                                    vcfHeaderCtn.hide();
                                    this.setText('+')
                                }

                            }
                        },
                        {
                            xtype: 'container',
                            id:vcfHeaderId,
                            data: vcfHeader,
                            tpl: new Ext.XTemplate('<div>{vcfHeader}</div>'),
                            margin: '5 5 5 10',
                            hidden: true
                        }
                    ]
                }

//                {
//                    xtype: 'box',
//                    cls: 'ocb-header-5',
//                    margin: '5 5 5 10',
//                    html: '<h5>Stats</h5>'
//                },
//                {
//                    xtype: 'container',
//                    layout: 'hbox',
//                    items: [
//                        {
//                            xtype: 'container',
//                            data: stats,
//                            tpl: this.statsTpl,
//                            margin: '5 5 5 10'
//                        }
//                    ]
//                }

            ]
        });

        var gts = this._getGenotypeCount(stats.genotypesCount);

        if (gts.length > 0) {
            var store = Ext.create('Ext.data.Store', {
                fields: ['genotype', 'count'],
                data: gts
            });

//            var genotypeChart = Ext.create('Ext.chart.Chart', {
//                xtype: 'chart',
//                width: 200,
//                height: 130,
//                store: store,
//                animate: true,
//                shadow: true,
//                legend: {
//                    position: 'right'
//                },
//                theme: 'Base:gradients',
//                series: [
//                    {
//                        type: 'pie',
//                        field: 'count',
//                        showInLegend: true,
//                        tips: {
//                            trackMouse: true,
//                            renderer: function (storeItem, item) {
//                                var name = storeItem.get('genotype');
//                                this.setTitle(name + ': ' + storeItem.get('count'));
//                            }
//                        },
//                        highlight: {
//                            segment: {
//                                margin: 20
//                            }
//                        },
//                        label: {
//                            field: 'genotype',
//                            display: 'rotate',
//                            contrast: true,
//                            font: '10px Arial'
//                        }
//
//                    }
//                ]
//            });
//            studyPanel.down().nextSibling().nextSibling().add(genotypeChart);
        }

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
    }
};
