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
function EvaPopulationFrequencyFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("PopulationFrequencyFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Population Frequency";
    this.border = false;
    this.collapsible = true;
    this.titleCollapse = false;
    this.collapsed = false;
    this.headerConfig;
    this.testRegion = "";
    this.emptyText = '1:1-1000000,2:1-1000000';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaPopulationFrequencyFilterFormPanel.prototype = {
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

        var genomesitems = {
            xtype:'fieldset',
            title: '1000Genomes',
            collapsible: false,
            height:240,
            width :280,
            defaultType: 'textfield',
            items :[
                {
                    fieldLabel: 'All MAF \< ',
                    name: 'ALL',
                    width  : 240,
                    labelWidth:120
                },
                {
                    fieldLabel: 'African MAF \< ',
                    name: 'AFR',
                    width  : 240,
                    labelWidth:120
                },
                {
                    fieldLabel: 'American MAF \< ',
                    name: 'AMR',
                    width  : 240,
                    labelWidth:120
                },
                {
                    fieldLabel: 'Asian MAF \< ',
                    name: 'ASN',
                    width  : 240,
                    labelWidth:120
                },
                {
                    fieldLabel: 'European MAF \<',
                    name: 'EUR',
                    width  : 240,
                    labelWidth:120
                }
            ]
        }
        var ESP6500 = {
            xtype:'fieldset',
            title: 'ESP6500',
            collapsible: false,
            height:180,
            width :280,
            defaultType: 'textfield',
            items :[
                {
                    fieldLabel: 'African-American MAF \<',
                    name: 'AA_AF',
                    width  : 240,
                    labelWidth:120
                },
                {
                    fieldLabel: ' European-American MAF \< ',
                    name: 'EA_AF',
                    width  : 240,
                    labelWidth:120
                }

            ]
        }

        return Ext.create('Ext.form.Panel', {
            id:this.id,
            bodyPadding: "5",
            margin: "0 0 5 0",
            buttonAlign: 'center',
            layout: 'vbox',
            title: this.title,
            border: this.border,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            header: this.headerConfig,
            collapsed: this.collapsed,
            allowBlank: false,
            items: [genomesitems,ESP6500]
        });

    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var values = this.panel.getValues();
        var valuesArray = {};
        for (key in values) {
            if (values[key] == '') {
                delete values[key]
            }else{
                valuesArray[key] = values[key];
            }
        }

//        return {pop_freq:valuesArray};
    },
    clear: function () {
        this.panel.reset();
    }
}
