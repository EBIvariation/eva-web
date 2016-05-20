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
function ClinvarAssertionPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("ClinVarAssertionDataPanel");

    this.target;
    this.title = "Stats";
    this.headerId = "cb-clinical-assertion-header";
    this.height = 500;
    this.autoRender = true;
    _.extend(this, args);
    this.on(this.handlers);
    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
}

ClinvarAssertionPanel.prototype = {
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
        this.assertionContainer.removeAll(true);
    },
    load: function (data) {
        this.clear();
        var panels = [];
        var clinVarAssertion = data.clinvarSet.clinVarAssertion;
        for (var key in clinVarAssertion) {
            var assertData = clinVarAssertion[key];
            var asstPanel = this._createAssertPanel(assertData);
            panels.push(asstPanel);
        }

        this.assertionContainer.add(panels);
    },
    _createPanel: function () {
        this.assertionContainer = Ext.create('Ext.container.Container', {
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
                    cls: 'ocb-header-4',
                    id: this.headerId,
                    html: '<h4>Clinical Assertions</h4>',
                    margin: '5 0 10 10'
                },
                this.assertionContainer
            ],
            height: this.height
        });
        return panel;
    },
    _createAssertPanel: function (data) {
        var submittedDate = '-';
        if (data.clinVarSubmissionID.submitterDate) {
            submittedDate = new Date(data.clinVarSubmissionID.submitterDate).toUTCString();
        }
        var citation = 'NA';
        var publications;
        var pubArray = [];
        var measure = data.measureSet.measure;
        _.each(_.keys(measure), function (key) {
            var citation = this[key].citation;
            if (!_.isUndefined(citation)) {
                _.each(_.keys(citation), function (key) {
                    if (this[key].id && this[key].id.source == 'PubMed') {
                        pubArray.push('PMID:<a href="http://www.ncbi.nlm.nih.gov/pubmed/' + this[key].id.value + '" target="_blank">' + this[key].id.value + '</a>')
                    }
                }, citation);
            }

        }, measure);
        if (!_.isEmpty(pubArray)) {
            publications = pubArray.join(',');
        }

        var origin = data.observedIn[0].sample.origin;
        var collectionMethod = data.observedIn[0].method[0].methodType;
        var alleOriginArray = [];
        var methodTypeArray = [];
        _.each(_.keys(data.observedIn), function (key) {
            alleOriginArray.push(this[key].sample.origin);
            var method = this[key].method;
            _.each(_.keys(method), function (key) {
                methodTypeArray.push(this[key].methodType);
            }, method);

        }, data.observedIn);

        var alleOrigin = '-';
        if (!_.isEmpty(alleOriginArray)) {
            alleOriginArray = _.groupBy(alleOriginArray);
            alleOrigin = _.keys(alleOriginArray).join('<br />');
        }

        var methodType = '-';
        if (!_.isEmpty(methodTypeArray)) {
            methodTypeArray = _.groupBy(methodTypeArray);
            methodType = _.keys(methodTypeArray).join('<br />');
        }

        var div = '<div class="col-md-12"><table class="table table-bordered eva-attributes-table">' +
            '<tr>' +
            '<td class="header">Submission Accession</td>' +
            '<td class="header">Clinical Significance</td>' +
            '<td class="header">Review status</td>' +
            '<td class="header">Date of Submission</td>' +
            '<td class="header">Submitter</td>' +
            '<td class="header">Method Type</td>' +
            '<td class="header">Allele origin</td>' +
            '<td class="header">Assertion Method</td>' +
            '</tr>' +
            '<tr>' +
            '<td class="clinVarAccession">{clinVarAccession.acc}</td>' +
            '<td class="clinVarAssertion-significance"><tpl if="clinicalSignificance.description">{clinicalSignificance.description}<tpl else>-</tpl></td>' +
            '<td class="clinVarAssertion-reviewStatus"><tpl if="clinicalSignificance.reviewStatus">{clinicalSignificance.reviewStatus}<tpl else>-</tpl></td>' +
            '<td class="clinVarAssertion-submittedDate">' + submittedDate + '</td>' +
            '<td class="clinVarAssertion-submitter"><tpl if="clinVarSubmissionID.submitter">{clinVarSubmissionID.submitter}<tpl else>-</tpl></td>' +
            '<td class="clinVarAssertion-methodType">' + methodType + '</td>' +
            '<td class="clinVarAssertion-alleOrigin">' + alleOrigin + '</td>' +
            '<td class="clinVarAssertion-type"><tpl if="assertion.type">{assertion.type}<tpl else>-</tpl></td>' +
            '</tr>';
        div += '</table></div>';
        if (!_.isUndefined(publications)) {
            div += '<div style="margin-left:15px;"><span style="color:steelblue;"><b>Publications:</b>&nbsp;</span><span>' + publications + '</span></div>';
        }

        var assertPanel = Ext.create('Ext.panel.Panel', {
            title: '<span class="clinvarAssertionTitle">' + data.clinVarAccession.acc + '</span>',
            border: false,
            layout: 'fit',
            overflowX: true,
            items: [
                {
                    xtype: 'container',
                    data: data,
                    width: 960,
                    tpl: new Ext.XTemplate(div),
                    margin: '10 5 5 10'
                }
            ]
        });

        return assertPanel;
    }
};
