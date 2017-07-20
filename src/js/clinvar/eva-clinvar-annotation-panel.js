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
function ClinvarAnnotationPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("ClinVarAnnotationDataPanel");

    this.target;
    this.title = "Stats";
    this.height = 500;
    this.autoRender = true;
    _.extend(this, args);
    this.on(this.handlers);
    this.rendered = false;
    this.columns = {
        items: [
            {
                text: "Ensembl<br /> Gene ID",
                dataIndex: "ensemblGeneId",
                flex: 1.4,
                xtype: "templatecolumn",
                tpl: '<tpl if="ensemblGeneId"><a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g={ensemblGeneId}" target="_blank">{ensemblGeneId}</a><tpl else>-</tpl>',
            },
            {
                text: "Ensembl <br /> Gene Symbol",
                dataIndex: "geneName",
                xtype: "templatecolumn",
                flex: 0.9,
                tpl: '<tpl if="geneName">{geneName}<tpl else>-</tpl>',
            },
            {
                text: "Ensembl <br />Transcript ID",
                dataIndex: "ensemblTranscriptId",
                flex: 1.3,
                xtype: "templatecolumn",
                tpl: '<tpl if="ensemblTranscriptId"><a href="http://www.ensembl.org/Homo_sapiens/transview?transcript={ensemblTranscriptId}" target="_blank">{ensemblTranscriptId}</a><tpl else>-</tpl>',
            },
            {
                text: "Ensembl <br />Transcript Biotype",
                dataIndex: "biotype",
                xtype: "templatecolumn",
                tpl: '<tpl if="biotype">{biotype}<tpl else>-</tpl>',
                flex: 1.3
            },
            {
                text: "SO Term(s)",
                dataIndex: "soTerms",
                flex: 1.7,
                renderer: function (value, meta, rec, rowIndex, colIndex, store) {

                    if (!_.isUndefined(value)) {
                        var  so_array = getMostSevereConsequenceType(value);
                        meta.tdAttr = 'data-qtip="' + so_array.join(',') + '"';
                        return value ? Ext.String.format(
                            '<tpl>' + so_array.join(',') + '</tpl>',
                            value
                        ) : '';
                    } else {
                        return '';
                    }

                }
            },
            {
                text: "Codon",
                dataIndex: "codon",
                xtype: "templatecolumn",
                tpl: '<tpl if="codon">{codon}<tpl else>-</tpl>',
                flex: 0.6
            },
            {
                text: "cDna <br />Position",
                dataIndex: "cDnaPosition",
                xtype: "templatecolumn",
                tpl: '<tpl if="cDnaPosition">{cDnaPosition}<tpl elseif="cDnaPosition == 0">{cDnaPosition}<tpl else>-</tpl>',
                flex: 0.6
            },
            {
                text: "AA<br />Change",
                dataIndex: "aaChange",
                xtype: "templatecolumn",
                tpl: '<tpl if="aaChange">{aaChange}<tpl else>-</tpl>',
                flex: 0.6
            }

        ],
        defaults: {
            align: 'left',
            sortable: true
        }
    };

    _.extend(this, args);

    if (this.autoRender) {
        this.render();
    }
}

ClinvarAnnotationPanel.prototype = {
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
        this.annotContainer.removeAll(true);
    },
    load: function (data, params) {
        var _this = this;
        this.clear();
        var panels = [];
        var annotData = data.annot;
        if (!_.isUndefined(params)) {
            _.extend(annotData, params);
            var vepText = _this.getVepNotificationText(params.species, data.annotationVersion);
            if (!_.isEmpty(vepText)) {
                Ext.getCmp(_this.id + '-annotationStats').update('<h4>Annotations</h4><h6 class="vep_text"><small>'+vepText+'</small></h6>')
            } else {
                Ext.getCmp(_this.id + '-annotationStats').update('<h4>Annotations</h4>')
            }
        }
        var panel = this._createAnnotPanel(annotData);
        this.annotContainer.removeAll();
        this.annotContainer.add(panel);
    },
    _createPanel: function () {
        var _this = this;

        this.annotContainer = Ext.create('Ext.container.Container', {
            layout: 'fit'
        });

        this.panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            overflowY: true,
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    id: _this.id + '-annotationStats',
                    cls: 'ocb-header-4',
                    html: '<h4>Annotations</h4>',
                    margin: '5 0 10 10'
                },
                this.annotContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createAnnotPanel: function (data) {

        var _this = this;

        var annotData = '';
        if (!_.isUndefined(data)) {
            annotData = data.consequenceTypes;
        }

        if (annotData) {
            var annotColumns = _this.columns;
            var store = Ext.create("Ext.data.Store", {
                pageSize: 20,
                fields: [
                    {name: 'ensemblGeneId', type: 'string'},
                    {name: "geneName", type: "string"},
                    {name: "soTerms", type: "auto"}
                ],
                data: annotData,
                proxy: {
                    type: 'memory',
                    enablePaging: true
                },
                sorters: {
                    property: 'id',
                    direction: 'ASC'
                }
            });

            var paging = Ext.create('Ext.PagingToolbar', {
                store: store,
                id: _this.id + "_annotatPagingToolbar",
                pageSize: 20,
                displayInfo: true,
                displayMsg: 'Transcripts {0} - {1} of {2}',
                emptyMsg: "No records to display"
            });

            var grid = Ext.create('Ext.grid.Panel', {
                store: store,
                loadMask: true,
                width: 800,
                autoHeight: true,
                cls: 'genotype-grid',
                margin: 5,
                viewConfig: {
                    emptyText: 'No records to display',
                    enableTextSelection: true,
                    deferEmptyText: false
                },
                columns: annotColumns,
                tbar: paging
            });
        } else {
            var grid = Ext.create('Ext.view.View', {
                tpl: new Ext.XTemplate(['<div style="margin-left:5px;">No Annotation data available</div>'])
            });
        }

        var annotPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            padding: 10,
            width: 800,
            border: false,
            items: [grid]
        });

        if (annotData) {
            paging.doRefresh();
        }

        return annotPanel;
    },
    getVepNotificationText: function(species, annotationVersion){
        var vepText = '';
        if( !_.isUndefined(_.findWhere(annotation_text, {species: species})) && !_.isUndefined(annotationVersion) && annotationVersion){
            vepText = _.findWhere(annotation_text, {species: species}).text;
            _.each(_.keys(annotationVersion), function (key) {
                vepText = vepText.replace("{"+key+"}",annotationVersion[key]);
            });
        }
        return vepText;
    }
};
