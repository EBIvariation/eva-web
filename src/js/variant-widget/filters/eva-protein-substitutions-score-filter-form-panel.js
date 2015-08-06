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
function EvaProteinSubstitutionScoreFilterFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("ProteinSubstitutionScoreFilterFormPanel");
    this.target;
    this.autoRender = true;
    this.title = "Protein Substitution Score";
    this.border = false;
    this.collapsible = true;
    this.titleCollapse = false;
    this.headerConfig;
    this.testRegion = "";
    this.collapsed = false;
    this.emptyText = '1:1-1000000,2:1-1000000';

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaProteinSubstitutionScoreFilterFormPanel.prototype = {
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


        var items = {
            xtype:'fieldset',
            title: '',
            collapsible: false,
//            height:150,
            width :280,
            margin:'5 0 0 0',
            defaultType: 'textfield',
            items :[
                {
                    fieldLabel: 'PolyPhen2 \>',
                    name: 'polyphen',
                    width  : 240,
                    margin:'5 0 0 0',
                    emptyText:'ex: 0.5'
                },
                {
                    fieldLabel: 'Sift \< ',
                    name: 'sift',
                    width  : 240,
                    margin:'5 0 5 0',
                    emptyText:'ex: 0.1'
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
            allowBlank: false,
            collapsed: this.collapsed,
            items: [items]
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
                if(key == 'sift'){
                   value = '<'+ values[key];
                }else{
                    value = '>'+ values[key];
                }
                valuesArray[key] = value;
            }
        }
        return valuesArray;
    },
    clear: function () {
        this.panel.reset();
    }
}
