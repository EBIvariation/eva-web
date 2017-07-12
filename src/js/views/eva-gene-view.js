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

var variant = {};
var geneID = '';

function EvaGeneView(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAGeneView");
    _.extend(this, args);
    this.rendered = false;
    this.render();

}
EvaGeneView.prototype = {
    render: function () {
        var _this = this;

        this.targetDiv = (this.target instanceof HTMLElement) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAv-GeneView: target ' + this.target + ' not found');
            return;
        }

        geneID = this.geneId;
        _this.geneData;

        CellBaseManager.get({
            host: CELLBASE_HOST,
            species: 'hsapiens',
            category: 'feature',
            subCategory: 'gene',
            query: geneID.toUpperCase(),
            resource: "info",
            async: false,
            params: {
            },
            success: function (data) {
                console.log(data)
                for (var i = 0; i < data.response.length; i++) {
                    var queryResult = data.response[i];
                    console.log(queryResult)
                    if (!_.isEmpty(queryResult.result[0])) {
                        _this.geneData = queryResult.result[0];
                    }
                }
            }
        });

        this.targetDiv.innerHTML = _this._varinatViewlayout(_this.geneData);
        _this.draw(_this.geneData);

        //sending tracking data to Google Analytics
        ga('send', 'event', { eventCategory: 'Views', eventAction: 'Gene', eventLabel:this.geneId});
    },
    draw: function (data) {

        if (!_.isUndefined(data))
            var _this = this;
        var geneInfoTitle = document.querySelector("#geneInfo").textContent = this.geneId;

        if (!_.isUndefined(data)) {
            var geneViewDiv = document.querySelector("#geneView");
            $(geneViewDiv).addClass('show-div');
            var summaryContent = _this._renderSummaryData(data);
            var summaryEl = document.querySelector("#gene-summary-grid");
            var summaryElDiv = document.createElement("div");
            summaryElDiv.innerHTML = summaryContent;
            summaryEl.appendChild(summaryElDiv);

            var clinVariantsEl = document.querySelector("#clinvar-variants-grid");
            var clinVariantsElDiv = document.createElement("div");
            clinVariantsElDiv.setAttribute('class', 'eva variant-widget-panel ocb-variant-stats-panel');
            clinVariantsEl.appendChild(clinVariantsElDiv);
            _this._createClinvarPanel(clinVariantsElDiv, data);
        }
    },
    _renderSummaryData: function (data) {
        var source = '<a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' + data.id + '" target="_blank">' + data.source + ':' + data.id + '</a>'
        var _summaryTable = '<div class="row"><div class="col-md-8"><table id="gene-view-summary-table" class="table">'
        var description = data.description;
        var start_pos = description.indexOf('[') + 1;
        var end_pos = description.indexOf(']', start_pos);
        var text_to_get = description.substring(start_pos, end_pos)
        var hgnc_name = data.name;
        if (text_to_get.split(':')[2]) {
            hgnc_name = '<a href="http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=HGNC:' + text_to_get.split(':')[2] + '" target="_blank">' + data.name + '</a>'
        }
        _summaryTable += '<tr><td class="header">HGNC Symbol</td><td id="gene-view-hgnc">' + hgnc_name + '</td></tr>' +
            '<tr><td class="header">Gene Biotype</td><td id="gene-view-biotype">' + data.biotype + '</td></tr>' +
            '<tr><td class="header">Location</td><td id="gene-view-location">' + data.chromosome + ':' + data.start + '-' + data.end + '</td></tr>' +
            '<tr><td class="header">Assembly</td><td id="gene-view-assembly">GRCh37</td></tr>' +
            '<tr><td class="header">Description</td><td id="gene-view-description">' + data.description + '</td></tr>' +
            '<tr><td class="header">Source</td><td id="gene-view-source">' + source + '</td></tr>' +
            '</table>'

        _summaryTable += '</div></div>'

        return _summaryTable;
    },
    createTranscriptsPanel: function (target, data) {
        var _this = this;

        var View = Ext.create('Ext.view.View', {
            tpl: new Ext.XTemplate('<div id="transcript-grid"></div>'),
            margin: '5 10 10 10'
        });
        this.margin = '0 0 0 20';

        var panel = Ext.create('Ext.panel.Panel', {
            title: 'Transcripts',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            autoHeight: true,
            overflowY: true,
            height: 330,
            cls: 'eva-panel',
            header: {
                titlePosition: 1
            },
            collapsible: true,
            renderTo: target,
            items: [View],
            margin: this.margin
        });
        var variantTranscriptGrid = new EvaVariantTranscriptGrid({
            target: 'transcript-grid'
        });

        variantTranscriptGrid.load(data);
        variantTranscriptGrid.draw();

        return variantTranscriptGrid;
    },
    _createClinvarPanel: function (target, data) {
        var _this = this;
        var View = Ext.create('Ext.view.View', {
            tpl: new Ext.XTemplate('<div id="clinvar-view-gv"></div>'),
            margin: '5 10 10 10'
        });
        this.margin = '-30 0 0 20';
        Ext.EventManager.onWindowResize(function () {
            _this.panel.updateLayout();
            evaClinVarWidget.clinvarBrowserGrid.panel.updateLayout();
            evaClinVarWidget.toolTabPanel.updateLayout();
        });
        this.class = Utils.genId("clinical-widget");
        this.panel = Ext.create('Ext.panel.Panel', {
//            title:'Variants',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            autoHeight: true,
            overflowY: true,
            height: 1100,
            border: false,
//            cls: 'eva-panel',
            header: false,
            headerPosition: 'bottom',
//            header:  {
//                titlePosition:1
//            },
//            collapsible:true,
            renderTo: target,
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    collapsible: false,
                    collapseMode: 'header',
                    html: '<div id="clinvar-view-gv1" class="' + this.class + '"></div>',
                    border: false,
                    bodyStyle: 'border-width:0px;border-style:none;'
                }
            ],
            margin: this.margin
        });
        var evaClinVarWidget = new EvaClinVarWidget({
            width: 1020,
            target: 'clinvar-view-gv1',
            headerConfig: {
                baseCls: 'eva-header-2'
            },
            border: true,
            browserGridConfig: {
                title: _this.title,
                border: true
            },
            toolPanelConfig: {
//                headerConfig: {
//                    baseCls: 'eva-header-2'
//                },
                height: 600
            },
            defaultToolConfig: {
                headerConfig: {
                    baseCls: 'eva-header-2'
                },
                assertion: true,
                genomeViewer: false
            },
            responseParser: function (response) {
                var res = [];
                try {
                    res = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
                return  res;
            },
            dataParser: function (data) {

            }
        });
        evaClinVarWidget.draw();
        evaClinVarWidget.species = _this.species;
        var params = {merge: true, source: 'clinvar', gene: _this.geneId};
        var url = EvaManager.url({
            host: CELLBASE_HOST,
            version: CELLBASE_VERSION,
            category: 'hsapiens/feature/clinical',
            resource: 'all',
            params: params
        });
        evaClinVarWidget.retrieveData(url, params);
        return evaClinVarWidget;
    },
    _varinatViewlayout: function (data) {
        var layout;
        if (!_.isUndefined(data)) {
            layout = '<div id="gene-view">' +
                '<div class="row">' +
                '<div  class="columns medium-12 large-12"> <h2 id="geneInfo"></h2></div>' +
                '</div>' +
                '<div class="">' +
                '<div id="scroll-able" class="">' +
                '<div id="summary" class="row">' +
                '<div  style="margin-left:20px;">' +
                '<h4 class="variant-view-h4"> Summary &nbsp;<span class="icon icon-generic title-header-icon" data-icon="i" data-qtip="Summary of ClinVar (release 03-2015) variants mapped to this gene. Search results can be exported in CSV format and individual variants can be further investigated using the in-depth ClinVar Data tabs found below the main results table." style="margin-bottom:2px;"></span></h4>' +
                '<div id="gene-summary-grid"></div>' +
                '</div>' +
                '</div>' +
                '<div id="transcripts" class="row">' +
                '<div style="margin-left:20px;">' +
                '<h4 class="variant-view-h4"> Variants </h4>' +
                '<div id="transcripts-grid"></div>' +
                '</div>' +
                '</div>' +
                '<br /><div  id="clinvarVariants" class="row">' +
                '<div>' +
                '<div id="clinvar-variants-grid"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
        } else {
            layout = '<div id="gene-view">' +
                '<div class="row">' +
                '<div  class="col-sm-12 col-md-12 col-lg-12"> <h2 id="geneInfo"></h2></div>' +
                '<div  class="col-sm-12 col-md-12 col-lg-12"><h5>Sorry No Data Avalibale</h5></div>' +
                '</div>' +
                '</div>'
        }
        return layout;
    }
}


