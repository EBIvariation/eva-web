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
function EvaClinVarWidget(args) {

    _.extend(this, Backbone.Events);

    this.id = Utils.genId("ClinvarWidget");

    //set default args
    this.target;
    this.width;
    this.height;
    this.autoRender = true;
    this.data = [];
    this.host;
    this.closable = true;
    this.filters = {
        segregation: true,
        maf: true,
        effect: true,
        region: true,
        gene: true
    };
    this.headerConfig;
    this.attributes = [];
    this.columns = [];
    this.samples = [];
    this.defaultToolConfig = {
        headerConfig: {
            baseCls: 'ocb-title-2'
        },
        genomeViewer: true,
        genotype: true,
        assertion: true,
        summary: true,
        links: true,
        annot: true
    };
    this.tools = [];
    this.dataParser;
    this.responseParser;

    this.responseRoot = "response[0].result";
    this.responseTotal = "response[0].numTotalResults";
    this.startParam = "skip";

    this.browserGridConfig = {
        title: 'ClinVar browser grid',
        border: false
    };
    this.toolPanelConfig = {
        title: 'ClinVar data',
        border: false
    };
    this.toolsConfig = {
        headerConfig: {
            baseCls: 'ocb-title-2'
        }
    };

    _.extend(this.filters, args.filters);
    _.extend(this.browserGridConfig, args.browserGridConfig);
    _.extend(this.defaultToolConfig, args.defaultToolConfig);

    delete args.filters;
    delete args.defaultToolConfig;

//set instantiation args, must be last
    _.extend(this, args);

    this.selectedToolDiv;

    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }

}

EvaClinVarWidget.prototype = {
    render: function () {
        var _this = this;

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        this.clinvarBrowserGridDiv = document.createElement('div');
        this.clinvarBrowserGridDiv.setAttribute('class', 'ocb-variant-widget-grid');
        this.div.appendChild(this.clinvarBrowserGridDiv);

        this.clinvarBrowserGrid = this._createClinVarBrowserGrid(this.clinvarBrowserGridDiv);

        this.tabPanelDiv = document.createElement('div');
        this.tabPanelDiv.setAttribute('class', 'ocb-variant-tab-panel');
        this.div.appendChild(this.tabPanelDiv);

        this.toolTabPanel = Ext.create("Ext.tab.Panel", {
            title: this.toolPanelConfig.title,
            border: this.toolPanelConfig.border,
            margin: '10 0 0 0',
            height: this.toolPanelConfig.height,
            plain: true,
            animCollapse: false,
            header: this.toolPanelConfig.headerConfig,
            collapseDirection: Ext.Component.DIRECTION_BOTTOM,
            titleCollapse: true,
            overlapHeader: true,
            defaults: {
                hideMode: 'offsets',
                autoShow: true
            },
            listeners: {
                tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                    _this.selectedToolDiv = newTab.contentEl;
                    if (_this.lastSelected) {
                        _this.trigger('clinvar:change', {variant: _this.lastSelected, sender: _this});
                    }
                    if (_this.lastSelected && newTab.title == 'Genomic Context') {
                        _this.resizeGV();
                    }
                }
            }
        });

        var tabPanelItems = [];

        if (this.defaultToolConfig.summary) {
            this.clinvarSummaryPanelDiv = document.createElement('div');
            this.clinvarSummaryPanelDiv.setAttribute('class', 'ocb-variant-stats-panel');
            this.clinvarSummaryPanel = this._createSummaryPanel(this.clinvarSummaryPanelDiv);
            tabPanelItems.push({
                title: 'Summary',
                contentEl: this.clinvarSummaryPanelDiv
            });
        }

        if (this.defaultToolConfig.assertion) {
            this.clinvarAssertionPanelDiv = document.createElement('div');
            this.clinvarAssertionPanelDiv.setAttribute('class', 'ocb-variant-stats-panel');
            this.clinvarAssertionPanel = this._createAssertionPanel(this.clinvarAssertionPanelDiv);
            tabPanelItems.push({
                title: 'Clinical Assertion',
                contentEl: this.clinvarAssertionPanelDiv
            });
        }

        if (this.defaultToolConfig.annot) {
            this.clinvarAnnotPanelDiv = document.createElement('div');
            this.clinvarAnnotPanelDiv.setAttribute('class', 'ocb-variant-stats-panel');
            this.clinvarAnnotPanel = this._createAnnotPanel(this.clinvarAnnotPanelDiv);
            tabPanelItems.push({
                title: 'Annotation',
                contentEl: this.clinvarAnnotPanelDiv
            });
        }

        if (this.defaultToolConfig.links) {
            this.clinvarLinksPanelDiv = document.createElement('div');
            this.clinvarLinksPanelDiv.setAttribute('class', 'ocb-variant-stats-panel');
            this.clinvarLinksPanel = this._createLinksPanel(this.clinvarLinksPanelDiv);
            tabPanelItems.push({
                title: 'External Links',
                contentEl: this.clinvarLinksPanelDiv
            });
        }

        if (this.defaultToolConfig.genomeViewer) {
            this.genomeViewerDiv = document.createElement('div');
            this.genomeViewerDiv.setAttribute('class', 'ocb-gv');
            $(this.genomeViewerDiv).css({border: '1px solid lightgray'});
            this.genomeViewer = this._createGenomeViewer(this.genomeViewerDiv);
            tabPanelItems.push({
                title: 'Genomic Context',
                border: 0,
                contentEl: this.genomeViewerDiv,
                overflowX: true
            });
        }

        for (var i = 0; i < this.tools.length; i++) {
            var tool = this.tools[i];
            var toolDiv = document.createElement('div');

            tool.tool.target = toolDiv;

            tabPanelItems.push({
                title: tool.title,
                contentEl: toolDiv
            });
        }

        this.toolTabPanel.add(tabPanelItems);

        this.rendered = true;
    },
    draw: function () {
        var _this = this;
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAVAriantWidget target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.clinvarBrowserGrid.draw();

        this.toolTabPanel.render(this.tabPanelDiv);

        for (var i = 0; i < this.toolTabPanel.items.items.length; i++) {
            this.toolTabPanel.setActiveTab(i);
        }

        if (this.defaultToolConfig.summary) {
            this.clinvarSummaryPanel.draw();
        }

        if (this.defaultToolConfig.assertion) {
            this.clinvarAssertionPanel.draw();
        }

        if (this.defaultToolConfig.annot) {
            this.clinvarAnnotPanel.draw();
        }

        if (this.defaultToolConfig.links) {
            this.clinvarLinksPanel.draw();
        }

        if (this.defaultToolConfig.genomeViewer) {
            this.genomeViewer.draw();
        }

        for (var i = 0; i < this.tools.length; i++) {
            var tool = this.tools[i];
            tool.tool.draw();
        }

        this.toolTabPanel.setActiveTab(0);
    },
    _createClinVarBrowserGrid: function (target) {
        var _this = this;

        var columns = {
            items: [
                {
                    text: 'Chr',
                    dataIndex: 'chromosome',
                    flex: 0.16
                },
                {
                    text: "Position",
                    dataIndex: 'position',
                    flex: 0.3
                },
                {
                    text: '<img class="header-icon" style="" src="img/icon-info.png"/>Affected Gene',
                    dataIndex: 'hgnc_gene',
                    flex: 0.42,
                    iconCls: 'icon-info',
                    tooltip: 'Gene affected by this variant as reported by submitter',
                    renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                        if (value.measureSet.measure[0].measureRelationship) {
                            var gene = value.measureSet.measure[0].measureRelationship[0].symbol[0].elementValue.value;
                            value = '<a href="?gene=' + gene + '&species=hsapiens_grch37" target="_blank">' + gene + '</a>'
                        } else {
                            value = '';
                        }
                        return value;
                    }
                },
                {
                    text: 'Alleles',
                    xtype: "templatecolumn",
                    tpl: '<tpl if="reference">{reference:htmlEncode}<tpl else>-</tpl>/<tpl if="alternate">{alternate:htmlEncode}<tpl else>-</tpl>',
                    flex: 0.22
                },
                {
                    text: "Most Severe <br />Consequence Type",
                    dataIndex: 'most_severe_so_term',
                    flex: 0.6,
                    renderer: function (value, meta, rec, rowIndex, colIndex, store) {

                        if (!_.isUndefined(value)) {
                            var tempArray = [];
                            _.each(_.keys(value), function (key) {
                                var so_terms = this[key].soTerms;
                                _.each(_.keys(so_terms), function (key) {
                                    tempArray.push(this[key].soName)
                                }, so_terms);
                            }, value);

                            var groupedArr = _.groupBy(tempArray);
                            var so_array = [];
                            _.each(_.keys(groupedArr), function (key) {
                                var index = _.indexOf(consequenceTypesHierarchy, key);
//                                        so_array.splice(index, 0, key+' ('+this[key].length+')');
//                                        so_array.push(key+' ('+this[key].length+')')
                                if (index < 0) {
                                    so_array.push(key)
                                } else {
                                    so_array[index] = key;
                                }
                            }, groupedArr);
                            so_array = _.compact(so_array);
                            meta.tdAttr = 'data-qtip="' + _.first(so_array) + '"';
                            var so_term_detail = _.findWhere(consequenceTypesColors, {id: _.first(so_array)});
                            var color = '';
                            var impact = '';
                            var svg = '';
                            if (!_.isUndefined(so_term_detail)) {
                                color = so_term_detail.color;
                                impact = so_term_detail.impact;
                                svg = '<svg width="20" height="10"><rect x="0" y="3" width="15" height="10" fill="' + color + '"><title>' + impact + '</title></rect></svg>'
                            }
                            return value ? Ext.String.format(
                                '<tpl>' + _.first(so_array) + '&nbsp;' + svg + '</tpl>',
                                value
                            ) : '';
                        } else {
                            return '';
                        }
                    }
                },
                {
                    text: "Trait",
                    dataIndex: 'trait',
                    flex: 0.5,
                    renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                        _.each(_.keys(value), function (key) {
                            if (this[key].elementValue.type == 'Preferred') {
                                meta.tdAttr = 'data-qtip="' + this[key].elementValue.value + '"';
                                value = this[key].elementValue.value;
                            }
                        }, value);
                        return value;
                    }
                },
                {
                    text: "Clinical <br /> Significance",
                    dataIndex: 'clincalSignificance',
                    flex: 0.5,
                    renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: "ClinVar Accession",
                    dataIndex: "clincalVarAcc",
                    flex: 0.42,
                    xtype: "templatecolumn",
                    tpl: '<tpl><a href="https://www.ncbi.nlm.nih.gov/clinvar/{clincalVarAcc}" target="_blank">{clincalVarAcc}</a></tpl>'
                }
            ],
            defaults: {
                flex: 1,
                textAlign: 'left',
                align: 'left',
                sortable: false,
                menuDisabled: true
            }
        };

        var attributes = [
            {name: 'chromosome', mapping: 'chromosome', type: 'string' },
            {name: 'reference', mapping: 'reference', type: 'string' },
            {name: 'alternate', mapping: 'alternate', type: 'string' },
            {name: 'position', mapping: 'start', type: 'string' },
            {name: 'hgnc_gene', mapping: 'clinvarSet.referenceClinVarAssertion', type: 'auto' },
            {name: 'most_severe_so_term', mapping: 'annot.consequenceTypes', type: 'auto' },
            {name: 'trait', mapping: 'clinvarSet.referenceClinVarAssertion.traitSet.trait[0].name', type: 'auto' },
            {name: 'clincalSignificance', mapping: 'clinvarSet.referenceClinVarAssertion.clinicalSignificance.description', type: 'string' },
            {name: 'clincalVarAcc', mapping: 'clinvarSet.referenceClinVarAssertion.clinVarAccession.acc', type: 'string' },
            {name: 'annot', mapping: 'annot', type: 'auto' }
        ];

        var clinvarBrowserGrid = new ClinvarBrowserGrid({
            title: this.browserGridConfig.title,
            target: target,
            data: this.data,
            border: this.browserGridConfig.border,
            dataParser: this.dataParser,
            responseRoot: this.responseRoot,
            responseTotal: this.responseTotal,
            responseParser: this.responseParser,
            startParam: this.startParam,
            attributes: attributes,
            columns: columns,
            height: 400,
            samples: this.samples,
            headerConfig: this.headerConfig,
            handlers: {
                "clinvar:change": function (e) {
                    _this.lastSelected = e.args;
                    _this.trigger('clinvar:change', {variant: _this.lastSelected, sender: _this});
                },
                "clinvar:clear": function (e) {
                    _this.trigger('variant:clear', {sender: _this});
                }
            }
        });

        var exportCSVButton = {
            xtype: 'button',
            text: 'Export as CSV',
            style: {
                borderStyle: 'solid'
            },
            listeners: {
                click: {
                    element: 'el', //bind to the underlying el property on the panel
                    fn: function () {
                        var proxy = clinvarBrowserGrid.grid.store.proxy;
                        var url = EvaManager.url({
                            host: CELLBASE_HOST,
                            version: CELLBASE_VERSION,
                            category: 'hsapiens/feature',
                            resource: 'all',
                            query: 'clinical',
                            params: _this.formValues
                        });
                        var exportStore = Ext.create('Ext.data.Store', {
                            pageSize: clinvarBrowserGrid.grid.store.getTotalCount(),
                            autoLoad: true,
                            model: attributes,
                            remoteSort: true,
                            proxy: proxy,
                            extraParams: _this.formValues,
                            listeners: {
                                load: function (store, records, successful, operation, eOpts) {
//                                        var exportData = _this._exportToExcel(records,store.proxy.extraParams);
                                    if (_.isUndefined(_this.formValues)) {
                                        _this.formValues = {species: _this.species};
                                    }
                                    var exportData = _this._exportToExcel(records, _this.formValues);
                                    clinvarBrowserGrid.grid.setLoading(false);

                                }
                            }

                        });
                    }
                }
            }
        };

        var variantButton = {
            xtype: 'button',
            text: 'Show in Variant Browser',
            id:'variantBrw-button',
            style: {
                borderStyle: 'solid'
            },
            listeners: {
                click: {
                    element: 'el', //bind to the underlying el property on the panel
                    fn: function () {
                        var queryURL;
                        //sending tracking data to Google Analytics
                        ga('send', 'event', { eventCategory: 'Clinical Browser', eventAction: 'Show in Variant Browser', eventLabel:'Clicked'});
                        if (_this.values.clinvarSelectFilter == 'gene') {
                            queryURL = 'selectFilter=gene&gene='+_this.values.gene+'&species=hsapiens_grch37';
                        } else if (_this.values.clinvarSelectFilter == 'region') {
                            queryURL = 'selectFilter=region&region='+_this.values.region+'&species=hsapiens_grch37';
                        } else {
                            queryURL = 'selectFilter=region&region='+_this.lastSelected.chromosome+':'+_this.lastSelected.start+'-'+_this.lastSelected.end+'&species=hsapiens_grch37';
                        }
                        window.location = '?Variant Browser&'+queryURL;

                    }
                }
            }
        };

        clinvarBrowserGrid.grid.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            border: false,
            items: [exportCSVButton, variantButton]
        });

        return clinvarBrowserGrid;
    },
    _createAssertionPanel: function (target) {
        var _this = this;
        var assertionPanel = new ClinvarAssertionPanel({
            target: target,
            headerConfig: this.defaultToolConfig.headerConfig
        });

        this.clinvarBrowserGrid.on("clinvar:clear", function (e) {
            assertionPanel.clear(true);
        });

        this.on("clinvar:change", function (e) {
            if (_.isUndefined(e.variant)) {
                assertionPanel.clear(true);
            } else {
                if (target.id === _this.selectedToolDiv.id) {
                    assertionPanel.load(e.variant);
                    //sending tracking data to Google Analytics
                    ga('send', 'event', { eventCategory: 'Clinical Browser', eventAction: 'Tab Views', eventLabel:'Clinical Assertion'});
                }
            }
        });



        return assertionPanel;
    },
    _createSummaryPanel: function (target) {
        var _this = this;
        var summaryPanel = new ClinvarSummaryPanel({
            target: target
        });

        this.clinvarBrowserGrid.on("clinvar:clear", function (e) {
            summaryPanel.clear(true);
        });

        this.on("clinvar:change", function (e) {
//            if (target === _this.selectedToolDiv) {
            if (_.isUndefined(e.variant)) {
                summaryPanel.clear(true);
            } else {
                if (target.id === _this.selectedToolDiv.id) {
                    summaryPanel.load(e.variant);
                    //sending tracking data to Google Analytics
                    ga('send', 'event', { eventCategory: 'Clinical Browser', eventAction: 'Tab Views', eventLabel:'Summary'});
                }
            }
        });



        return summaryPanel;
    },
    _createAnnotPanel: function (target) {
        var _this = this;
        var annotPanel = new ClinvarAnnotationPanel({
            target: target
        });

        this.clinvarBrowserGrid.on("clinvar:clear", function (e) {
            annotPanel.clear(true);
        });

        this.on("clinvar:change", function (e) {
            if (_.isUndefined(e.variant)) {
                annotPanel.clear(true);
            } else {
                if (target.id === _this.selectedToolDiv.id) {
                    annotPanel.load(e.variant);
                    //sending tracking data to Google Analytics
                    ga('send', 'event', { eventCategory: 'Clinical Browser', eventAction: 'Tab Views', eventLabel:'Annotation'});
                }
            }
        });



        return annotPanel;
    },
    _createLinksPanel: function (target) {
        var _this = this;
        var linksPanel = new ClinvarLinksPanel({
            target: target
        });

        this.clinvarBrowserGrid.on("clinvar:clear", function (e) {
            linksPanel.clear(true);
        });

        this.on("clinvar:change", function (e) {
            if (_.isUndefined(e.variant)) {
                linksPanel.clear(true);
            } else {
                if (target.id === _this.selectedToolDiv.id) {
                    linksPanel.load(e.variant);
                    //sending tracking data to Google Analytics
                    ga('send', 'event', { eventCategory: 'Clinical Browser', eventAction: 'Tab Views', eventLabel:'External Links'});
                }
            }
        });



        return linksPanel;
    },

    _createGenomeViewer: function (target) {
        var _this = this;

        var region = new Region({
            chromosome: "13",
            start: 32889611,
            end: 32889611
        });

        var genomeViewer = new GenomeViewer({
            cellBaseHost: CELLBASE_HOST,
            sidePanel: false,
            target: target,
            border: false,
            resizable: false,
            width: this.width,
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
                    windowSizeControl: false,
//                    positionControl: false,
//                    moveControl: false,
//                    autoheightButton: false,
//                    compactButton: false,
//                    searchControl: false
                }
            }
        });
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
        this.on("species:change", function (e) {
            if (target === _this.selectedToolDiv) {
                _.extend(e, {species: e.values.species.split('_')[0]});
                genomeViewer._speciesChangeHandler(e);
            }
        });
        this.on("clinvar:change", function (e) {
            if (target.id === _this.selectedToolDiv.id) {
                var variant = e.variant;
                var region = new Region(variant);
                if (!_.isUndefined(genomeViewer)) {
                    genomeViewer.setRegion(region);
                }
            }
        });

        return genomeViewer;
    },
    resizeGV: function () {
        var _this = this;
        var gvTab = _.findWhere(_this.toolTabPanel.items.items, {title: 'Genomic Context'})
        var gvTabWidth = gvTab.getWidth();
        _this.genomeViewer.setWidth(gvTabWidth - 2);
    },
    retrieveData: function (baseUrl, filterParams) {
        this.clinvarBrowserGrid.loadUrl(baseUrl, filterParams);
    },
    setLoading: function (loading) {
        this.variantBrowserGrid.setLoading(loading);
    },
    _exportToExcel: function (records, params) {
        var csvContent = '',
        /*
         Does this browser support the download attribute
         in HTML 5, if so create a comma seperated value
         file from the selected records / if not create
         an old school HTML table that comes up in a
         popup window allowing the users to copy and paste
         the rows.
         */
            noCsvSupport = ( 'download' in document.createElement('a') ) ? false : true,
            sdelimiter = noCsvSupport ? "<td>" : "",
            edelimiter = noCsvSupport ? "</td>" : ",",
            snewLine = noCsvSupport ? "<tr>" : "",
            enewLine = noCsvSupport ? "</tr>" : "\r\n",
            printableValue = '',
            speciesValue = '';

        csvContent += snewLine;

        /* Get the column headers from the store dataIndex */

        var removeKeys = ['start', 'end', 'reference', 'alternate', 'clinvarList', 'clinvarSet', 'iid', 'variantString', '_id', 'annot'];

        Ext.Object.each(records[0].data, function (key) {
            if (_.indexOf(removeKeys, key) == -1) {
                csvContent += sdelimiter + key + edelimiter;
            }
        });
        csvContent += sdelimiter + 'Organism / Assembly' + edelimiter;

        csvContent += enewLine;

        console.log(csvContent)

        /*
         Loop through the selected records array and change the JSON
         object to teh appropriate format.
         */

        for (var i = 0; i < records.length; i++) {
            /* Put the record object in somma seperated format */
            csvContent += snewLine;
            Ext.Object.each(records[i].data, function (key, value) {
                var clinvarList = records[i].data.clinvarList;
                if (key == 'dbSNPAcc') {
                    if (!_.isUndefined(value)) {
                        if (value.type == 'rs') {
                            value = 'rs' + value.id;
                        } else {
                            value = '';
                        }
                    } else {
                        value = '';
                    }
                } else if (key == 'trait') {
                    var triatValue = value;
                    value = '';
                    _.each(_.keys(triatValue), function (key) {
                        if (this[key].elementValue.type == 'Preferred') {
                            value = this[key].elementValue.value;
                        }
                    }, triatValue);

                } else if (key == "hgnc_gene") {
                    if (value.measureSet.measure[0].measureRelationship) {
                        var gene = value.measureSet.measure[0].measureRelationship[0].symbol[0].elementValue.value;
                        value = gene
                    } else {
                        value = '';
                    }

                } else if (key == "most_severe_so_term") {
                    if (!_.isUndefined(value)) {
                        var tempArray = [];
                        _.each(_.keys(value), function (key) {
                            var so_terms = this[key].soTerms;
                            _.each(_.keys(so_terms), function (key) {
                                tempArray.push(this[key].soName)
                            }, so_terms);
                        }, value);

                        var groupedArr = _.groupBy(tempArray);
                        var so_array = [];
                        _.each(_.keys(groupedArr), function (key) {
                            var index = _.indexOf(consequenceTypesHierarchy, key);
//                                        so_array.splice(index, 0, key+' ('+this[key].length+')');
//                                        so_array.push(key+' ('+this[key].length+')')
//                            so_array[index] = key+' ('+this[key].length+')';
                            so_array[index] = key;
                        }, groupedArr);
                        so_array = _.compact(so_array);
                        value = _.first(so_array);

                    }
                }
                if (_.indexOf(removeKeys, key) == -1) {
                    printableValue = ((noCsvSupport) && value == '') ? '&nbsp;' : value;
                    printableValue = String(printableValue).replace(/,/g, "");
                    printableValue = String(printableValue).replace(/(\r\n|\n|\r)/gm, "");
                    csvContent += sdelimiter + printableValue + edelimiter;
                }

            });

            var speciesName;
            var species;

            if (!_.isEmpty(clinVarSpeciesList)) {
                speciesName = _.findWhere(clinVarSpeciesList, {taxonomyCode: params.species.split("_")[0]}).taxonomyEvaName;
                species = speciesName.substr(0, 1).toUpperCase() + speciesName.substr(1) + '/' + _.findWhere(clinVarSpeciesList, {assemblyCode: params.species.split('_')[1]}).assemblyName;

            } else {
                species = params.species;
            }

            speciesValue = ((noCsvSupport) && species == '') ? '&nbsp;' : species;
            speciesValue = String(species).replace(/,/g, "");
            speciesValue = String(speciesValue).replace(/(\r\n|\n|\r)/gm, "");
            csvContent += sdelimiter + speciesValue + edelimiter;
            csvContent += enewLine;
        }

        if ('download' in document.createElement('a')) {
            /*
             This is the code that produces the CSV file and downloads it
             to the users computer
             */
//            var link = document.createElement("a");
//            link.setAttribute("href", 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvContent));
//            link.setAttribute("download", "variants.csv");
//            link.setAttribute("target", "_blank");
//            link.click();

            var link = document.createElement('a');
            var mimeType = 'application/xls';
            var blob = new Blob([csvContent], {type: mimeType});
            var url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', 'EVA_ClinVar_Variants.csv');
            link.innerHTML = "Export to CSV";
            document.body.appendChild(link);
            link.click();

        } else {
            /*
             The values below get printed into a blank window for
             the luddites.
             */
            alert('Please allow pop up in settings if its not exporting');
            window.open().document.write('<table>' + csvContent + '</table>');
            return true;

        }

        return true;
    }
};
