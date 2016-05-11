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
function StudyBrowserTypeFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("SpeciesFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Variant Type";
    this.border = false;
    this.collapsible = true;
    this.titleCollapse = false;
    this.headerConfig;
    this.defaultValue = 'sgv';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

StudyBrowserTypeFilterFormPanel.prototype = {
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

        Ext.define('BrowserTypeModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'name', type: 'string'},
                {name: 'value', type: 'string'}
            ]
        });

        var browserTypeValues = [
            {name: 'Structural Variants (>50bp)', value: 'sv'},
            {name: 'Short Genetic Variants (<50bp)', value: 'sgv'}
        ];

        var browserTypeStore = Ext.create('Ext.data.Store', {
            model: 'BrowserTypeModel',
            data: browserTypeValues,
            sorters: [
                {
                    property: 'taxonomyEvaName',
                    direction: 'ASC'
                }
            ]
        });

        var browserTypeFormFieldRadio = {
            xtype: 'radiogroup',
            name: 'browserTypeRadio',
            defaultType: 'radiofield',
            width: '100%',
            defaults: {
                flex: 1
            },
            cls: 'eva-radio',
            layout: 'vbox',
            items: [
                {
                    boxLabel: 'Structural Variants (>50bp)',
                    name: 'browserType',
                    inputValue: 'sv',
                    id: 'sv'
                },
                {
                    boxLabel: 'Short Genetic Variants (<50bp)',
                    name: 'browserType',
                    inputValue: 'sgv',
                    id: 'sgv'
                }
            ],
            listeners: {
                afterrender: function (field) {
                    field.setValue({browserType: _this.defaultValue});
                },
                change: function (field, newValue, oldValue) {
                    _this.trigger('browserType:change', {browserType: newValue, sender: _this});
                }

            }
        };

        var browserTypeFormField = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Variant Type',
            name: 'browserType',
            labelAlign: 'top',
            store: browserTypeStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value',
            width: '100%',
            listeners: {
                afterrender: function (field) {
                    field.setValue(_this.defaultValue);
                },
                change: function (field, newValue, oldValue) {
                    _this.trigger('browserType:change', {browserType: newValue, sender: _this});
                }

            }
        });

        return Ext.create('Ext.form.Panel', {
            bodyPadding: "5",
            margin: "0 0 5 0",
            buttonAlign: 'center',
            layout: 'vbox',
            title: this.title,
            border: this.border,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            header: this.headerConfig,
            allowBlank: false,
            items: [browserTypeFormFieldRadio]
        });

    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var values = this.panel.getValues();
        for (key in values) {
            if (values[key] == '') {
                delete values[key]
            }
        }
        return values;
    },
    clear: function () {
        this.panel.reset();
    }
}
