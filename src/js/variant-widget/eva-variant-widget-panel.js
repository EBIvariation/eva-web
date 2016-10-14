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
            // _this.variantWidget.variantBrowserGrid.trigger("variant:change", {sender: _this, args: row[0].data});
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
                }
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
            //setting default positional value
            var defaultRegion;
            switch (e.species) {
                case 'agambiae_agamp4':
                    defaultRegion = 'X:10000000-11000000';
                    break;
                case 'aaegypti_aaegl3':
                    defaultRegion = 'supercont1.18:165624-165624';
                    break;
                case 'ggallus_galgal4':
                    defaultRegion = '1:2100000-2500000';
                    break;
                case 'aquadriannulatus_quad4av1':
                    defaultRegion = 'KB665398:1-200000';
                    break;
                case 'sratti_ed321v504':
                    defaultRegion = 'SRAE_chr2:10000-20000';
                    break;
                case 'hsapiens_grch37':
                    defaultRegion = '2:48000000-49000000';
                    break;
                case 'asinensis_v1':
                    defaultRegion = 'AXCK02015324:1-500000';
                    break;
                case 'astephensi_sda500v1':
                    defaultRegion = 'KB664288:1-500000';
                    break;
                default:
                    defaultRegion = '1:3000000-3100000';
            }

            _this.formPanelVariantFilter.panel.getForm().findField('region').setValue(defaultRegion);
            _this.variantWidget.toolTabPanel.setActiveTab(0);

            if (e.species == 'hsapiens_grch37') {
                _this.variantWidget.toolTabPanel.getComponent(4).tab.show();
                Ext.getCmp('clinvar-button').show();
            } else {
                _this.variantWidget.toolTabPanel.getComponent(4).tab.hide();
                Ext.getCmp('clinvar-button').hide();
            }

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

                    if (!_.isEmpty(e.values["annot-ct"])) {
                        e.values["annot-ct"] = e.values["annot-ct"].join(',');
                    }

                    var values = _.clone(e.values);
                    delete values['region'];
                    delete values['id'];
                    delete values['snp'];
                    delete values['selectFilter'];
                    delete values['gene'];

                    if (_this.formPanelVariantFilter.validatePositionFilter(regions)) {
                        _this.variantWidget.retrieveData(url,values);
                        _this.variantWidget.values = e.values;
                        _this['queryParams'] = e.values;
                        if(_this.pushURL){
                            _this._updateURL(e.values);
                        }
                        _this.pushURL = true;

                    } else {
                        _this.variantWidget.retrieveData('', '');
                    }

                }
            }
        });

        formPanel.on('form:clear', function (e) {
            _this.formPanelVariantFilter.filters[0].panel.getForm().findField('species').setValue('hsapiens_grch37');
            _this.formPanelVariantFilter.filters[1].panel.getForm().findField('selectFilter').setValue('region');
            _this.formPanelVariantFilter.filters[1].panel.getForm().findField('region').setValue('2:48000000-49000000');
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
        history.pushState ('forward', '', newurl);

        //sending tracking data to Google Analytics
        var searchParams = values['species']+'&'+values['selectFilter'];
        var filterValue;
        switch (values['selectFilter']) {
            case 'gene':
                filterValue = values['gene'];
                break;
            case 'snp':
                filterValue = values['snp'];
                break;
            default:
                filterValue = values['region'];
        }
        searchParams += '='+filterValue;
        ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:searchParams});
        ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:'species='+values['species']});
        values = _.omit(values, 'selectFilter', 'species', 'gene', 'snp', 'region');
        var gaValues = $.param(values).split("&");
        _.each(_.keys(gaValues), function (key) {
            ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:decodeURIComponent(this[key])});
        }, gaValues);
    }


};

