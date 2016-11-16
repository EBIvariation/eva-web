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
function EvaStudyBrowserWidgetPanel(args) {
    var _this = this;
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("StudyBrowserPanel");
    this.target;
    this.tools = [];
    _.extend(this, args);
    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
}

EvaStudyBrowserWidgetPanel.prototype = {
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
            console.log('EVAStudyBrowserPanel target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);

        this.studyBrowserWidgetDiv = document.querySelector('.study-widget');
        this.studyBrowserWidget = this._createStudyBrowser(this.studyBrowserWidgetDiv);
        this.studyBrowserWidget.draw();

        this.formPanelStudyFilterDiv = document.querySelector('.form-panel-study-filter');
        this.formPanelStudyFilter = this._createFormPanelVariantFilter(this.formPanelStudyFilterDiv);
        this.formPanelStudyFilter.draw();
    },
    show: function () {
        var _this = this;
        this.panel.show();
        _this.resize();
        // var query = _this.formPanelStudyFilter.getValues();
        // _this._updateURL(query);
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
            _this.formPanelStudyFilter.panel.updateLayout();
            _this.studyBrowserWidget.panel.updateLayout();
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
                    html: '<div class="variant-browser-option-div form-panel-study-filter"></div>',
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
                    id: 'study-browser-grid-panel',
                    title: 'Study Browser',
                    flex: 4.8,
                    collapsible: false,
                    collapseMode: 'header',
                    html: '<div class="variant-browser-option-div study-widget"></div>',
                    border: false,
                    forceFit: true,
                    bodyStyle: 'border-width:0px;border-style:none;'
                }
            ],
            cls: 'variant-widget-panel'
        });

        return  this.panel;
    },
    _createFormPanelVariantFilter: function (target) {
        var _this = this;

        this.browserTypeFilter = new StudyBrowserTypeFilterFormPanel({
            defaultValue: _this.browserType
        });

        this.searchFilter = new StudyBrowserTextSearchFormPanel({
            defaultValue: _this.search
        });

        this.speciesFilter = new StudyFilterFormPanel({
            title: 'Genome',
            collapsed: false,
            defaultValues: _this.species,
            fields: [
                {name: 'display', type: 'string'}
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'display'
                }
            ]
        });

        this.typeFilter = new StudyFilterFormPanel({
            title: 'Type',
            collapsed: false,
            fields: [
                {name: 'display', type: 'string'}
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'display'
                }
            ]
        });

        var formPanel = new EvaFormPanel({
            header: false,
            title: 'Filter',
            type: 'variantBrowser',
            headerConfig: false,
            mode: 'accordion',
            target: target,
            submitButtonText: 'Submit',
            submitButtonId: 'study-submit-button',
            filters: [this.browserTypeFilter, this.searchFilter, this.speciesFilter, this.typeFilter],
            height: 1359,
            border: false,
            handlers: {
                'submit': function (e) {
                    console.log(e)
                    var params = e.values;
                    params.species = params.genome;
                    params = _.omit(params, ['genome']);
                    if (params.browserType == 'sv') {
                        _.extend(params, {structural: true})
                    }

                    _this._loadStudies(params);
                    if (params.search) {
                        _this._textSearch(params.search);
                    }

                    if(_this.pushURL) {
                        _this._updateURL (params);
                    }
                    _this.pushURL = true;

                }
            }
        });

        formPanel.on('form:clear', function (e) {
            _this.formPanelStudyFilter.panel.getForm().findField('browserTypeRadio').setValue({browserType: 'sgv'})
        });

        this.searchFilter.on('studySearch:change', function (e) {
            _this._textSearch(e.search);
        });

        this.browserTypeFilter.on('browserType:change', function (e) {
            var btValue = _this.formPanelStudyFilter.panel.getForm().findField('browserTypeRadio').getValue();
            var params;
            if (btValue.browserType == 'sv') {
                params = {structural: true}
                Ext.getCmp('study-browser-grid-panel').setTitle('Structural Variants (>50bp) Browser');
            } else {
                Ext.getCmp('study-browser-grid-panel').setTitle('Short Genetic Variants (<50bp) Browser');
            }

            _this._loadFilterPanelvalues(params)
            var values = formPanel.getValues();
            _.extend(values, params)
            _this._loadStudies(values);
            if(_this.pushURL) {
                _this._updateURL(values);
            }
            _this.pushURL = true;

        });

        return formPanel;
    },
    _createStudyBrowser: function (target) {
        var _this = this;

        this.studyColumns = [
            {
                text: "ID",
                dataIndex: 'id',
                flex: 2.2,
                // To render a link to FTP
                renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                    meta.tdAttr = 'data-qtip="Click to see  more detailed information"';
                    return value ? Ext.String.format(
                        '<a href="?eva-study=' + value + '">' + value + '</a>',
                        value
                    ) : '';
                }
            },
            {
                text: "Name",
                dataIndex: 'name',
                flex: 7
            },
            {
                text: "Genome",
                dataIndex: 'speciesCommonName',
                flex: 2
            },
            {
                text: "Species",
                dataIndex: 'speciesScientificName',
                flex: 2.7,
                renderer: function (value, p, record) {
                    return value ? Ext.String.format(
                        '<div data-toggle="popover" title="'+value+'">{0}</div>',
                        value
                    ) : '';
                }
            },
            {
                text: "Type",
                dataIndex: 'experimentTypeAbbreviation',
                flex: 1.5,
                renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                    meta.tdAttr = 'data-qtip="' + rec.data.experimentType + '"';
                    return value ? Ext.String.format(
                        '<tpl>' + value + '</tpl>',
                        value
                    ) : '';
                }
            },
            {
                text: "Download",
                dataIndex: 'id',
                flex: 1.5,
                renderer: function (value, p, record) {
                    return value ? Ext.String.format(
                        '<a href="ftp://ftp.ebi.ac.uk/pub/databases/eva/{0}" target="_blank">FTP</a>',
                        value,
                        record.data.threadid
                    ) : '';
                }
            }

        ];

        var plugins = [
            {
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate()
            }
        ];

        var evaStudyBrowserGrid = new EvaStudyBrowserGrid({
            title: '',
            target: target,
            data: this.data,
            height: 775,
            margin: '-25 0 0 0',
            headerConfig: {
                baseCls: 'eva-header-2'
            },
            border: true,
            columnsGrid: this.studyColumns
        });

        return evaStudyBrowserGrid;

    },
    _loadFilterPanelvalues: function (values) {
        var _this = this;

        var tmpSpecies = _this.species.split(",");
        var tmpType = _this.type.split(",");
        var defaultType = [];
        var defaultSpecies = [];
        for (i = 0; i < tmpType.length; ++i) {
            defaultType.push(tmpType[i].replace(/\+/g, " "));
        }
        for (i = 0; i < tmpSpecies.length; ++i) {
            defaultSpecies.push(tmpSpecies[i].replace(/\+/g, " "));
        }
        var data;
        EvaManager.get({
            category: 'meta/studies',
            resource: 'stats',
            params: values,
            async: false,
            success: function (response) {
                try {
                    var statsData = {};
                    var responseStatsData = response.response[0].result[0];

                    for (key in responseStatsData) {
                        var stat = responseStatsData[key];
                        var arr = [];
                        for (key2 in stat) {
                            var obj = {};
                            var checked = false;
                            if (key == 'species') {
                                if (_.indexOf(defaultSpecies, key2) > -1) {
                                    checked = true;
                                }
                            } else if (key == 'type') {
                                if (_.indexOf(defaultType, key2) > -1) {
                                    checked = true;
                                }
                            }
                            // TODO We must take care of the types returned
                            if (key2.indexOf(',') == -1) {
                                obj['display'] = key2;
                                obj['leaf'] = true;
                                obj['checked'] = checked;
                                obj['iconCls'] = "no-icon";
                                obj['count'] = stat[key2];
                            }
                            if (!_.isEmpty(obj)) {
                                arr.push(obj);
                            }
                        }

                        statsData[key] = arr;
                        statsData[key] = _.sortBy(statsData[key], 'display');
                        _this.speciesFilter.store.loadRawData(statsData['species']);
                        _this.typeFilter.store.loadRawData(statsData['type']);
                        data = statsData;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    },
    _loadStudies: function (params) {
        var _this = this;
        _this._updateColumns(params)
        EvaManager.get({
            category: 'meta/studies',
            resource: 'all',
            params: params,
            async: false,
            success: function (response) {
                var studies = [];
                try {
                    studies = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
                _this.studyBrowserWidget.load(studies)
            }
        });
    },
    _updateColumns: function (params) {
        var _this = this;
        var columns = _this.studyColumns;
        if (params.browserType == 'sv') {
            columns = [
                {
                    text: "ID",
                    dataIndex: 'id',
                    flex: 2,
                    // To render a link to FTP
                    renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'data-qtip="Click to see  more detailed information"';
                        return value ? Ext.String.format(
                            '<a href="?dgva-study=' + value + '">' + value + '</a>',
                            value
                        ) : '';
                    }
                },
                {
                    text: "Name",
                    dataIndex: 'name',
                    flex: 3
                },
                {
                    text: "Genome",
                    dataIndex: 'speciesCommonName',
                    flex: 3,
                    renderer: function (value, p, record) {
                        return value ? Ext.String.format(
                            '<div data-toggle="popover" title="'+value+'">{0}</div>',
                            value
                        ) : '';
                    }
                },
                {
                    text: "Species",
                    dataIndex: 'speciesScientificName',
                    flex: 3,
                    renderer: function (value, p, record) {
                        return value ? Ext.String.format(
                            '<div data-toggle="popover" title="'+value+'">{0}</div>',
                            value
                        ) : '';
                    }
                },
                {
                    text: "Type",
                    dataIndex: 'typeName',
                    flex: 2
                },
                {
                    text: 'Download',
                    //dataIndex: 'id',
                    xtype: 'templatecolumn',
                    tpl: '<tpl><a href="ftp://ftp.ebi.ac.uk/pub/databases/dgva/{id}_{name}" target="_blank">FTP</a></tpl>',
                    flex: 1.5
                }
            ];

        }

        _this.studyBrowserWidget.columnsGrid = columns;
    },
    _updateURL: function (values) {
        var _this = this;
        var _tempValues = values;

        if (values['species']) {
            values['studySpecies'] = values['species'];
        }

        if (values['type']) {
            values['studyType'] = values['type'];
        }

        delete values.species;
        delete values.type;
        delete values.structural;
        _.each(_.keys(_tempValues), function (key) {
            if (_.isArray(this[key])) {
                values[key] = this[key].join();
            }
        }, _tempValues);

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + 'Study Browser&' + $.param(values);
        history.pushState('forward', '', newurl);
        //sending tracking data to Google Analytics
        var gaValues = $.param(values).split("&");
        _.each(_.keys(gaValues), function (key) {
            ga('send', 'event', { eventCategory: 'Study Browser', eventAction: 'Search', eventLabel:decodeURIComponent(this[key])});
        }, gaValues);
    },
    _textSearch: function (value) {
        var _this = this;
        var store = _this.studyBrowserWidget.store;
        store.clearFilter();
        if (value == "") {
            store.clearFilter();
            store.reload({start:0, limit:25});
        } else {
            var regex = new RegExp(value, "i");
            store.reload({start:0, limit:store.totalCount})
            store.filterBy(function (e) {
                return regex.test(e.get('id')) || regex.test(e.get('name')) || regex.test(e.get('description'));
            });
        }
    }

}