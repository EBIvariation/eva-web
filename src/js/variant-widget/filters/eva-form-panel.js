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
function EvaFormPanel(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("FormPanel");
    this.target;
    this.autoRender = true;
    this.height;
    this.width;
    this.title;
    this.collapsible = false;
    this.titleCollapse = false;
    this.submitButtonId = 'submit-btn';
    this.submitButtonText = 'Search';
    this.clearButtonText = 'Reset';
    this.barItems = [];
    this.border = true;
    this.filters = [];
    this.mode = 'accordion';
    this.toolbarPosition = 'top';
    this.headerConfig;
    this.type;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaFormPanel.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing " + this.id);

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        var filters = [];

        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            filters.push(filter.getPanel());
        }

        this.panel = this._createPanel();
        this.filtersPanel.add(filters);
        if (this.mode == 'tabs') {
            this.filtersPanel.setActiveTab(0);
        }

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
    clear: function () {
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            filter.clear();
        }
    },
    getValues: function () {
        var values = {};
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            _.extend(values, filter.getValues());
        }
        return values;
    },
    update: function () {
        if (this.panel) {
            this.panel.update();
        }
    },
    _createPanel: function () {
        var _this = this;

        var barItems = [
            {
                xtype: 'button',
                text: this.clearButtonText,
                tooltip: this.clearButtonText,
                handler: function () {
                    _this.lastSelectedValues = _this.getValues();
                    _this.clear();
                    Utils.msg(_this.clearButtonText, 'Successful');
                    _this.trigger('submit', {values: _this.getValues(), sender: _this});
                    _this.trigger('form:clear', {values: _this.getValues(), sender: _this});
                }
            },
            {
                xtype: 'button',
                id: this.submitButtonId,
                text: this.submitButtonText,
                tooltip: this.submitButtonText,
                formBind: true,
                flex: 1,
                handler: function () {
                    _this.trigger('submit', {values: _this.getValues(), sender: _this});
                }
            }
        ];
        barItems = barItems.concat(this.barItems);

        switch (this.mode) {
            case 'tabs':
                this.filtersPanel = Ext.create('Ext.tab.Panel', {
                    border: false,
                    plain: true
                });
                break;
            case 'accordion':
                this.filtersPanel = Ext.create('Ext.container.Container', {
                    layout: {
                        type: 'accordion',
                        titleCollapse: true,
                        multi: true
                    }
                });
                break;
            case 'vbox':
                this.filtersPanel = Ext.create('Ext.container.Container', {
                    margin: '5 0 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '5 0 0 0'
                    }
                });
                break;
        }

        var form = Ext.create('Ext.form.Panel', {
            border: this.border,
            height: this.height,
            width: this.width,
            title: this.title,
            header: this.headerConfig,
            collapsible: this.collapsible,
            titleCollapse: this.titleCollapse,
            margin: '0 20 0 0',
            autoScroll: true,
            items: [
                {
                    xtype: 'container',
                    width: '100%',
                    bodyPadding: 5,
                    defaults: {
                        margin: '10'
                    },
                    layout: {
                        type: 'hbox'
                    },
                    items: barItems
                },
                this.filtersPanel
            ]
        });
        return form;

    },
    validatePositionFilter : function(values) {
        var validate = true;
        _.each(values, function (region) {
            if(region.match(/^[\w\d\D]+\:\d+\-\d+/)){
                var start = region.split(':')[1].split('-')[0];
                var end = region.split(':')[1].split('-')[1]
                if (end - start > 1000000) {
                    Ext.Msg.alert('Limit Exceeds', 'Please enter a region no larger than 1 million bases');
                    validate = false;
                } else if (end - start < 0) {
                    Ext.Msg.alert('Incorrect Range', 'Please enter the correct range.The start of the region should be smaller than the end');
                    validate = false;
                } else if (isNaN(start) || isNaN(end)) {
                    Ext.Msg.alert('Incorrect Value', 'Please enter a numeric value');
                    validate = false;
                }
            }else{
                Ext.Msg.alert('Invalid Region', 'Please enter a valid region');
                validate = false;
            }

        });

        return validate;
    }

}
