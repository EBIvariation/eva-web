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

function EvaVariantWidgetPanel(args) {
    var _this = this;
    _.extend(this, Backbone.Events);

    this.id = Utils.genId("VariantWidgetPanel");

    this.target;
    this.tools = [];
    _.extend(this, args);
    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
};

EvaVariantWidgetPanel.prototype = {
    render: function () {
        var _this = this;
        if (!this.rendered) {
            this.div = document.createElement('div');
            this.div.setAttribute('id', this.id);
            this.panel = this._createPanel();
            this.rendered = true;
        }

    },
    draw: function () {
        if (!this.rendered) {
            this.render();
        }
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAVariantWidgetPanel target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);

        this.variantWidgetDiv = document.querySelector('.variant-widget');
        this.variantWidget = this._createVariantWidget(this.variantWidgetDiv);
        this.variantWidget.draw();

        this.formPanelVariantFilterDiv = document.querySelector('.form-panel-variant-filter');
        this.formPanelVariantFilter = this._createFormPanelVariantFilter(this.formPanelVariantFilterDiv);
        this.formPanelVariantFilter.draw();
    },
    show: function () {
        var _this = this;
        this.panel.show();
        _this.resize();
        var variantQuery = _this.queryParams;
        if (!_.isUndefined(variantQuery)) {
            _this._updateURL(variantQuery);
        }
    },
    hide: function () {
        this.panel.hide();
    },
    toggle: function () {
        if (this.panel.isVisible()) {
            this.panel.hide();
        } else {
            this.panel.show();
        }
    },
    resize: function (value) {
        var _this = this;
        if (_this.panel.isVisible()) {
            value = value || 0;
            if (value) {
                _this.panel.updateLayout();
            }
            _this.variantWidget.variantBrowserGrid.panel.updateLayout();
            _this.variantWidget.toolTabPanel.updateLayout();
            _this.formPanelVariantFilter.panel.updateLayout();
            var row = _this.variantWidget.variantBrowserGrid.grid.getSelectionModel().getSelection();
            if (_this.variantWidget.toolTabPanel.getActiveTab().title == 'Genomic Context') {
                _this.variantWidget.resizeGV();
            }
            _this.variantWidget.variantBrowserGrid.trigger("variant:change", {sender: _this, args: row[0].data});
        }
    },

    _createPanel: function () {
        var _this = this;
        Ext.EventManager.onWindowResize(function (e) {
            _this.resize(true);
        });

        this.panel = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'hbox',
                align: 'fit'
            },
            bodyStyle: 'border-width:0px;border-style:none;',
            items: [
                {
                    xtype: 'panel',
                    header: {
                        baseCls: 'eva-header-1',
                        titlePosition: 1
                    },
                    frame: false,
                    title: '<span style="margin-left:5px;">Filter</span>',
                    flex: 1.5,
                    collapsible: true,
                    collapseMode: 'header',
                    html: '<div class="variant-browser-option-div form-panel-variant-filter"></div>',
                    collapseDirection: 'left',
                    border: false,
                    animCollapse: false,
                    bodyStyle: 'border-width:0px;border-style:none;',
                    listeners: {
                        collapse: function () {
                            _this.resize();
                        },
                        expand: function () {
                            _this.resize();
                        }
                    }
                },
                {
                    xtype: 'panel',
                    header: {
                        baseCls: 'eva-header-1'
                    },
                    title: 'Variant Browser <img class="title-header-icon" data-qtip="Search the EVA variant warehouse using any combination of the filtering options on the left hand-side. Search results can be exported in CSV format and individual variants can be further investigated using the in-depth Variant Data tabs found below the main results table." style="margin-bottom:0px;" src="img/icon-info.png"/>',
                    flex: 4.8,
                    collapsible: false,
                    collapseMode: 'header',
                    html: '<div class="variant-browser-option-div variant-widget"></div>',
                    border: false,
                    forceFit: true,
                    bodyStyle: 'border-width:0px;border-style:none;',
                }
            ],
            cls: 'variant-widget-panel'
        });

        return  this.panel;
    },
    _createVariantWidget: function (target) {
        var evaVariantWidget = new EvaVariantWidget({
            width: 1000,
            target: target,
            headerConfig: false,
            border: true,
            browserGridConfig: {
                title: 'Variant Browser <img class="title-header-icon" data-qtip="Search the EVA variant warehouse using any combination of the filtering options on the left hand-side. Search results can be exported in CSV format and individual variants can be further investigated using the in-depth Variant Data tabs found below the main results table." style="margin-bottom:0px;" src="img/icon-info.png"/>',
                border: true
            },
            toolPanelConfig: {
                title: 'Variant Data',
                headerConfig: {
                    baseCls: 'eva-header-2'
                },
                border: true
            },
            defaultToolConfig: {
                headerConfig: {
                    baseCls: 'eva-header-2'
                },
                genomeViewer: false,
                effect: false,
                rawData: false,
                populationStats: true
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
                for (var i = 0; i < data.length; i++) {
                    var variant = data[i];
                    if (variant.hgvs && variant.hgvs.genomic > 0) {
                        variant.hgvs_name = variant.hgvs.genomic[0];
                    }
                }
            }
        });

        return evaVariantWidget;
    },
    _createFormPanelVariantFilter: function (target) {
        var _this = this;
        var positionFilter = new EvaPositionFilterFormPanel({
            emptyText: '',
            defaultFilterValue: _this.filter,
            defaultRegion: _this.region,
            defaultGeneValue: _this.gene,
            defaultSnpValue: _this.snp
        });

        var speciesFilter = new SpeciesFilterFormPanel({
            defaultValue: _this.species
        });

        this.studiesStore = Ext.create('Ext.data.Store', {
            pageSize: 50,
            proxy: {
                type: 'memory'
            },
            fields: [
                {name: 'studyName', type: 'string'},
                {name: 'studyId', type: 'string'}
            ],
            autoLoad: false,
            sorters: [
                {
                    property: 'studyName',
                    direction: 'ASC'
                }
            ]
        });

        var studyFilter = new EvaStudyFilterFormPanel({
            border: false,
            collapsed: false,
            height: 790,
            studiesStore: this.studiesStore,
            studyFilterTpl: '<tpl if="studyId"><div class="ocb-study-filter"><tpl if="link"><a href="?eva-study={studyId}" target="_blank">{studyName}</a> (<a href="?eva-study={studyId}" target="_blank">{studyId}</a>)<tpl else>{studyName} ({studyId}) </tpl></div><tpl else><div class="ocb-study-filter"><a href="?eva-study={studyId}" target="_blank">{studyName}</a></div></tpl>'
        });

        speciesFilter.on('species:change', function (e) {
            _this._loadListStudies(studyFilter, e.species);
            var plantSpecies = ['slycopersicum_sl240', 'zmays_b73refgenv3', 'zmays_agpv3'];

            //setting default positional value
            if (e.species == 'agambiae_agamp4') {
                _this.formPanelVariantFilter.panel.getForm().findField('region').setValue('X:10000000-11000000');
            } else if (e.species == 'aaegypti_aaegl3') {
                _this.formPanelVariantFilter.panel.getForm().findField('region').setValue('supercont1.18:165624-165624');
            }else if (e.species == 'ggallus_galgal4') {
               _this.formPanelVariantFilter.panel.getForm().findField('region').setValue('1:2100000-2500000');
            } else {
                _this.formPanelVariantFilter.panel.getForm().findField('region').setValue('1:3000000-3100000');
            }

            //hidding tabs for species
            if (e.species == 'zmays_agpv3') {
//                _this.variantWidget.toolTabPanel.getComponent(3).tab.hide()
//                _this.variantWidget.toolTabPanel.getComponent(3).tab.show()
            } else if (e.species == 'chircus_10' || e.species == 'olatipes_hdrr') {
//                _this.variantWidget.toolTabPanel.getComponent(3).tab.hide()
//                _this.variantWidget.toolTabPanel.getComponent(3).tab.show()
            } else {
//                _this.variantWidget.toolTabPanel.getComponent(4).tab.show()
//                _this.variantWidget.toolTabPanel.getComponent(3).tab.show()
            }

            _this.variantWidget.toolTabPanel.setActiveTab(0);

            EvaManager.get({
                category: 'meta/studies',
                resource: 'list',
                params: {species: e.species},
                success: function (response) {
                    try {
                        projects = response.response[0].result;
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        });

        var conseqTypeFilter = new EvaConsequenceTypeFilterFormPanel({
            consequenceTypes: consequenceTypes,
            selectAnnotCT: _this.selectAnnotCT,
            collapsed: true,
            fields: [
                {name: 'name', type: 'string'}
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'name'
                }
            ]
        });
        var populationFrequencyFilter = new EvaPopulationFrequencyFilterFormPanel({
            collapsed: true,
            maf: _this.maf
        });
        var proteinSubScoreFilter = new EvaProteinSubstitutionScoreFilterFormPanel({
            collapsed: true,
            polyphen: _this.polyphen,
            sift: _this.sift
        });
        var conservationScoreFilter = new EvaConservationScoreFilterFormPanel({
            collapsed: true
        });

        var formPanel = new EvaFormPanel({
            header: false,
            title: 'Filter',
            type: 'variantBrowser',
            headerConfig: false,
            mode: 'accordion',
            target: target,
            submitButtonText: 'Submit',
            submitButtonId: 'vb-submit-button',
            filters: [speciesFilter, positionFilter, conseqTypeFilter,populationFrequencyFilter,proteinSubScoreFilter, studyFilter],
            height: 1359,
            border: false,
            handlers: {
                'submit': function (e) {
                    _this.variantWidget.setLoading(true);
                    //POSITION CHECK
                    var regions = [];
                    if (typeof e.values.region !== 'undefined') {
                        if (e.values.region !== "") {
                            regions = e.values.region.split(",");
                        }
                        delete  e.values.region;
                    }
                    if (!_.isUndefined(e.values.species)) {
                        var cellBaseSpecies = e.values.species.split("_")[0];
                    }

                    if (typeof e.values.gene !== 'undefined') {
                        e.values.gene = e.values.gene.toUpperCase();
                    }

                    if (typeof e.values.snp !== 'undefined') {//
                        e.values.id = e.values.snp;
                    }

                    //CONSEQUENCE TYPES CHECK
                    if (typeof e.values.ct !== 'undefined') {
                        if (e.values.ct instanceof Array) {
                            e.values.ct = e.values.ct.join(",");
                        }
                    }

                    if (regions.length > 0) {
                        e.values['region'] = regions.join(',');
                    }

                    var category = 'segments';
                    var resource = 'variants';
                    var query = regions;
                    //<!--------Query by GENE ----->
                    if (e.values.gene) {
                        category = 'genes';
                        query = e.values.gene;
                    }

//                    //<!--------Query by ID ----->
                    if (e.values.id) {
                        resource = 'info';
                        category = 'variants';
                        query = e.values.id;
                    }

                    var url = EvaManager.url({
                        category: category,
                        resource: resource,
                        query: query,
                        params: {merge: true, exclude: 'sourceEntries'}
                    });

                    if (!_.isEmpty(e.values.studies)) {
                        e.values.studies = e.values.studies.join(',');
                    }

                    var limitExceeds = false;
                    _.each(regions, function (region) {
                        var start = region.split(':')[1].split('-')[0];
                        var end = region.split(':')[1].split('-')[1]
                        if (end - start > 1000000) {
                            Ext.Msg.alert('Limit Exceeds', 'Please enter the region no more than 1000000 range');
                            limitExceeds = true;
                        } else if (end - start < 0) {
                            Ext.Msg.alert('Incorrect Range', 'Please enter the correct range.The start of the region should be smaller than the end');
                        } else if (isNaN(start) || isNaN(end)) {
                            Ext.Msg.alert('Incorrect Value', 'Please enter a numeric value');
                        }
                    });

                    if (!_.isEmpty(e.values["annot-ct"])) {
                        e.values["annot-ct"] = e.values["annot-ct"].join(',');
                    }

                    var values = _.clone(e.values);
                    delete values['region'];
                    delete values['id'];
                    delete values['snp'];
                    delete values['selectFilter'];
                    delete values['gene'];

                    if (!limitExceeds) {
                        _this.variantWidget.retrieveData(url,values)
                    } else {
                        _this.variantWidget.retrieveData('', '')
                    }

                    _this.variantWidget.values = e.values;
                    _this['queryParams'] = e.values;
                    _this._updateURL(e.values);

                    var speciesArray = ['hsapiens', 'hsapiens_grch37', 'mmusculus_grcm38'];
                    var updateTpl;
                    if (e.values.species && speciesArray.indexOf(e.values.species) > -1) {
//                        var ensemblSepciesName = _.findWhere(speciesList, {taxonomyCode: e.values.species.split('_')[0]}).taxonomyScientificName;
//                        ensemblSepciesName = ensemblSepciesName.split(' ')[0] + '_' + ensemblSepciesName.split(' ')[1];
//                        var ensemblURL = 'http://www.ensembl.org/' + ensemblSepciesName + '/Variation/Explore?vdb=variation;v={id}';
//                        if (e.values.species == 'hsapiens_grch37') {
//                            ensemblURL = 'http://grch37.ensembl.org/' + ensemblSepciesName + '/Variation/Explore?vdb=variation;v={id}';
//                        }
                        var ncbiURL = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs={id}';
                        updateTpl = Ext.create('Ext.XTemplate', '<tpl if="id"><a href="?variant={chromosome}:{start}:{reference:htmlEncode}:{alternate:htmlEncode}&species=' + e.values.species + '" target="_blank"><img class="eva-grid-img-active" src="img/eva_logo.png"/></a>' +
//                            '<a href="' + ensemblURL + '" target="_blank"><img alt="" src="http://static.ensembl.org/i/search/ensembl.gif"></a>' +
                            '&nbsp;<a href="' + ncbiURL + '" target="_blank"><span>dbSNP</span></a>' +
                            '<tpl else><a href="?variant={chromosome}:{start}:{reference:htmlEncode}:{alternate:htmlEncode}&species=' + e.values.species + '" target="_blank"><img class="eva-grid-img-active" src="img/eva_logo.png"/></a>&nbsp;<span  style="opacity:0.2" class="eva-grid-img-inactive ">dbSNP</span></tpl>');
                    } else {
                        updateTpl = Ext.create('Ext.XTemplate', '<tpl><a href="?variant={chromosome}:{start}:{reference:htmlEncode}:{alternate:htmlEncode}&species=' + e.values.species + '" target="_blank"><img class="eva-grid-img-active" src="img/eva_logo.png"/></a>&nbsp;<span  style="opacity:0.2" class="eva-grid-img-inactive ">dbSNP</span></tpl>');
                    }

                    Ext.getCmp('variant-grid-view-column').tpl = updateTpl;
                }
            }
        });

        formPanel.on('form:clear', function (e) {
            _this.formPanelVariantFilter.filters[0].panel.getForm().findField('species').setValue(_this.species)
            _this.formPanelVariantFilter.filters[1].panel.getForm().findField('selectFilter').setValue(_this.filter)
        });

        _this.on('studies:change', function (e) {
            var formValues = _this.formPanelVariantFilter.getValues();
            var params = {id: positionFilter.id, species: formValues.species}
            _this.variantWidget.trigger('species:change', {values: formValues, sender: _this});
            _this.formPanelVariantFilter.trigger('submit', {values: formValues, sender: _this});
        });

        return formPanel;
    },
    _loadListStudies: function (filter, species) {
        var _this = this;
        var studies = [];
        var resource = '';
        if (_.isNull(species)) {
            resource = 'all'
        } else {
            resource = 'list'
        }
        EvaManager.get({
            category: 'meta/studies',
            resource: resource,
            params: {species: species},
            success: function (response) {
                try {
                    var _tempStudies = response.response[0].result;
                    _.each(_.keys(_tempStudies), function (key) {

                        if(_.indexOf(DISABLE_STUDY_LINK, this[key].studyId) > -1){
                            this[key].link = false;
                        }else{
                            this[key].link = true;
                        }
                        studies.push(this[key])

                    },_tempStudies);

                } catch (e) {
                    console.log(e);
                }

                _this.variantWidget.studies = studies;
                filter.studiesStore.loadRawData(studies);

                if (_.isEmpty(_this.selectStudies)) {
                    //set all records checked default
                    _this.formPanelVariantFilter.filters[5].grid.getSelectionModel().selectAll()
                } else {
                    console.log(_this.selectStudies)
                    var studyArray = _this.selectStudies.split(",");
                    var items = _this.formPanelVariantFilter.filters[5].grid.getSelectionModel().store.data.items;
                    var selectStudies = [];
                    _.each(_.keys(items), function (key) {
                        if (_.indexOf(studyArray, this[key].data.studyId) > -1) {
                            selectStudies.push(this[key])
                        }
                    }, items);

                    _this.formPanelVariantFilter.filters[5].grid.getSelectionModel().select(selectStudies)
                }

                _this.trigger('studies:change', {studies: studies, sender: _this});
            }
        });
    },
    _updateURL: function (values) {
        var _this = this;
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + 'Variant Browser&' + $.param(values);
        window.history.pushState({path: newurl}, '', newurl);
    }


};

