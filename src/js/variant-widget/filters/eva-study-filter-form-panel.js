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
function EvaStudyFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("StudyFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Studies Mapped To Assembly";
//    this.studies = [];
//    this.studiesStore;
    this.border = true;
    this.height = 300;
    this.collapsed = false;
    this.studyFilterTpl = '<tpl><div class="ocb-study-filter">{studyName}</div></tpl>';

    /**
     * TO BE REMOVED!
     * @type {Ext.data.Store}
     */
    this.studiesStore = Ext.create('Ext.data.Store', {
        pageSize: 50,
        proxy: {
            type: 'memory'
        },
        fields: [
            {name: 'studyName', type: 'string'},
            {name: 'studyId', type: 'string'}
        ],
        autoLoad: false
    });

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }

}

EvaStudyFilterFormPanel.prototype = {
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
        var studySearchField = Ext.create('Ext.form.field.Text', {
            emptyText: 'search',
            listeners: {
                change: function () {
                    var value = this.getValue();
                    if (value == "") {
                        _this.studiesStore.clearFilter();
                    } else {
                        var regex = new RegExp(value, "i");
                        _this.studiesStore.filterBy(function (e) {
                            return regex.test(e.get('studyName'));
                        });
                    }
                }
            }
        });

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            listeners: {
                selectionchange: function (model, records) {

                }
            }
        });

        this.grid = Ext.create('Ext.grid.Panel', {
                store: this.studiesStore,
                autoScroll: true,
                border: this.border,
                loadMask: true,
                hideHeaders: false,
                enableColumnHide: false,
                plugins: 'bufferedrenderer',
                // features: [
                //     {ftype: 'summary'}
                // ],
                cls: 'studyList',
                height: this.height,
                viewConfig: {
                    stripeRows: false,
                    emptyText: 'No studies found',
                    enableTextSelection: true,
                    markDirty: false,
                    listeners: {
                        itemclick: function (este, record) {
                            var studies = _this.grid.getSelectionModel().getSelection();
                        },
                        itemcontextmenu: function (este, record, item, index, e) {

                        }
                    }
                },
                selModel: selModel,
                columns: [
                    {
                        text: "Name",
                        dataIndex: 'studyName',
                        flex: 10,
                        xtype: 'templatecolumn',
                        tpl: this.studyFilterTpl,
                        sortable: true
                    }
                ]
            }
        );

        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: "5",
            margin: "0 0 5 0",
            buttonAlign: 'center',
            border: false,
            title: this.title,
            height: this.height,
            collapsed: this.collapsed,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                studySearchField,
                this.grid
            ]
        });

        return form;
    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var _this = this;
        var values = [];
        var selection = _this.grid.getSelectionModel().getSelection();
        for (var i = 0; i < selection.length; i++) {
            values.push(selection[i].data.studyId)
        }
        var res = {};
        if (values.length > 0) {
            res['studies'] = values;
        }
        return res;
    },
    clear: function () {
        this.panel.reset();
    }
}
