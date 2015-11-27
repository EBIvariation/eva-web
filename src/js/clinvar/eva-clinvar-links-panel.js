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
function ClinvarLinksPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("ClinVarLinksDataPanel");

    this.target;
    this.title = "Stats";
    this.height = 500;
    this.autoRender = true;
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;

    if (this.autoRender) {
        this.render();
    }
}

ClinvarLinksPanel.prototype = {
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
        this.linksContainer.removeAll(true);
    },
    load: function (data) {
        this.clear();
        var panels = [];
        var linksData = data;
        var panel = this._createLinksPanel(linksData);
        this.linksContainer.removeAll();
        this.linksContainer.add(panel);
    },
    _createPanel: function () {
        this.linksContainer = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
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
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    cls: 'ocb-header-4',
                    html: '<h4>External Links</h4>',
                    margin: '5 0 10 10'
                },
                this.linksContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createLinksPanel: function (data) {
        var chromosome = data.chromosome;
        var position = data.start;
        data = data.clinvarSet.referenceClinVarAssertion;
        var measure = data.measureSet.measure;
        var linksTable = '<div class="row"><div class="col-md-8"><table class="table ocb-attributes-table">'
        linksTable += '<tr><td class="header">Database</td><td class="header">Accession</td><td class="header">Type</td><td class="header">Status</td></tr>'
        _.each(_.keys(measure), function (key) {
            var xref = this[key].xref;
            if (xref) {
                _.each(_.keys(xref), function (key) {
                    var id = this[key].id;
                    if (this[key].type == 'rs') {
                        id = '<a href="http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?searchType=adhoc_search&type=rs&rs=' + id + '" target="_blank">rs' + id + '</a>'
                    } else if (this[key].db == 'OMIM') {
                        var OMIMId = id.split('.');
                        id = '<a href="http://www.omim.org/entry/' + OMIMId[0] + '#' + OMIMId[1] + '" target="_blank">' + id + '</a>'
                    }
                    linksTable += '<tr><td class="clinvar-links-db">' + this[key].db + '</td><td class="clinvar-links-id">' + id + '</td><td class="clinvar-links-type">' + this[key].type + '</td><td class="clinvar-links-status">' + this[key].status + '</td></tr>'
                }, xref);
            }
        }, measure);

        linksTable += '</table></div></div>'

        var lovd_link = 'http://databases.ebi.lovd.nl/shared/variants#order=VariantOnGenome%2FDNA%2CASC&skip[allele_]=allele_&skip[screeningids]=screeningids&skip[created_by]=created_by&skip[created_date]=created_date&search_chromosome=' + chromosome + '&search_VariantOnGenome/DNA=' + position + '&page_size=100&page=1';

        linksTable += '<br /><div class="lovd_link"><a href="' + lovd_link + '" target="_blank">Search for variant at LOVD</a></div>'

        var linksPanel = Ext.create('Ext.panel.Panel', {
            border: false,
            layout: 'vbox',
            overflowX: true,
            items: [
                {
                    xtype: 'container',
                    data: data,
                    width: 970,
                    tpl: new Ext.XTemplate(linksTable),
                    margin: '10 5 5 10'
                }
            ]
        });

        return linksPanel;
    }
};
