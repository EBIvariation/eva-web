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
        this.panel.show()
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

         var svStudyBrowser = new SvStudyBrowser({
            pageSize:20
        });
        var sgvStudyBrowser = new SgvStudyBrowser({
            pageSize:10
        });

        this.toolTabPanel = Ext.create("Ext.tab.Panel", {
                activeTab: 0,
                plain: true,
                items: [
                    {
                        title: sgvStudyBrowser.getPanel().title.replace('Browser','(<50bp)'),
                        cls:'studybrowser ',
                        items:[sgvStudyBrowser.getPanel()]
                    },
                    {
                        title:svStudyBrowser.getPanel().title.replace('Browser','(>50bp)'),
                        cls:'studybrowser',
                        items:[svStudyBrowser.getPanel()]

                    }
                ],
                listeners: {
                    render: function() {
                        this.items.each(function(i){
                            i.tab.on('click', function(){
                                if(i.title == 'Structural Variants (>50bp)'){
                                    svStudyBrowser.load();
                                }
                            });
                        });
                    }
                }
            });

        this.toolTabPanel.setActiveTab(0);

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


        return  this.panel;
    }


};

