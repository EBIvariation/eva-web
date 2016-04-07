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
        var _this = this

        this.targetDiv = (this.target instanceof HTMLElement) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAv-GeneView: target ' + this.target + ' not found');
            return;
        }

        geneID = this.geneId;
        _this.geneData;

        console.log(CELLBASE_HOST)
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

        $('#geneViewTabs li').click(function (event) {
            $(this).toggleClass("active");
            $(this).siblings().removeClass("active");
        });
        $(document).ready(function () {
            $('body').scrollspy({ 'target': '#geneViewScrollspy', 'offset': 250 });
        });
    },
    draw: function (data) {

        if (!_.isUndefined(data))
            var _this = this;
        var geneInfoTitle = document.querySelector("#geneInfo").textContent = this.geneId;

        if (!_.isUndefined(data)) {
            var geneViewDiv = document.querySelector("#geneView");
            $(geneViewDiv).addClass('show-div');
            var summaryContent = _this._renderSummaryData(data);
            var summaryEl = document.querySelector("#summary-grid");
            var summaryElDiv = document.createElement("div");
            summaryElDiv.innerHTML = summaryContent;
            summaryEl.appendChild(summaryElDiv);

            var clinVariantsEl = document.querySelector("#clinvar-variants-grid");
            var clinVariantsElDiv = document.createElement("div");
            clinVariantsElDiv.setAttribute('class', 'eva variant-widget-panel ocb-variant-stats-panel');
            clinVariantsEl.appendChild(clinVariantsElDiv);
            _this._createClinvarPanel(clinVariantsElDiv, data);

//            var gvEl = document.querySelector("#genome-viewer-grid");
//            var gvElDiv = document.createElement("div");
//            gvElDiv.setAttribute('class', 'ocb-gv');
//            gvEl.appendChild(gvElDiv);
//            var genomeViewer = _this._createGenomeViewer(gvElDiv);
//            genomeViewer.draw();
        }
    },
    _renderSummaryData: function (data) {
        var source = '<a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=' + data.id + '" target="_blank">' + data.source + ':' + data.id + '</a>'
        var _summaryTable = '<div class="row"><div class="col-md-8"><table id="gene-view-summary-table" class="table ocb-stats-table">'
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
    _createGenomeViewer: function (target) {
        var _this = this;

        var View = Ext.create('Ext.view.View', {
            tpl: new Ext.XTemplate('<div id="gene-view-gv"></div>'),
            margin: '5 10 10 10'
        });
        this.margin = '5 0 0 20';

        var gvPanel = Ext.create('Ext.panel.Panel', {
            title: 'Genome Viewer',
//            layout: {
//                type: 'vbox',
//                align: 'fit'
//            },
            cls: 'eva-panel',
            header: {
                titlePosition: 1
            },
            autoHeight: true,
            overflowX: true,
            height: 900,
            collapsible: true,
            renderTo: target,
            items: [View],
            margin: this.margin
        });
//        var View =  Ext.create('Ext.view.View', {
//            tpl: new Ext.XTemplate('<div id="gene-view-gv"></div>'),
//            margin: this.margin
//        });

        Ext.EventManager.onWindowResize(function () {
            if (gvPanel.isVisible()) {
                gvPanel.updateLayout();
            }
        });

        var header = gvPanel.getHeader()

        var region = new Region({
            chromosome: _this.geneData.chromosome,
            start: _this.geneData.start,
            end: _this.geneData.end
        });

        var genomeViewer = new GenomeViewer({
            cellBaseHost: CELLBASE_HOST,
            sidePanel: false,
            target: 'gene-view-gv',
            border: false,
            resizable: false,
            width: 1250,
            region: region,
            trackListTitle: '',
            drawNavigationBar: true,
            drawKaryotypePanel: true,
            drawChromosomePanel: true,
            drawRegionOverviewPanel: true,
            overviewZoomMultiplier: 50,
            navigationBarConfig: {
                componentsConfig: {
                    restoreDefaultRegionButton: false,
                    regionHistoryButton: false,
                    speciesButton: false,
                    chromosomesButton: false,
                    karyotypeButtonLabel: false,
                    chromosomeButtonLabel: false,
                    //regionButton: false,
//                    zoomControl: false,
                    windowSizeControl: false
//                    positionControl: false,
//                    moveControl: false,
//                    autoheightButton: false,
//                    compactButton: false,
//                    searchControl: false
                }
            }
        });
        console.log(genomeViewer)
        genomeViewer.setZoom(80);

        var renderer = new FeatureRenderer(FEATURE_TYPES.gene);
        renderer.on({
            'feature:click': function (event) {
                // feature click event example
                console.log(event)
            }
        });
        var geneOverview = new FeatureTrack({
//        title: 'Gene overview',
            minHistogramRegionSize: 20000000,
            maxLabelRegionSize: 10000000,
            height: 100,

            renderer: renderer,

            dataAdapter: new CellBaseAdapter({
                category: "genomic",
                subCategory: "region",
                resource: "gene",
                params: {
                    exclude: 'transcripts,chunkIds'
                },
                species: genomeViewer.species,
                cacheConfig: {
                    chunkSize: 100000
                }
            })
        });

        var sequence = new SequenceTrack({
//        title: 'Sequence',
            height: 30,
            visibleRegionSize: 200,

            renderer: new SequenceRenderer(),

            dataAdapter: new SequenceAdapter({
                category: "genomic",
                subCategory: "region",
                resource: "sequence",
                species: genomeViewer.species
            })
        });

        var gene = new GeneTrack({
            title: 'Gene',
            minHistogramRegionSize: 20000000,
            maxLabelRegionSize: 10000000,
            minTranscriptRegionSize: 200000,
            height: 60,

            renderer: new GeneRenderer(),

            dataAdapter: new CellBaseAdapter({
                category: "genomic",
                subCategory: "region",
                resource: "gene",
                species: genomeViewer.species,
                params: {
                    exclude: 'transcripts.tfbs,transcripts.xrefs,transcripts.exons.sequence'
                },
                cacheConfig: {
                    chunkSize: 100000
                }
            })
        });

        var snp = new FeatureTrack({
            title: 'SNP',
            featureType: 'SNP',
            minHistogramRegionSize: 10000,
            maxLabelRegionSize: 3000,
            height: 100,

            renderer: new FeatureRenderer(FEATURE_TYPES.snp),

            dataAdapter: new CellBaseAdapter({
                category: "genomic",
                subCategory: "region",
                resource: "snp",
                params: {
                    exclude: 'transcriptVariations,xrefs,samples'
                },
                species: genomeViewer.species,
                cacheConfig: {
                    chunkSize: 10000
                }
            })
        });

        genomeViewer.addOverviewTrack(geneOverview);
        genomeViewer.addTrack([sequence, gene, snp]);

        gvPanel.collapse();

        return genomeViewer;
    },

    _varinatViewlayout: function (data) {
        var layout;
        if (!_.isUndefined(data)) {
            layout = '<div id="gene-view">' +
                '<div class="row">' +
                '<div  class="col-sm-1  col-md-1 col-lg-1"></div>' +
                '<div  class="col-sm-10 col-md-10 col-lg-10"> <h2 id="geneInfo"></h2></div>' +
                '</div>' +
                '<div class="container_24">' +
                '<div class="grid_2" id="geneViewScrollspy">' +
                '<span>&nbsp;</span>' +
                '<ul id="geneViewTabs" class="nav nav-stacked affix eva-tabs">' +
                '<li class="active"><a href="#summary">Summary</a></li>' +
                '<li><a href="#transcripts">Variants</a></li>' +
                '</ul>' +
                '</div>' +
                '<div id="scroll-able" class="grid_20">' +
                '<div id="summary" class="row">' +
                '<div  style="margin-left:20px;">' +
                '<h4 class="variant-view-h4"> Summary &nbsp;<img class="title-header-icon" data-qtip="Summary of ClinVar (release 03-2015) variants mapped to this gene. Search results can be exported in CSV format and individual variants can be further investigated using the in-depth ClinVar Data tabs found below the main results table." style="margin-bottom:2px;" src="img/icon-info.png"/></h4>' +
                '<div id="summary-grid"></div>' +
                '</div>' +
                '</div>' +
                '<div id="transcripts" class="row">' +
                '<div style="margin-left:20px;">' +
                '<h4 class="variant-view-h4"> Variants </h4>' +
                '<div id="transcripts-grid"></div>' +
                '</div>' +
                '</div>' +
                '<br /><div  id="clinvarVariants" class="row">' +
                '<div style="margin-left:10px;">' +
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


