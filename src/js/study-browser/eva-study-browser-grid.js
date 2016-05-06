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
function EvaStudyBrowserGrid(args) {
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
    this.height = 400;
    this.pageSize = 10;
    this.title = "StudyBrowserGrid";
    this.autoRender = true;
    this.border = false;
    this.responseRoot = "response[0].result";
    this.responseTotal = "response[0].numTotalResults";
    this.startParam = "skip";
    this.plugins = 'bufferedrenderer';
    this.margin = '0 0 0 0';
    this.viewConfigListeners = '';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }

}

EvaStudyBrowserGrid.prototype = {
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
                model: this.model,
                remoteSort: true,
                remoteFilter: true,
                proxy: {
                    type: 'memory',
                    enablePaging: false
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        _this.trigger("variant:clear", {sender: _this});
                    }
                }
            }
        );

        this.paging = Ext.create('Ext.PagingToolbar', {
            store: _this.store,
            id: _this.id + "_pagingToolbar",
            pageSize: _this.pageSize,
            displayInfo: true,
            displayMsg: 'Studies {0} - {1} of {2}',
            emptyMsg: "No studies to display",
            inputItemWidth: 40
        });

        var grid = Ext.create('Ext.grid.Panel', {
                id: 'study-browser-grid',
                title: this.title,
                margin: this.margin,
                store: this.store,
                border: this.border,
                header: this.headerConfig,
                loadMask: true,
                columns: this.columnsGrid,
                animCollapse: false,
                height: this.height,
                overflowX: false,
                overflowY: false,
                collapsible: false,
                // features: [
                //     {ftype: 'summary'}
                // ],
                plugins: [
                    {
                        ptype: 'rowexpander',
                        rowBodyTpl: new Ext.XTemplate(
                            '<p style="padding: 2px 2px 2px 15px"><b>Platform:</b> {platform}</p>',
                            '<p style="padding: 2px 2px 2px 15px"><b>Centre:</b> {center}</p>',
                            '<p style="padding: 2px 2px 5px 15px"><b>Description:</b> {description}</p>'
                        )
                    }
                ],
                viewConfig: {
                    emptyText: 'No records to display',
                    enableTextSelection: true,
                    listeners: this.viewConfigListeners
                },
                tbar: this.paging
            }
        );

        grid.getSelectionModel().on('selectionchange', function (sm, selectedRecord) {
            console.log(selectedRecord.length)
            if (selectedRecord.length) {
                var row = selectedRecord[0].data;
                _this.trigger("variant:change", {sender: _this, args: row});
            }
        });

        grid.on('rowclick', function (grid, rowIndex, columnIndex, e) {
            _this.trigger("variant:change", {sender: _this, args: rowIndex.data});
        }, this);

        this.grid = grid;
        return grid;
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
            model: this.model,
            data: data,
            remoteSort: true,
            proxy: {
                type: 'memory',
                enablePaging: true

            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                    _this.trigger("variant:clear", {sender: _this});
                },
                load: function (store, records, successful, operation, eOpts) {
                    _this.setLoading(false);
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
        console.log('++++++')

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
                    _this.trigger("variant:clear", {sender: _this});
                    _this.trigger("variant:change", {sender: _this});
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

            if (variant.hgvs && variant.hgvs.genomic && variant.hgvs.genomic.length > 0) {
                variant.hgvs_name = variant.hgvs.genomic[0];
            }
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
