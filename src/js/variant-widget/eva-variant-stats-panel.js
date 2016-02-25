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
    load: function (data, params) {
        this.clear();
        var panels = [];
        for (var key in data) {
            var study = data[key];
            var studyPanel = this._createStudyPanel(study, params);
            panels.push(studyPanel);

        }
        this.studiesContainer.add(panels);
    },
    _createPanel: function () {
        this.studiesContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'accordion',
                titleCollapse: true,
                multi: true
            }
        });

        var panel = Ext.create('Ext.container.Container', {
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
                    id: 'fileStats',
                    cls: 'ocb-header-4',
                    html: '<h4>Files and Statistics <img class="title-header-icon" data-qtip="Per-study reports of the selected variant. The compulsory fields and the metadata section from the source VCF files are displayed." style="margin-bottom:2px;" src="img/icon-info.png"/></h4>',
                    margin: '5 0 10 15'
                },
                this.studiesContainer
            ],
            height: this.height
        });
        return panel;
    },
    _createStudyPanel: function (data, params) {

        console.log(data)
        var fileId = data.fileId;
        var stats = (data.stats) ? data.stats : {};
        var attributes = (data.attributes) ? data.attributes : {};
        // removing src from attributes
        var attributesData = {};
        _.extend(attributesData, attributes);
        delete attributesData['src'];
        delete attributesData['ACC'];
        //TO BE REMOVED
        var study_title;
        var projectList = '';
        var project_name = data.studyId;
        EvaManager.get({
            category: 'meta/studies',
            resource: 'list',
            params: {species: params.species},
            async: false,
            success: function (response) {
                try {
                    projectList = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        if (projectList) {
            for (var i = 0; i < projectList.length; i++) {
                if (projectList[i].studyId === data.studyId) {
                    project_name = projectList[i].studyName;
                }
            }
        }
        study_title = '<a href="?eva-study=' + data.studyId + '" class="study_link" target="_blank">' + project_name + '</a> (<a href="?eva-study=' + data.studyId + '" class="project_link" target="_blank">' + data.studyId +'</a> - <a href="ftp://ftp.ebi.ac.uk/pub/databases/eva/' + data.studyId + '/'+fileId+'" class="ftp_link" target="_blank">' + fileId + '</a>)';

        var infoTags = '';
        var vcfHeaderData = '';
        EvaManager.get({
            category: 'studies',
            resource: 'files',
            query: data.studyId,
            async: false,
            params: {species: params.species},
            success: function (response) {
                try {
                    var results = response.response[0].result;
                    _.each(_.keys(results), function (key) {
                        if (this[key].fileId == fileId) {
                            infoTags = this[key].metadata.INFO;
                            vcfHeaderData = this[key].metadata.header.trim();
                        }
                    }, results);

                } catch (e) {
                    console.log(e);
                }
            }
        });

        attributesData = _.invert(attributesData);
        var vcfData = '';
        if (attributes['src']) {
            vcfData = attributes['src'].split('\t');
        }
        var vcfDataId = Utils.genId("vcf-data");
        var vcfDataView = Ext.create('Ext.view.View', {
            id: vcfDataId,
//            tpl: new Ext.XTemplate('<div>' + vcfData + '</div>'),
            tpl: new Ext.XTemplate(
                '<table class="ocb-attributes-table">' +
                    '<tr><td class="header"><span>CHROM</span></td>' +
                    '<td class="header"><span>POS</span></td>' +
                    '<td class="header"><span>ID</span></td>' +
                    '<td class="header"><span>REF</span></td>' +
                    '<td class="header"><span>ALT</span></td></tr>' +
                    '<tr><td>'+vcfData[0]+'</td>'+
                    '<td>'+vcfData[1]+'</td>'+
                    '<td>'+vcfData[2]+'</td>'+
                    '<td>'+vcfData[3]+'</td>'+
                    '<td>'+vcfData[4]+'</td></tr>'+
                    '</table>'
            ),
            hidden: true,
            margin: '5 10 10 10'
        });
        var vcfHeaderId = Utils.genId("vcf-header");
        var vcfHeaderView = Ext.create('Ext.view.View', {
            id: vcfHeaderId,
            tpl: new Ext.XTemplate("<div onmouseover='overflow_show(this)'  onmouseout='overflow_hide(this)' class='vcf-header' id='" + fileId + "'><pre style='display: inline-block; border:0'>" + vcfHeaderData.escapeHTML() + "</pre></div>"),
            hidden: true,
            margin: '5 0 0 10'
        });
        var vcfHeaderButtonId = vcfHeaderId + '-button';
        var vcfHeaderButton = {
            id: vcfHeaderButtonId,
            xtype: 'button',
            text: 'Hide Full Header',
            margin: '5 0 0 10',
            enableToggle: true,
            hidden: true,
            style: {
                borderStyle: 'solid'
            },
            handler: function () {
                var vcfHeaderCtn = Ext.getCmp(vcfHeaderId);
                if (vcfHeaderCtn.isHidden()) {
                    vcfHeaderCtn.show();
                    this.setText('Hide Full Header')
                }
                else {
                    vcfHeaderCtn.hide();
                    this.setText('Show Full Header')
                }
            }
        };

        var studyPanel = Ext.create('Ext.panel.Panel', {
            header: {
                titlePosition: 1
            },
            title: '<span class="stats-panel-study-title">' + study_title + '</span>',
            border: false,
            layout: {
                type: 'vbox',
                align: 'fit'
            },
            overflowX: true,
            items: [
                {
                    xtype: 'container',
                    data: attributesData,
                    tpl: new Ext.XTemplate(
                        '<table class="ocb-attributes-table"><tr>',
                        '<tpl foreach=".">',
                        '<td class="header"><span>{.}&nbsp;<tpl if="this.getInfo(values)"><img  data-qtip="{[this.getInfo(values)]}" class="eva-help-img" src="img/help.jpg"/></tpl></span></td>', // the special **`{$}`** variable contains the property name
                        '</tpl>' +
                            '</tr><tr>',
                        '<tpl foreach=".">',
                        '<td>{$}</td>', // within the loop, the **`{.}`** variable is set to the property value
                        '</tpl>',
                        '</tr></table>',
                        {
                            getInfo: function (value) {
                                var info = _.findWhere(infoTags, {id: value});
                                if (!_.isUndefined(info)) {
                                    return info.description;
                                } else {
                                    return;
                                }
                            }
                        }),
                    margin: '10 5 5 10'
                },
                {
                    xtype: 'container',
                    cls: 'ocb-header-5',
                    margin: '5 0 0 0',
                    html: '<h5>VCF data</h5>',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'button',
                            text: '+',
                            margin: '5 10 10 90',
                            enableToggle: true,
                            style: {
                                borderStyle: 'solid'
                            },
                            handler: function () {
                                var vcfHeaderCtn = Ext.getCmp(vcfHeaderId);
                                var vcfDataCtn = Ext.getCmp(vcfDataId);
                                var vcfSubButton = Ext.getCmp(vcfHeaderButtonId);
                                if (vcfDataCtn.isHidden()) {
                                    vcfDataCtn.show();
                                    vcfHeaderCtn.show();
                                    this.setText('-')
                                    if (vcfHeaderCtn.isHidden()) {
                                        vcfSubButton.setText('Show Full Header')
                                    } else {

                                        vcfSubButton.setText('Hide Full Header')
                                    }
                                }
                                else {
                                    vcfDataCtn.hide();
                                    this.setText('+')
                                    vcfSubButton.setText('Show Full Header')
                                    vcfHeaderCtn.hide();
                                }
                                if (vcfSubButton.isHidden()) {
                                    vcfSubButton.show();
                                }
                                else {
                                    vcfSubButton.hide();
                                }
                            }
                        },
                        {
                            xtype: 'container',
                            margin: '5 0 0 0',
                            items: [vcfHeaderButton, vcfHeaderView]
                        },
                        {
                            xtype: 'container',
                            margin: '5 0 0 0',
                            items: [vcfDataView]
                        }
                    ]
                }
            ]
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
    }
};

function overflow_show(div) {
    $(div).css("overflow-y", "auto");
}
function overflow_hide(div) {
    $(div).css("overflow", "hidden");
}

String.prototype.escapeHTML = function () {
    return(
        this.replace(/>/g, '&gt;').
            replace(/</g, '&lt;').
            replace(/"/g, '&quot;')
        );
};

