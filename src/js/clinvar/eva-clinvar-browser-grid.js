/*
 * Copyright (c) 2014 Francisco Salavert (SGL-CIPF)
 * Copyright (c) 2014 Alejandro Alemán (SGL-CIPF)
 * Copyright (c) 2014 Ignacio Medina (EBI-EMBL)
 *
 * This file is part of JSorolla.
 *
 * JSorolla is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JSorolla is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSorolla. If not, see <http://www.gnu.org/licenses/>.
 */
function ClinvarBrowserGrid(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("Widget");
    this.target;
    this.data = [];
    this.dataParser;
    this.responseParser;
    this.columns;
    this.attributes;
    this.type;
    this.height = 420;
    this.pageSize = 10;
    this.title = "ClinVarBrowserGrid";
    this.autoRender = true;
    this.border = false;
    this.responseRoot = "response[0].result";
    this.responseTotal = "response[0].numTotalResults";
    this.startParam = "skip";
    this.plugins = 'bufferedrenderer';
    this.viewConfigListeners = '';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }

}

ClinvarBrowserGrid.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing " + this.id);

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
    _createPanel: function () {

        var _this = this;

        this.model = Ext.define('Variant', {
            extend: 'Ext.data.Model',
            idProperty: 'iid',
            fields: this.attributes
        });

        this.store = Ext.create('Ext.data.Store', {
                pageSize: this.pageSize,
                model: this.model,
                remoteSort: true,
                proxy: {
                    type: 'memory',
                    enablePaging: true
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        _this.trigger("clinvar:clear", {sender: _this});
                    }
                }

            }
        );

        for (var i = 0; i < this.samples.length; i++) {
            var sampleName = this.samples[i];
            this._addSampleColumn(sampleName);
        }

        this.paging = Ext.create('Ext.PagingToolbar', {
            store: _this.store,
            id: _this.id + "_pagingToolbar",
            pageSize: _this.pageSize,
            displayInfo: true,
            displayMsg: 'Records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        });

        var grid = Ext.create('Ext.grid.Panel', {
                id: this.id + 'clinvar-browser-grid',
                title: this.title,
                store: this.store,
                border: this.border,
                header: this.headerConfig,
                loadMask: true,
                columns: this.columns,
                plugins: this.plugins,
                animCollapse: false,
                height: this.height,
                overflowX: true,
                // features: [
                //     {ftype: 'summary'}
                // ],
                viewConfig: {
                    emptyText: 'No records to display',
                    enableTextSelection: true,
                    listeners: this.viewConfigListeners,
                    loadMask: true

                },
                tbar: this.paging
            }
        );

        grid.getSelectionModel().on('selectionchange', function (sm, selectedRecord) {
            if (selectedRecord.length) {
                var clinVarAssertion = selectedRecord[0].data;
                _this.trigger("clinvar:change", {sender: _this, args: clinVarAssertion});
            }
        });

        this.grid = grid;
        return this.grid;
    },
    load: function (data) {
        var _this = this;
        this.store.destroy();

        if (typeof this.dataParser !== 'undefined') {
            this.dataParser(data)
        } else {
            this._parserFunction(data);

        }

        this.store = Ext.create('Ext.data.Store', {
            pageSize: this.pageSize,
            model: this.model,
            data: data,
            remoteSort: true,
            proxy: {
                type: 'memory',
                enablePaging: true
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {

                    if (typeof this.dataParser !== 'undefined') {
                        _this.dataParser(records);
                    } else if (!_.isNull(records)) {
                        _this._parserFunction(records);
                        _this.grid.getSelectionModel().select(0, true);
                    }
                    _this.setLoading(false);
                },
                beforeload: function (store, operation, eOpts) {
                    _this.setLoading(true);
                    _this.trigger("clinvar:clear", {sender: _this});
                    _this.trigger("clinvar:change", {sender: _this});
                }
            }
        });
        this.grid.reconfigure(this.store, this.columnsGrid);
        this.paging.bindStore(this.store);
        this.paging.doRefresh();
    },
    loadUrl: function (baseUrl, filterParams) {
        var _this = this;
        this.store.destroy();

        console.log("filter");
        console.log(filterParams)

        console.log(filterParams)

        this.store = Ext.create('Ext.data.Store', {
            pageSize: this.pageSize,
            model: this.model,
            remoteSort: true,
            proxy: {
                url: baseUrl,
                type: 'ajax',
                startParam: this.startParam,
                useDefaultXhrHeader: false,
                reader: {
                    root: this.responseRoot,
                    totalProperty: this.responseTotal,
                    transform: function (response) {
                        var data = [];
                        if (typeof _this.responseParser !== 'undefined') {
                            data = _this.responseParser(response);
                        }
                        if (typeof _this.dataParser !== 'undefined') {
                            _this.dataParser(data);
                        } else {
                            _this._parserFunction(data);
                        }
                        return response;
                    }
                },
                extraParams: filterParams,
                actionMethods: {create: 'GET', read: 'GET', update: 'GET', destroy: 'GET'}
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {

                    if (typeof this.dataParser !== 'undefined') {
                        _this.dataParser(records);
                    } else if (!_.isNull(records)) {
                        _this._parserFunction(records);
                        _this.grid.getSelectionModel().select(0, true);
                    }

                    _this.setLoading(false);
                },
                beforeload: function (store, operation, eOpts) {
                    _this.trigger("clinvar:clear", {sender: _this});
                    _this.trigger("clinvar:change", {sender: _this});
                }
            }
        });

        this.grid.reconfigure(this.store, this.columnsGrid);
        this.paging.bindStore(this.store);
        this.store.load();

    },
    _parserFunction: function (data) {
        for (var i = 0; i < data.length; i++) {
            var variant = data[i];
        }
    },
    setLoading: function (loading) {
        this.panel.setLoading(loading);
    },
    _addSampleColumn: function (sampleName) {

        var _this = this;
        for (var i = 0; i < _this.attributes.length; i++) {
            if (_this.attributes[i].name == sampleName) {
                return false;
            }
        }
        _this.attributes.push({
            "name": sampleName,
            "type": "string"
        });

        for (var i = 0; i < _this.columns.length; i++) {
            var col = _this.columns[i];

            if (col['text'] == "Samples") {
                col["columns"].push({
                    "text": sampleName,
                    "dataIndex": sampleName,
                    "flex": 1,
                    "sortable": false
                });
            }
        }
        this.store.setFields(this.attributes);
    }
};
