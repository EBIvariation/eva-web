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

function HeaderWidget(args) {

    _.extend(this, Backbone.Events);

    var _this = this;
    this.id = Utils.genId("HeaderWidget");


    this.targetId;
    this.height = 67;
    this.accountData;

    this.appname = "My new App";
    this.description = '';
    this.suiteId = -1;
    this.news = '';
    this.checkTimeInterval = 4000;
    this.version = '';
    this.allowLogin = true;
    this.width;
    this.height;
    this.chunkedUpload = false;
    this.enableTextModeUW = true; // Enable Text Mode in the Upload Widget

    //set instantiation args, must be last
    _.extend(this, args);


    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

HeaderWidget.prototype = {
    render: function (targetId) {
        var _this = this;
        this.targetId = (targetId) ? targetId : this.targetId;
        if ($('#' + this.targetId).length < 1) {
            console.log('targetId not found in DOM');
            return;
        }


        /****************************************/
        this.logoutSuccess = function (data) {
            console.log(data);
            //Se borran todas las cookies por si acaso
            $.cookie('bioinfo_sid', null);
            $.cookie('bioinfo_sid', null, {path: '/'});
            $.cookie('bioinfo_account', null);
            $.cookie('bioinfo_account', null, {path: '/'});
            _this.sessionFinished();
            _this.trigger('logout', {sender: this});
        };

        this.getAccountInfoSuccess = function (response) {
            if (response.accountId != null) {
                _this.setAccountData(response);
                _this.trigger('account:change', {sender: this, response: response});
                console.log("accountData has been modified since last call");
            }
        };
        /****************************************/




        this.rendered = true;
    },
    draw: function () {
        var _this = this;
        if (!this.rendered) {
            console.info('Header Widget is not rendered yet');
            return;
        }

        /* Login Widget */
        this.loginWidget = this._createLoginWidget();

        /* Profile Widget */
        this.profileWidget = this._createProfileWidget();

        /* Opencga Browser Widget */
        this.opencgaBrowserWidget = this._createOpencgaBrowserWidget();

        /* Panel */
        this.panel = this._createPanel(this.targetId);

        if ($.cookie('bioinfo_sid') != null) {
            this.sessionInitiated();
        } else {
            this.sessionFinished();
        }


    },
    _createLoginWidget: function () {
        var _this = this;
        var loginWidget = new LoginWidget({
            suiteId: this.suiteId,
            autoRender: true,
            handlers: {
                'session:initiated': function () {
                    _this.sessionInitiated();
                    _this.trigger('login', {sender: this});
                }
            }
        });
        loginWidget.draw();
        return loginWidget;
    },
    _createProfileWidget: function () {
        var profileWidget = new ProfileWidget({
            autoRender: true
        });
        profileWidget.draw();
        return profileWidget;
    },
    _createOpencgaBrowserWidget: function () {
        var _this = this;
        var opencgaBrowserWidget = new OpencgaBrowserWidget({
            suiteId: this.suiteId,
            chunkedUpload: this.chunkedUpload,
            enableTextModeUW: this.enableTextModeUW,
            autoRender: true,
            handlers: {
                'need:refresh': function () {
                    _this.getAccountInfo();
                }
            }
        });
        opencgaBrowserWidget.draw();
        return opencgaBrowserWidget;
    },

    _createPanel: function (targetId) {
        var _this = this;
        switch (this.suiteId) {
            case 11://Renato
                this.homeLink = "http://renato.bioinfo.cipf.es";
                this.helpLink = "http://bioinfo.cipf.es/docs/renato/";
                this.tutorialLink = "http://bioinfo.cipf.es/docs/renato/tutorial";
                this.aboutText = '';
                break;
            case 6://Variant
                this.homeLink = "http://variant.bioinfo.cipf.es";
                this.helpLink = "http://docs.bioinfo.cipf.es/projects/variant";
                this.tutorialLink = "http://docs.bioinfo.cipf.es/projects/variant/wiki/Tutorial";
                this.aboutText = '';
                break;
            case 9://GenomeMaps
                this.homeLink = "http://www.genomemaps.org";
                this.helpLink = "http://wiki.opencb.org/projects/visualization/doku.php?id=genome-maps:overview";
                this.tutorialLink = "http://wiki.opencb.org/projects/visualization/doku.php?id=genome-maps:tutorial";
                this.aboutText = 'Genome Maps is built with open and free technologies like HTML5 and SVG inline, ' +
                    'so no plug-in is needed in modern internet browsers. We’ve focused on providing the ' +
                    'best user experience possible with a modern drag navigation and many features included.<br><br>' +
                    'Genome Maps project has been developed in the <b>Computational Biology Unit</b> led by <b>Ignacio Medina</b>, at <b>Computational Genomic' +
                    ' Institute</b> led by <b>Joaquin Dopazo</b> at CIPF. Two people from my lab deserve special mention for their fantastic job done: ' +
                    '<br><b>Franscisco Salavert</b> and <b>Alejandro de Maria</b>.<br><br>' +
                    'Genome Maps has been designed to be easily be embedded in any project with a couple of lines of code,' +
                    ' and it has been implemented as a plugin framework to extend the standard features.<br><br>' +
                    'Supported browsers include: Google Chrome 14+, Apple Safari 5+, Opera 12+ and Mozilla Firefox 14+ ' +
                    '(works slower than in the other browsers). Internet Explorer 10 is under RC and seems to work properly.<br><br>' +
                    'For more information or suggestions about Genome Maps please contact <br><b>Ignacio Medina</b>:  <span class="info">imedina@cipf.es</span>'
                break;
            case 10://CellBrowser
                this.homeLink = "http://www.cellbrowser.org";
                this.helpLink = "http://docs.bioinfo.cipf.es/projects/cellbrowser";
                this.tutorialLink = "http://docs.bioinfo.cipf.es/projects/cellbrowser/wiki/Tutorial";
                this.aboutText = '';
                break;
            case 12://UNTBgen
                this.homeLink = "http://bioinfo.cipf.es/apps/untbgen";
                this.helpLink = "http://bioinfo.cipf.es/ecolopy/";
                this.tutorialLink = "http://bioinfo.cipf.es/ecolopy/";
                this.aboutText = '';
                break;
            case 22://Pathiways
                this.homeLink = "http://pathiways.bioinfo.cipf.es";
                this.helpLink = "http://bioinfo.cipf.es/pathiways";
                this.tutorialLink = "http://bioinfo.cipf.es/pathiways/tutorial";
                this.aboutText = 'PATHiWAYS is built with open and free technologies like HTML5 and SVG inline, ' +
                    'so no plug-in is needed in modern internet browsers<br><br>' +
                    'PATHiWAYS project has been developed in the <b>Computational Biology Unit</b>, at <b>Computational Medicine' +
                    ' Institute</b> at CIPF in Valencia, Spain.<br><br>' +
                    'For more information please visit our web page  <span class="info"><a target="_blank" href="http://bioinfo.cipf.es">bioinfo.cipf.es</a></span>';
                break;
            case 85: //BierApp
                this.homeLink = "http://bioinfo.cipf.es/apps/bierapp/";
                this.helpLink = "https://github.com/babelomics/bierapp/wiki";
                this.tutorialLink = "https://github.com/babelomics/bierapp/wiki/Tutorial";
                this.aboutText = 'BiERApp is an interactive tool that allows finding genes affected by deleterious variants that segregate along family pedigrees, case-controls or sporadic samples. BiERApp has built with open and free technologies like HTML5 and Javascript.<br><br>' +
                    'BierApp project is a joint development of the <b>BiER</b> and the <b>Computational Biology Unit</b>, in the <b>Computational Genomics Department</b> at CIPF in Valencia, Spain.<br><br>' + 'For more information please visit our web page  <span class="info"><a target="_blank" href="http://bioinfo.cipf.es">bioinfo.cipf.es</a></span> <br><br>' +
                    '<img width="25%" src="http://bioinfo.cipf.es/bierwiki/lib/tpl/arctic/images/logobier.jpg">'
                ;
                break;

            case 86: // TEAM
                this.homeLink = "http://bioinfo.cipf.es/apps/team/";
                this.helpLink = "https://github.com/babelomics/team/wiki";
                this.tutorialLink = "https://github.com/babelomics/team/wiki/Tutorial";
                this.aboutText = 'TEAM (Targeted Enrichment Analysis and Management) is an open web-based tool for the design and management of panels of genes for targeted enrichment and massive sequencing for diagnostic applications. <br> TEAM has been built with open and free technologies like HTML5 and Javascript.<br><br>' +
                    'TEAM project is a joint development of the <b>BiER</b> and the <b>Computational Biology Unit</b>, in the <b>Computational Genomics Department</b> at CIPF in Valencia, Spain.<br><br>' + 'For more information please visit our web page  <span class="info"><a target="_blank" href="http://bioinfo.cipf.es">bioinfo.cipf.es</a></span> <br><br>' +
                    '<img width="25%" src="http://bioinfo.cipf.es/bierwiki/lib/tpl/arctic/images/logobier.jpg">'
                ;
                break;

            default:
                this.homeLink = "http://docs.bioinfo.cipf.es";
                this.helpLink = "http://docs.bioinfo.cipf.es";
                this.tutorialLink = "http://docs.bioinfo.cipf.es";
                this.aboutText = '';
        }

        if (typeof HEADER_HOME_LINK !== 'undefined') {
            this.homeLink = HEADER_HOME_LINK;
        }
        if (typeof HEADER_HELP_LINK !== 'undefined') {
            this.helpLink = HEADER_HELP_LINK;
        }
        if (typeof HEADER_TUTORIAL_LINK !== 'undefined') {
            this.tutorialLink = HEADER_TUTORIAL_LINK;
        }
        if (typeof HEADER_ABOUT_HTML !== 'undefined') {
            this.aboutText = HEADER_ABOUT_HTML;
        }

        var linkbar = new Ext.create('Ext.toolbar.Toolbar', {
            id: this.id + 'linkbar',
            dock: 'top',
            cls: 'bio-linkbar',
            height: 40,
            minHeight: 40,
            maxHeight: 40,
            items: [
                {
                    xtype: 'tbtext',
                    id: this.id + "speciesTextItem",
                    text: ''
                },
                {
                    xtype: 'tbtext',
                    id: this.id + "assemblyTextItem",
                    text: ''
                },
                '->',
                {
                    id: this.id + "homeButton",
                    text: 'home',
                    handler: function () {
                        window.location.href = _this.homeLink;
                    }
                },
                {
                    id: this.id + "helpButton",
                    text: 'documentation',
                    handler: function () {
                        window.open(_this.helpLink);
                    }
                },
                {
                    id: this.id + "tutorialButton",
                    text: 'tutorial',
                    handler: function () {
                        window.open(_this.tutorialLink);
                    }
                },
                {
                    id: this.id + "aboutButton",
                    text: 'about',
                    handler: function () {
                        Ext.create('Ext.window.Window', {
                            id: _this.id + "aboutWindow",
                            bodyStyle: 'background:#fff; color:#333;',
                            bodyPadding: 10,
                            title: 'About',
                            height: 340,
                            width: 500,
                            modal: true,
                            layout: 'fit',
                            html: _this.aboutText
                        }).show();
                    }
                }
            ]
        });

        var userbar = new Ext.create('Ext.toolbar.Toolbar', {
            id: this.id + 'userbar',
            dock: 'top',
            border: false,
//                cls:'bio-userbar',
            cls: 'gm-login-bar',
            height: 27,
            minHeight: 27,
            maxHeight: 27,
            layout: 'hbox',
            items: [
                {
                    xtype: 'tbtext',
                    id: this.id + 'textNews',
                    text: this.news
                },
                '->',
                {
                    xtype: 'tbtext',
                    id: this.id + 'textUser',
                    text: ''
                },
                {
                    id: this.id + 'btnOpencga',
                    text: '<span class="emph">Upload & Manage</span>',
                    iconCls: 'icon-project-manager',
                    handler: function () {
                        _this.opencgaBrowserWidget.show({mode: "manager"});
                    }
                },
                {
                    id: this.id + 'btnSignin',
                    disabled: !this.allowLogin,
                    text: '<span class="emph">sign in</span>',
                    handler: function () {
                        _this.loginWidget.show();
                    }
                },
                {
                    id: this.id + 'btnEdit',
                    text: '<span class="emph">profile</span>',
                    handler: function () {
                        _this.profileWidget.show();
                    }
                },
                {
                    id: this.id + 'btnLogout',
                    text: '<span class="emph">logout</span>',
                    handler: function () {
                        OpencgaManager.logout({
                            accountId: $.cookie('bioinfo_account'),
                            sessionId: $.cookie('bioinfo_sid'),
                            success: _this.logoutSuccess,
                            error: _this.logoutSuccess
                        });
                    }
                }
            ]
        });

        var panel = Ext.create('Ext.panel.Panel', {
            id: this.id + "panel",
            region: 'north',
            border: false,
            renderTo: targetId,
            height: this.height,
            minHeight: this.height,
            maxHeigth: this.height,
            width: this.width,
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
//                    flex:1,
                    items: [
                        {
                            id: this.id + "appTextItem",
                            xtype: 'tbtext',
                            margin: '25 0 0 20',
                            //		        	html: '<span class="appName">Vitis vinifera&nbsp; '+this.args.appname +'</span> <span class="appDesc">'+this.args.description+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><img height="30" src="http://www.demeter.es/imagenes/l_demeter.gif"></span>',
                            text: '<span class="appName">' + this.appname + '</span> ' +
                                '<span id="' + this.id + 'description" class="appDesc">' + this.description + '</span>' +
                                '<span id="' + this.id + 'version" class="appVersion"></span>' +
                                '',
                            padding: '0 0 0 10',
                            listeners: {
                                afterrender: function () {
                                    $("#" + _this.id + "appTextItem").qtip({
                                        content: '<span class="info">' + _this.version + '</span>',
                                        position: {my: "bottom center", at: "top center", adjust: { y: 12, x: -25 }}

                                    });
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 2,
                    layout: {type: 'vbox', align: 'right'},
                    items: [userbar, linkbar]
                }
            ]
        });
        return panel;
    },

    setAccountData: function (data) {
        this.accountData = data;
        this.opencgaBrowserWidget.setAccountData(data);
        Ext.getCmp(this.id + 'textUser').setText(this._getAccountText());
    },
    getAccountInfo: function () {
        var lastActivity = null;
        if (this.accountData != null) {
            lastActivity = this.accountData.lastActivity;
        }
        if (!$.cookie('bioinfo_account')) {
            console.log('cookie: bioinfo_account, is not set, session will be finished...');
            this.sessionFinished();
        } else {

            OpencgaManager.getAccountInfo({
                accountId: $.cookie('bioinfo_account'),
                sessionId: $.cookie('bioinfo_sid'),
                lastActivity: lastActivity,
                success: this.getAccountInfoSuccess,
                error: this.logoutSuccess
            });
        }

    },
    _getAccountText: function () {
        var nameToShow = this.accountData.accountId;
        if (nameToShow.indexOf('anonymous_') != -1) {
            nameToShow = 'anonymous';
        }
        return 'logged in as <span style="color:darkred">' + nameToShow + '</span>'
    },
    sessionInitiated: function () {
        var _this = this;
        /**HIDE**/
        this.loginWidget.hide();
        Ext.getCmp(this.id + 'btnSignin').hide();
        /**SHOW**/
        Ext.getCmp(this.id + 'btnLogout').show();
        Ext.getCmp(this.id + 'btnEdit').show();
        Ext.getCmp(this.id + 'btnOpencga').show();

        /**START OPENCGA CHECK**/
        if (!this.accountInfoInterval) {
            this.getAccountInfo();//first call
            this.accountInfoInterval = setInterval(function () {
                _this.getAccountInfo();
            }, this.checkTimeInterval);
        }
    },
    sessionFinished: function () {
        /**HIDE**/
        Ext.getCmp(this.id + 'btnOpencga').hide();
        Ext.getCmp(this.id + 'btnLogout').hide();
        Ext.getCmp(this.id + 'btnEdit').hide();
        /**SHOW**/
        Ext.getCmp(this.id + 'btnSignin').show();

        Ext.getCmp(this.id + 'textUser').setText('');
        /**CLEAR OPENCGA**/
        clearInterval(this.accountInfoInterval);
        delete this.accountInfoInterval;

        this.profileWidget.hide();
        this.opencgaBrowserWidget.hide();
        this.opencgaBrowserWidget.removeAccountData();
    },
    setDescription: function (text) {
        $("#" + this.id + 'description').html(text);
    },
    setWidth: function (width) {
        this.width = width;
        this.panel.setWidth(width);
    }

};


