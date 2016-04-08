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
    this.title = "Minor Allele Frequency";
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
        var _this = this;
        var genomesitems = {
            xtype: 'fieldset',
            title: '1000Genomes',
            collapsible: false,
            height: 240,
            width: 280,
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'All MAF \< ',
                    name: 'ALL',
                    width: 240,
                    labelWidth: 120
                },
                {
                    fieldLabel: 'African MAF \< ',
                    name: 'AFR',
                    width: 240,
                    labelWidth: 120
                },
                {
                    fieldLabel: 'American MAF \< ',
                    name: 'AMR',
                    width: 240,
                    labelWidth: 120
                },
                {
                    fieldLabel: 'Asian MAF \< ',
                    name: 'ASN',
                    width: 240,
                    labelWidth: 120
                },
                {
                    fieldLabel: 'European MAF \<',
                    name: 'EUR',
                    width: 240,
                    labelWidth: 120
                }
            ]
        }
        var ESP6500 = {
            xtype: 'fieldset',
            title: 'ESP6500',
            collapsible: false,
            height: 180,
            width: 280,
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'African-American MAF \<',
                    name: 'AA_AF',
                    width: 240,
                    labelWidth: 120
                },
                {
                    fieldLabel: ' European-American MAF \< ',
                    name: 'EA_AF',
                    width: 240,
                    labelWidth: 120
                }
            ]
        }

        var defaultOP;
        var defaultMAF;
        if(_this.maf){
           var regex = /[+-]?\d+(\.\d+)?/g;
           var  float = _this.maf.match(regex).map(function(v) { return parseFloat(v); });
           var defaultValue =  _this.maf.split(float);
           defaultOP =  defaultValue[0];
           defaultMAF = float;
        }

        var MAF = {
            margin: '0 0 -5 10',
            xtype: 'textfield',
            name: 'maf',
            value: defaultMAF,
            emptyText: 'ex: 0.3',
            width: '50%',
        }

        var mafOpValues = Ext.create('Ext.data.Store', {
            fields: ['value'],
            data : [
                {"value":"="},
                {"value":"<"},
                {"value":">"},
                {"value":"<="},
                {"value":">="}
            ]
        });

       var mafOp =  Ext.create('Ext.form.ComboBox', {
            id: "mafOpFilter",
            name: 'mafOp',
            fieldLabel: '<img class="text-header-icon" data-qtip="Filter against any Minor Allele Frequency value in the Population Statistics tab" style="margin-bottom:0px;" src="img/icon-info.png"/>&nbsp;<span class="title-header-icon" data-qtip="Minor Allele Frequency" style="margin-bottom:0px;">MAF</span>',
            store: mafOpValues,
            queryMode: 'local',
            displayField: 'value',
            valueField: 'value',
            width: '50%',
            labelPad:-50,
            emptyText: 'ex: >=',
            listeners: {
               afterrender: function (field) {
                   field.setValue(defaultOP);
               }
            },
        });

        return Ext.create('Ext.form.Panel', {

            id: this.id,
            bodyPadding: "5",
            margin: "0 0 5 0",
            buttonAlign: 'center',
            layout: 'hbox',
            title: this.title,
            border: this.border,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            header: this.headerConfig,
            collapsed: this.collapsed,
            allowBlank: false,
            items: [mafOp,MAF]
        });

    },
    getPanel: function () {
        return this.panel;
    },
    getValues: function () {
        var values = this.panel.getValues();
        var tempArray = [];
        var mafValues = {};
        for (key in values) {
            if (values[key] == '') {
                delete values[key]
            } else {
                tempArray.push(values[key])
            }
        }

        if(!_.isEmpty(tempArray) && !_.isUndefined(values.maf) && !_.isUndefined(values.mafOp) ){
            mafValues = {maf:tempArray.join('')} ;
        }

        return mafValues;
    },
    clear: function () {
        this.panel.reset();
    }
}
