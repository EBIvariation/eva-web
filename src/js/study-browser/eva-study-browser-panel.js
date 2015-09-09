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
function EvaStudyBrowserPanel(args) {
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
};


EvaStudyBrowserPanel.prototype = {
    render: function () {
        var _this = this;
        if(!this.rendered) {
            this.div = document.createElement('div');
            this.div.setAttribute('id', this.id);
            this.panel = this._createPanel();
            this.rendered = true;
        }

    },
    draw: function () {
        if(!this.rendered) {
            this.render();
        }
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAStudyBrowserPanel target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);
    },
    show: function () {
        var _this = this;
        this.panel.show();
        var tabName = _this.toolTabPanel.getActiveTab().items.items[0].name;
        _this._tabChange(tabName);

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
    _createPanel: function () {
        var _this = this;

         this.svStudyBrowser = new SvStudyBrowser({
            pageSize:20,
            species:_this.species,
            type:_this.type,
            browserType:_this.browserType
        });
        this.sgvStudyBrowser = new SgvStudyBrowser({
            pageSize:10,
            species:_this.species,
            type:_this.type,
            browserType:_this.browserType
        });

        this.toolTabPanel = Ext.create("Ext.tab.Panel", {
                activeTab: 0,
                plain: true,
                items: [
                    {
                        title: this.sgvStudyBrowser.getPanel().title.replace('Browser','(<50bp)'),
                        cls:'studybrowser ',
                        items:[this.sgvStudyBrowser.getPanel()]
                    },
                    {
                        title:this.svStudyBrowser.getPanel().title.replace('Browser','(>50bp)'),
                        cls:'studybrowser',
                        items:[this.svStudyBrowser.getPanel()]

                    }
                ],
                listeners: {
                    render: function() {
                        this.items.each(function(i){
                            i.tab.on('click', function(){
                                if(i.title == 'Structural Variants (>50bp)'){
                                    _this.svStudyBrowser.load();
                                }
                            });
                        });
                    },
                    'tabchange': function (tabPanel, tab) {
                        var tabName = tab.items.items[0].name;
                        _this._tabChange(tabName)

                    }
                }
            });




        this.panel = Ext.create('Ext.container.Container', {
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: 5
            },
            cls:'study-browser-panel',
            items: [this.toolTabPanel]
        });




        Ext.EventManager.onWindowResize(function () {
            _this.panel.doLayout()
        });

        if(_this.browserType){
            this.toolTabPanel.setActiveTab(1);
        }else{
            this.toolTabPanel.setActiveTab(0);
        }


        return  this.panel;
    },
    _tabChange: function(tabName){
        var _this = this;
        if(tabName == 'sv'){
            _this.svStudyBrowser._updateURL();
        }else if(tabName == 'sgv'){
            _this.sgvStudyBrowser.browserType = false;
            _this.sgvStudyBrowser._updateURL();
        }
    }


};

