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
function ClinvarSummaryPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("ClinVarSummaryDataPanel");

    this.target;
    this.title = "Stats";
    this.height = 700;
    this.autoRender = true;
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;

    if (this.autoRender) {
        this.render();
    }
}

ClinvarSummaryPanel.prototype = {
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
        this.summaryContainer.removeAll(true);
    },
    load: function (data) {
        this.clear();
        var panels = [];
        var summaryData = data;
        var panel = this._createSummaryPanel(summaryData);
        this.summaryContainer.removeAll();
        this.summaryContainer.add(panel);
    },
    _createPanel: function () {
        this.summaryContainer = Ext.create('Ext.container.Container', {
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
                    cls: 'ocb-header-4',
                    html: '<h4>Summary</h4>',
                    margin: '5 0 10 10'
                },
                this.summaryContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createSummaryPanel: function (data) {
        var annotData = data.annot;
        data = data.clinvarSet.referenceClinVarAssertion;
        var lastEvaluated = new Date(data.clinVarAccession.dateUpdated).toUTCString();
        var origin = data.observedIn[0].sample.origin;
        var traitSet = data.traitSet.trait;
        var citation = 'NA';
        var publications = '-';
        var pubArray = [];
        _.each(_.keys(traitSet), function (key) {
            var citation = this[key].citation;
            if (citation) {
                _.each(_.keys(citation), function (key) {
                    if (this[key].id && this[key].id.source == 'PubMed') {
                        pubArray.push('PMID:<a href="http://www.ncbi.nlm.nih.gov/pubmed/' + this[key].id.value + '" target="_blank">' + this[key].id.value + '</a>')
                    }
                }, citation);
            }

        }, traitSet);

        if (!_.isEmpty(pubArray)) {
            publications = pubArray.join('<br/>');
        }

        var temp_hgvs = data.measureSet.measure[0].attributeSet;
        var variation_type = data.measureSet.measure[0].type;
        var hgvs = '-';
        var soTerms = '-';

        if (!_.isUndefined(annotData)) {
            var hgvsArray = []
            if (!_.isUndefined(annotData.hgvs)) {
                var hgvs_data = annotData.hgvs.sort().reverse();
                _.each(_.keys(hgvs_data), function (key) {
                    if (this[key]) {
                        hgvsArray.push(this[key]);
                    }
                }, hgvs_data);
                hgvs = hgvsArray.join("<br\/>");
            }

            var tempArray = [];
            _.each(_.keys(annotData.consequenceTypes), function (key) {
                var so_terms = this[key].soTerms;
                var transcript_id = this[key].ensemblTranscriptId;
                _.each(_.keys(so_terms), function (key) {
                    tempArray.push({name: this[key].soName, transcript_id: transcript_id})
                }, so_terms);
            }, annotData.consequenceTypes);

            var groupedArr = _.groupBy(tempArray, 'name');
            var so_array = [];
            _.each(_.keys(groupedArr), function (key) {
                var index = _.indexOf(consequenceTypesHierarchy, key);
                var transcript_array = [];
                _.each(_.keys(this[key]), function (key) {
                    if (!_.isUndefined(this[key].transcript_id)) {
                        transcript_array.push(this[key].transcript_id)
                    }
                }, this[key]);
                var transcripts = transcript_array.join('\n');
                var so_term_detail = _.findWhere(consequenceTypesColors, {id: key});
                var color = '';
                var impact = '';
                var svg = '';
                if (!_.isUndefined(so_term_detail)) {
                    color = so_term_detail.color;
                    impact = so_term_detail.impact;
                    svg = '<svg width="20" height="10"><rect x="0" y="3" width="15" height="10" fill="' + color + '"><title>' + impact + '</title></rect></svg>'
                }
                if (index < 0) {
                    so_array.push('' + key + '&nbsp;' + svg + '(<span title="' + transcripts + '">' + this[key].length + '</span>)')
                } else {
                    so_array[index] = '' + key + '&nbsp;' + svg + '(<span title="' + transcripts + '">' + this[key].length + '</span>)';
                }
            }, groupedArr);

            so_array = _.compact(so_array);
            soTerms = so_array.join("<br\/>");
        }

        var summaryPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: {
                type: 'vbox',
                align: 'fit'
            },
            height: 450,
            overflowY: true,
            items: [
                {
                    xtype: 'container',
                    data: data,
                    width: 970,
                    tpl: new Ext.XTemplate(
                        '<div class="col-md-12"><table class="table table-bordered eva-stats-table">',
                        '<tr>',
                        '<td class="header">Review status</td><td class="clinvar-reviewStatus">{clinicalSignificance.reviewStatus}</td>',
                        '</tr>',
                        '<tr>',
                        '<td class="header">Last Evaluated</td><td class="clinvar-lastEvaluated">' + lastEvaluated + '</td>',
                        '</tr>',
                        '<tr>',
                        '<td class="header">HGVS(s)</td><td class="clinvar-hgvs">' + hgvs + '</td>',
                        '</tr>',
                        '<tr>',
                        '<td class="header">SO Terms(s)</td><td class="clinvar-soTerms">' + soTerms + '</td>',
                        '</tr>',
                        '<tr>',
                        '<td class="header">Variation Type</td><td class="clinvar-variationType">' + variation_type + '</td>',
                        '</tr>',
                        '<tr>',
                        '<td class="header">Publications</td><td class="clinvar-publications">' + publications + '</td>',
                        '</tr>',
                        '</table></div>'
                    ),
                    margin: '10 5 5 10'
                }
            ]
        });

        return summaryPanel;
    }
};
