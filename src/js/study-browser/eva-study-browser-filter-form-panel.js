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
function StudyFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("SpeciesFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Species";
    this.border = false;
    this.collapsible = true;
    this.titleCollapse = false;
    this.headerConfig;
    this.speciesList = speciesList;
    this.defaultValue = 'hsapiens_grch37';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

StudyFilterFormPanel.prototype = {
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

        Ext.define(this.id+'-tree-model', {
            extend: 'Ext.data.Model',
            fields: this.fields
        });

        this.store = Ext.create('Ext.data.TreeStore', {
            model: this.id + '-tree-model',
            proxy: {
                type: 'memory',
                data: [],
                reader: {
                    type: 'json'
                }
            }
        });

        this.panel = Ext.create('Ext.tree.Panel', {
            title: this.title,
            border: this.border,
            useArrows: true,
            rootVisible: true,
            store: this.store,
            multiSelect: true,
            singleExpand: false,
            hideHeaders: true,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            collapsed: this.collapsed,
            header: this.headerConfig,
            columns: this.columns,
            listeners: {
                'checkchange': function (node) {
                    node.cascadeBy(function (n) {
                        // n.set('checked', checked);
                        _this.panel.getView().refreshNode(n);
                    });
                }
            }
        });

        // if (!_.isEmpty(_this.defaultValues)) {
        //     var values = _this.defaultValues.split(",");
        //     console.log(values)
        //     _this.selectNodes(values);
        // }

        return  this.panel;

    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var _this = this;
        var nodes = this.panel.getRootNode().treeStore.data.items;
        var values = [];
        _.each(_.keys(nodes), function (key) {
            if (this[key].get('checked') && this[key].isLeaf()) {
                values.push(this[key].get('display'));
            }
        }, nodes);
        obj = {};
        var title = this.title.toLowerCase();

        if (values.length > 0) {
            obj[title] = values;
            return obj;
        } else {
            return {};
        }
    },
    clear: function () {
//        this.panel.reset();
    },
    selectNodes: function (values) {

    }
}
