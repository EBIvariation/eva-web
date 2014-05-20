/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

function NetworkFileWidget(args) {
    var _this = this;
    _.extend(this, Backbone.Events);
    this.id = Utils.genId('NetworkFileWidget');

    this.targetId;
    this.title = 'Network widget abstract class';
    this.width = 600;
    this.height = 300;

    //set instantiation args, must be last
    _.extend(this, args);

    this.dataAdapter;
    this.content;

    this.on(this.handlers);
};

NetworkFileWidget.prototype.getTitleName = function () {
    return Ext.getCmp(this.id + "_title").getValue();
};

NetworkFileWidget.prototype.getFileUpload = function () {
    /* to implemtent on child class */
};

NetworkFileWidget.prototype.addCustomComponents = function () {
    /* to implemtent on child class */
};

NetworkFileWidget.prototype.draw = function () {
    var _this = this;

    if (this.panel == null) {
        /** Bar for the file upload browser **/
        var browseBar = Ext.create('Ext.toolbar.Toolbar', {dock: 'top'});
        browseBar.add(this.getFileUpload());

        this.infoLabel = Ext.create('Ext.toolbar.TextItem', {text: 'Please select a network saved file'});
        this.countLabel = Ext.create('Ext.toolbar.TextItem');
        this.infobar = Ext.create('Ext.toolbar.Toolbar', {dock: 'bottom'});
        this.infobar.add(['->', this.infoLabel, this.countLabel]);

//		/** Container for Preview **/
//		var previewContainer = Ext.create('Ext.container.Container', {
//			id:this.previewId,
//			cls:'x-unselectable',
//			flex:1,
//			autoScroll:true
//		});


        /** Grid for Preview **/
        this.gridStore = Ext.create('Ext.data.Store', {
            pageSize: 50,
            proxy: {
                type: 'memory'
            },
            fields: ["0", "1", "2"]
        });
        this.grid = Ext.create('Ext.grid.Panel', {
            border: false,
            flex: 1,
            store: this.gridStore,
            loadMask: true,
            plugins: ['bufferedrenderer'],
            dockedItems: [
                this.infobar
            ],
            columns: [
                {"header": "Source node", "dataIndex": "0", flex: 1},
                {"header": "Relation", "dataIndex": "1", flex: 1, menuDisabled: true},
                {"header": "Target node", "dataIndex": "2", flex: 1}
            ]
        });

        var comboLayout = Ext.create('Ext.form.field.ComboBox', {
            margin: "0 0 0 5",
            width: 120,
            editable: false,
            displayField: 'name',
            valueField: 'name',
            value: "none",
            store: new Ext.data.SimpleStore({
                fields: ['name'],
                data: [
                    ["none"],
                    ["Force directed"],
                    ["Random"],
                    ["Circle"]
                ]
            })
        });

        this.panel = Ext.create('Ext.window.Window', {
            title: this.title,
            width: this.width,
            height: this.height,
            resizable: false,
            layout: { type: 'vbox', align: 'stretch'},
            items: [this.grid],
            dockedItems:[
                browseBar
            ],
            buttons: [
                {
                    xtype: 'text',
                    margin: "5 0 0 0",
                    text: 'Apply layout:'
                },
                comboLayout,
                '->',
                {text: 'Ok', handler: function () {
                    _this.trigger('okButton:click', {content: _this.content, layout: comboLayout.getValue(), sender: _this});
                    _this.panel.close();
                }
                },
                {text: 'Cancel', handler: function () {
                    _this.panel.close();
                }}
            ],
            listeners: {
                scope: this,
                minimize: function () {
                    this.panel.hide();
                },
                destroy: function () {
                    delete this.panel;
                }
            }
        });
        this.addCustomComponents();

    }
    this.panel.show();
};
