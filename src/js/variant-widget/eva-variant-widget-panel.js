/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 - 2017 EMBL - European Bioinformatics Institute
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

function EvaVariantWidgetPanel(args) {
    var _this = this;
    _.extend(this, Backbone.Events);

    this.id = Utils.genId("VariantWidgetPanel");

    this.target;
    this.tools = [];
    _.extend(this, args);
    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }
};

EvaVariantWidgetPanel.defaultSpecies = 'ecaballus_20';
EvaVariantWidgetPanel.defaultFilter = 'region';
EvaVariantWidgetPanel.defaultRegion = '1:3000000-3100000';
EvaVariantWidgetPanel.defaultGene = 'BRCA2';

EvaVariantWidgetPanel.prototype = {
    render: function () {
        var _this = this;
        if (!this.rendered) {
            this.div = document.createElement('div');
            this.div.setAttribute('id', this.id);
            this.panel = this._createPanel();
            this.rendered = true;
        }

    },
    draw: function () {
        if (!this.rendered) {
            this.render();
        }
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAVariantWidgetPanel target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);

        this.variantWidgetDiv = document.querySelector('.variant-widget');
        this.variantWidget = this._createVariantWidget(this.variantWidgetDiv);
        this.variantWidget.draw();

        this.formPanelVariantFilterDiv = document.querySelector('.form-panel-variant-filter');
        this.formPanelVariantFilter = this._createFormPanelVariantFilter(this.formPanelVariantFilterDiv);
        this.formPanelVariantFilter.draw();
    },
    show: function () {
        var _this = this;
        this.panel.show();
        _this.resize();
        var variantQuery = _this.queryParams;
        if (!_.isUndefined(variantQuery)) {
            _this._updateURL(variantQuery);
        }
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
    resize: function (value) {
        var _this = this;
        if (_this.panel.isVisible()) {
            value = value || 0;
            if (value) {
                _this.panel.updateLayout();
            }
            _this.variantWidget.variantBrowserGrid.panel.updateLayout();
            _this.variantWidget.toolTabPanel.updateLayout();
            _this.formPanelVariantFilter.panel.updateLayout();
        }
    },

    _createPanel: function () {
        var _this = this;
        Ext.EventManager.onWindowResize(function (e) {
            _this.resize(true);
        });

        this.panel = Ext.create('Ext.panel.Panel', {
            header: {
                baseCls: '',
                titlePosition: 1
            },
            title:'<nav aria-label="You are here:" role="navigation"><ul class="breadcrumbs"><li><a href="?Home">EVA</a></li><li><span class="show-for-sr">Current: </span>Variant Browser</li></ul></nav><h2>Variant Browser</h2>' +
            '<div class="eva-panel-header-para"><p>Search the EVA variant warehouse using any combination of the filtering options on the left hand-side.</p>' +
            '<p>Search results can be exported in CSV format and individual variants can be further investigated using the in-depth Variant Data tabs found below the main results table.</p></div>',
            layout: {
                type: 'hbox',
                align: 'fit'
            },
            bodyStyle: 'z-index:0;border-width:0px;border-style:none;',
            items: [
                {
                    xtype: 'panel',
                    header: {
                        baseCls: 'eva-header-1',
                        titlePosition: 1
                    },
                    frame: false,
                    title: '<span style="margin-left:5px;">Filter</span>',
                    flex: 1.3,
                    collapsible: true,
                    collapseMode: 'header',
                    html: '<div class="variant-browser-option-div form-panel-variant-filter"></div>',
                    collapseDirection: 'left',
                    border: false,
                    animCollapse: false,
                    bodyStyle: 'border-width:0px;border-style:none;',
                    listeners: {
                        collapse: function () {
                            _this.resize();
                        },
                        expand: function () {
                            _this.resize();
                        }
                    }
                },
                {
                    xtype: 'panel',
                    header: {
                        baseCls: 'eva-header-1'
                    },
                    title: 'Variants found',
                    flex: 4.8,
                    collapsible: false,
                    collapseMode: 'header',
                    html: '<div class="variant-browser-option-div variant-widget"></div>',
                    border: false,
                    forceFit: true,
                    bodyStyle: 'border-width:0px;border-style:none;',
                }
            ],
            cls: 'variant-widget-panel'
        });

        return  this.panel;
    },
    _createVariantWidget: function (target) {
        var evaVariantWidget = new EvaVariantWidget({
            width: 1000,
            target: target,
            headerConfig: false,
            border: true,
            browserGridConfig: {
                border: true
            },
            toolPanelConfig: {
                title: 'Variant Data',
                headerConfig: {
                    baseCls: 'eva-header-2'
                },
                border: true
            },
            defaultToolConfig: {
                headerConfig: {
                    baseCls: 'eva-header-2'
                }
            },
            responseParser: function (response) {
                var res = [];
                try {
                    res = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
                return  res;
            },
            dataParser: function (data) {
                if(!_.isUndefined(data)){
                    for (var i = 0; i < data.length; i++) {
                        var variant = data[i];
                        if (variant.hgvs && variant.hgvs.genomic > 0) {
                            variant.hgvs_name = variant.hgvs.genomic[0];
                        }
                    }
                }
            }
        });

        return evaVariantWidget;
    },
    _createFormPanelVariantFilter: function (target) {
        var _this = this;
        var speciesList = getEVASpeciesList();
        _this.variantWidget['speciesList'] = speciesList;
        var positionFilter = new EvaPositionFilterFormPanel({
            emptyText: '',
            defaultFilterValue: _this.filter,
            defaultRegion: _this.region,
            defaultGeneValue: _this.gene,
            defaultSnpValue: _this.snp
        });

        var speciesFilter = new SpeciesFilterFormPanel({
            defaultValue: _this.species,
            speciesList : speciesList
        });

        this.studiesStore = Ext.create('Ext.data.Store', {
            pageSize: 50,
            proxy: {
                type: 'memory'
            },
            fields: [
                {name: 'studyName', type: 'string'},
                {name: 'studyId', type: 'string'}
            ],
            autoLoad: false,
            sorters: [
                {
                    property: 'studyName',
                    direction: 'ASC'
                }
            ]
        });

        var studyFilter = new EvaStudyFilterFormPanel({
            border: false,
            collapsed: false,
            height: 'auto',
            studiesStore: this.studiesStore,
            studyFilterTpl: '<tpl if="studyId"><div class="ocb-study-filter"><tpl if="link"><a href="?eva-study={studyId}" target="_blank">{studyName}</a> (<a href="?eva-study={studyId}" target="_blank">{studyId}</a>)<tpl else>{studyName} ({studyId}) </tpl></div><tpl else><div class="ocb-study-filter"><a href="?eva-study={studyId}" target="_blank">{studyName}</a></div></tpl>'
        });

        speciesFilter.on('species:change', function (e) {
            _this._loadAnnotationVersion(annotationFilter, e.species);
            _this._loadListStudies(studyFilter, e.species);
            //setting default positional value
            var defaultRegion;
            switch (e.species) {
                case 'aaegypti_aaegl3':
                    defaultRegion = 'supercont1.18:100000-500000';
                    break;
                case 'agambiae_agamp4':
                    defaultRegion = 'X:10000000-11000000';
                    break;
                case 'aminimus_1v1':
                    defaultRegion = 'KB663610:1-500000';
                    break;
                case 'aquadriannulatus_quad4av1':
                    defaultRegion = 'KB665398:1-15000';
                    break;
                case 'asinensis_v1':
                    defaultRegion = 'AXCK02015324:1-15000';
                    break;
                case 'astephensi_sda500v1':
                    defaultRegion = 'KB664288:1-15000';
                    break;
                case 'bjuncea_t8466v1':
                    defaultRegion = 'CM007185.1:4000000-4900000';
                    break;
                case 'cporcellus_30':
                    defaultRegion = 'DS562860.1:4330000-4340000';
                    break;
                case 'dmelanogaster_6':
                    defaultRegion = '2L:4000-8000';
                    break;
                case 'drerio_grcz10':
                    defaultRegion = '1:4220000-4270000';
                    break;
                case 'falbicollis_15':
                    defaultRegion = '10:19105400-19105800';
                    break;
                case 'ggallus_galgal4':
                    defaultRegion = '1:2100000-2500000';
                    break;
                case 'hannuus_xrqr10':
                    defaultRegion = '10:84310000-84315000';
                    break;
                case 'hbrasiliensis_asm165405v1':
                    defaultRegion = 'LVXX01000001.1:3000000-3900000';
                    break;
                case 'hsapiens_grch37':
                    defaultRegion = '13:32889611-32973805';
                    break;
                case 'hsapiens_grch38':
                    defaultRegion = '13:32315474-32400266';
                    break;
                case 'lcrocea_10':
                    defaultRegion = 'LG1:3000-30000';
                    break;
                case 'lsalmonis_lsalatlcanadafemalev1':
                    defaultRegion = 'LBBX01036488.1:6000-7000';
                    break;
                case 'mgallopavo_50':
                    defaultRegion = '1:51940000-51960000';
                    break;
                case 'mmulatta_801':
                    defaultRegion = '2:163845000-163846000';
                    break;
                case 'oaries_oarv40':
                    defaultRegion = '19:48650000-48660000';
                    break;
                case 'pyedoensis_pynv1':
                    defaultRegion = 'Pyn_C0000:4000-14000';
                    break;
                case 'sratti_ed321v504':
                    defaultRegion = 'SRAE_chr2:10000-20000';
                    break;
                case 'sscrofa_111':
                    defaultRegion = 'X:9610000-9611000';
                    break;
                case 'slycopersicum_sl250':
                    defaultRegion = '9:59100000-59200000';
                    break;
                case 'tdicoccoides_wewseqv1':
                    defaultRegion = 'CM007921.1:100000-1000000';
                    break;
                case 'vvinifera_12x':
                    defaultRegion = '18:7850000-7895000';
                    break;
                case 'zmays_agpv4':
                    defaultRegion = '6:166875000-166876000';
                    break;
                case 'aaegypti_aaegl2':
                    defaultRegion = 'supercont1.562:1-1000000';
                    break;
                case 'aarabiensis_dong5av1':
                    defaultRegion = 'KB704463.1:1000001-2000000';
                    break;
                case 'acomosus_asm154086v1':
                    defaultRegion = 'CM003826.1:11000001-12000000';
                    break;
                case 'aculicifacies_a371v1':
                    defaultRegion = 'KI422496.1:1-1000000';
                    break;
                case 'acygnoides_goosev10':
                    defaultRegion = 'KZ155908.1:2000001-3000000';
                    break;
                case 'aepiroticus_epiroticus2v1':
                    defaultRegion = 'KB671842.1:1-1000000';
                    break;
                case 'afunestus_fumozv1':
                    defaultRegion = 'KB668814.1:1-1000000';
                    break;
                case 'agambiae_agamp3':
                    defaultRegion = '2L:2000001-3000000';
                    break;
                case 'amelas_cm1001059av2':
                    defaultRegion = 'KI919291.1:1-1000000';
                    break;
                case 'amexicanum_asm291563v1':
                    defaultRegion = 'PGSH01011343.1:1000001-2000000';
                    break;
                case 'aphrygia_10':
                    defaultRegion = 'sc0000087:1-1000000';
                    break;
                case 'aplatyrhynchos_iascaaspbh15':
                    defaultRegion = '17:1-1000000';
                    break;
                case 'aplatyrhynchosplatyrhynchos_cauwild10':
                    defaultRegion = 'Chr7:2000001-3000000';
                    break;
                case 'athaliana_tair10':
                    defaultRegion = '3:13000001-14000000';
                    break;
                case 'banthracis_asm784v1':
                    defaultRegion = 'NC_003997.3:1-1000000';
                    break;
                case 'bbison_umd31':
                    defaultRegion = 'Chr29:12000001-13000000';
                    break;
                case 'bbubalis_umdcaspurwb20':
                    defaultRegion = 'AWWX01438720.1:1-1000000';
                    break;
                case 'bgrunniens_umd311':
                    defaultRegion = 'Chr6:71000001-72000000';
                    break;
                case 'bindicus_umd31':
                    defaultRegion = 'Chr14:1-1000000';
                    break;
                case 'bmutus_bosgruv20':
                    defaultRegion = 'NW_005395160.1:1-1000000';
                    break;
                case 'bnapus_branapusv20':
                    defaultRegion = 'CM002761.2:23000001-24000000';
                    break;
                case 'btaurus_arsucd12':
                    defaultRegion = '6:85000001-86000000';
                    break;
                case 'btaurus_umd31':
                    defaultRegion = '23:28000001-29000000';
                    break;
                case 'btaurus_umd311':
                    defaultRegion = '12:76000001-77000000';
                    break;
                case 'cannuum_zunla1ref10':
                    defaultRegion = 'CM002812.1:144000001-145000000';
                    break;
                case 'ccajan_10':
                    defaultRegion = 'CM003613.1:25000001-26000000';
                    break;
                case 'cfamiliaris_31':
                    defaultRegion = '8:73000001-74000000';
                    break;
                case 'chircus_10':
                    defaultRegion = '19:2000001-3000000';
                    break;
                case 'chircus_ars1':
                    defaultRegion = 'NC_030813.1:86000001-87000000';
                    break;
                case 'cjacchus_32':
                    defaultRegion = '21:3000001-4000000';
                    break;
                case 'cquilicii_ccap21':
                    defaultRegion = 'NW_019376285.1:1000001-2000000';
                    break;
                case 'csabaeus_chlsab11':
                    defaultRegion = 'CAE17:39000001-40000000';
                    break;
                case 'csativa_asm186575v1':
                    defaultRegion = 'Cannabis.v1_scf1_q:1-1000000';
                    break;
                case 'csativus_v3':
                    defaultRegion = 'chr3:16000001-17000000';
                    break;
                case 'ddiscoideum_dicty27':
                    defaultRegion = 'CM000154.2:3000001-4000000';
                    break;
                case 'dlabrax_seabassv10':
                    defaultRegion = 'HG916839.1:21000001-22000000';
                    break;
                case 'dpipra_asm171598v1':
                    defaultRegion = 'MCBO01000495.1:3000001-4000000';
                    break;
                case 'drerio_grcz11':
                    defaultRegion = '13:8000001-9000000';
                    break;
                case 'ecaballus_30':
                    defaultRegion = 'chr20:33000001-34000000';
                    break;
                case 'eoleiferaxeguinessnsis_EG5':
                    defaultRegion = 'Chr9:31000001-32000000';
                    break;
                case 'fcatus_80':
                    defaultRegion = 'B1:173000001-174000000';
                    break;
                case 'fcatus_90':
                    defaultRegion = 'NC_018732.3:101000001-102000000';
                    break;
                case 'foxysporum_ii5v1':
                    defaultRegion = 'JH658330.1:1-1000000';
                    break;
                case 'ggallus_galgal5':
                    defaultRegion = 'chr6:5000001-6000000';
                    break;
                case 'ggallus_grcg6a':
                    defaultRegion = 'CM000098.5:6000001-7000000';
                    break;
                case 'gmax_20':
                    defaultRegion = '5:39000001-40000000';
                    break;
                case 'gmax_gmaxv11':
                    defaultRegion = 'GLYMAchr_11:15000001-16000000';
                    break;
                case 'gmax_v1':
                    defaultRegion = 'GLYMAchr_01:16000001-17000000';
                    break;
                case 'gmax_v21':
                    defaultRegion = 'CM000851.3:47000001-48000000';
                    break;
                case 'hannus_xrqr10':
                    defaultRegion = 'HanXRQChr04:112000001-113000000';
                    break;
                case 'hchromini_Orenil11':
                    defaultRegion = 'LG22:1000001-2000000';
                    break;
                case 'hleucocephalus_40':
                    defaultRegion = 'NW_010973220.1:4000001-5000000';
                    break;
                case 'hsapiens_asm240226v1':
                    defaultRegion = 'AJ507799.2:1-1000000';
                    break;
                case 'hvulgare_030312v2':
                    defaultRegion = '7:5000001-6000000';
                    break;
                case 'hvulgare_morexv20':
                    defaultRegion = 'chr6H:545000001-546000000';
                    break;
                case 'jregia_wgs5d':
                    defaultRegion = 'LIHL01055748.1:1-1000000';
                    break;
                case 'lmonocytogenesegde_asm19603v1':
                    defaultRegion = 'AL591824.1:2000001-3000000';
                    break;
                case 'lpolyactis_asm1011929v1':
                    defaultRegion = 'scaffold1588:1-1000000';
                    break;
                case 'lrohita_asm412021v1':
                    defaultRegion = 'scaffold_12910:1-1000000';
                    break;
                case 'lsalmonis_lsalatlcanadafemalev1':
                    defaultRegion = 'LBBX01017489.1:1-1000000';
                    break;
                case 'lsativa_lsatsalinasv7':
                    defaultRegion = 'CM022518.1:159000001-160000000';
                    break;
                case 'lusitatissimum_asm22429v2':
                    defaultRegion = 'CP027626.1:11000001-12000000';
                    break;
                case 'mchrysops_dom152mochry10':
                    defaultRegion = '1080622:1-1000000';
                    break;
                case 'mmusculus_grcm38':
                    defaultRegion = '4:113000001-114000000';
                    break;
                case 'mmusculus_mgscv37':
                    defaultRegion = '1:90000001-91000000';
                    break;
                case 'msubspparatuberculosis_asm786v1':
                    defaultRegion = 'NC_002944.2:1000001-2000000';
                    break;
                case 'nvison_nnqggv1':
                    defaultRegion = 'FNWR01000307.1:1000001-2000000';
                    break;
                case 'oanatinus_501':
                    defaultRegion = 'NW_001794413.1:2000001-3000000';
                    break;
                case 'oaries_oarrambouilletv10':
                    defaultRegion = 'Chromosome11:25000001-26000000';
                    break;
                case 'oaries_oarv31':
                    defaultRegion = 'X:1000001-2000000';
                    break;
                case 'ocuniculus_20':
                    defaultRegion = 'CM000798.1:12000001-13000000';
                    break;
                case 'odallidalli_oarv31':
                    defaultRegion = 'OAR20:27000001-28000000';
                    break;
                case 'oniloticus_umdnmbu':
                    defaultRegion = 'LG08:1-1000000';
                    break;
                case 'osativa_irgsp10':
                    defaultRegion = '4:3000001-4000000';
                    break;
                case 'osativa_osativa40':
                    defaultRegion = 'NC_001320.1:1-1000000';
                    break;
                case 'osativaindicagroup_irgsp10':
                    defaultRegion = '6:16000001-17000000';
                    break;
                case 'osativaindicagroup_r498genomeversion1':
                    defaultRegion = 'CP018160.1:4000001-5000000';
                    break;
                case 'osativajaponicagroup_irgsp10':
                    defaultRegion = '4:10000001-11000000';
                    break;
                case 'osativajaponicagroup_osativa40':
                    defaultRegion = '11:13000001-14000000';
                    break;
                case 'pabies_a541150contigsfastagz':
                    defaultRegion = 'contig_9922:1-1000000';
                    break;
                case 'pbairdii_hupman21':
                    defaultRegion = 'chr23:29000001-30000000';
                    break;
                case 'pfalciparum_GCA000002765':
                    defaultRegion = '4:1-1000000';
                    break;
                case 'pfalciparum_asm276v2':
                    defaultRegion = '11:1000001-2000000';
                    break;
                case 'pmajor_11':
                    defaultRegion = '4:29000001-30000000';
                    break;
                case 'pvulgaris_10':
                    defaultRegion = '11:47000001-48000000';
                    break;
                case 'rnorvegicus_60':
                    defaultRegion = 'chr6:140000001-141000000';
                    break;
                case 'sbicolor_ncbiv3':
                    defaultRegion = 'Chr05:46000001-47000000';
                    break;
                case 'sbicolor_sorbi1':
                    defaultRegion = '8:54000001-55000000';
                    break;
                case 'scerevisiae_r64':
                    defaultRegion = 'BK006948.2:1-1000000';
                    break;
                case 'sdumerili_10':
                    defaultRegion = 'BDQW01000306.1:1-1000000';
                    break;
                case 'sitalica_setariav1':
                    defaultRegion = 'SETITscaffold_4:35000001-36000000';
                    break;
                case 'slucioperca_slucfbn12':
                    defaultRegion = 'CM024506.1:12000001-13000000';
                    break;
                case 'slycopersicum_sl240':
                    defaultRegion = '4:10000001-11000000';
                    break;
                case 'smansoni_23792v2':
                    defaultRegion = '2:32000001-33000000';
                    break;
                case 'spombe_asm294v2':
                    defaultRegion = 'III:1-1000000';
                    break;
                case 'ssalar_20':
                    defaultRegion = 'NC_027320.1:55000001-56000000';
                    break;
                case 'ssalar_icsasgv2':
                    defaultRegion = 'NC_027320.1:55000001-56000000';
                    break;
                case 'sscrofa_102':
                    defaultRegion = 'chr15:155000001-156000000';
                    break;
                case 'taestivum_iwgscrefseqv10':
                    defaultRegion = '6A:613000001-614000000';
                    break;
                case 'tcacao_20110822':
                    defaultRegion = '10:11000001-12000000';
                    break;
                case 'tcastaneum_tcas52':
                    defaultRegion = 'NC_003081.2:1-1000000';
                    break;
                case 'testing':
                    defaultRegion = '12:13000001-14000000';
                    break;
                case 'tguttata_324':
                    defaultRegion = '1A:24000001-25000000';
                    break;
                case 'vpacos_202':
                    defaultRegion = 'KB632649.1:1-1000000';
                    break;
                case 'vpacos_vicpac31':
                    defaultRegion = 'ABRR03077387.1:1-1000000';
                    break;
                case 'vunguiculata_asm411807v1':
                    defaultRegion = 'Vu11(old9):34000001-35000000';
                    break;
                case 'zmays_agpv2':
                    defaultRegion = 'chr10:147000001-148000000';
                    break;
                case 'zmays_agpv3':
                    defaultRegion = '9:151000001-152000000';
                    break;
                default:
                    defaultRegion = '1:3000000-3100000';
            }
            _this.formPanelVariantFilter.panel.getForm().findField('region').setValue(defaultRegion);
            _this.variantWidget.toolTabPanel.setActiveTab(0);
        });

        var conseqTypeFilter = new EvaConsequenceTypeFilterFormPanel({
            // consequenceTypes: consequenceTypes[87],
            selectAnnotCT: _this.selectAnnotCT,
            collapsed: true,
            fields: [
                {name: 'name', type: 'string'}
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    flex: 1,
                    sortable: false,
                    dataIndex: 'name'
                }
            ]
        });
        var populationFrequencyFilter = new EvaPopulationFrequencyFilterFormPanel({
            collapsed: true,
            maf: _this.maf
        });
        var proteinSubScoreFilter = new EvaProteinSubstitutionScoreFilterFormPanel({
            collapsed: true,
            polyphen: _this.polyphen,
            sift: _this.sift
        });
        var conservationScoreFilter = new EvaConservationScoreFilterFormPanel({
            collapsed: true
        });

        var annotationFilter = new EvaAnnotationVersionFilterFormPanel();

        annotationFilter.on('annotationVersion:change', function (e) {
            if(e.annotationVersion && !_.isUndefined(e.annotationVersion) && e.annotationVersion != '_' ) {
                var _annotVersion = e.annotationVersion.split("_");
                _this.variantWidget['selectedAnnotationVersion'] = _.findWhere(_this.annotationVersions, {vepVersion:_annotVersion[0]},{cacheVersion:_annotVersion[0]});
                _this._loadConsequenceTypes(conseqTypeFilter, _this.variantWidget['selectedAnnotationVersion'].vepVersion);
            } else {
                _this.variantWidget['selectedAnnotationVersion'] = '';
                _this._loadConsequenceTypes(conseqTypeFilter, 'default');
            }
        });

        var formPanel = new EvaFormPanel({
            header: false,
            title: 'Filter',
            type: 'variantBrowser',
            headerConfig: false,
            mode: 'accordion',
            target: target,
            submitButtonText: 'Search',
            submitButtonId: 'vb-submit-button',
            filters: [speciesFilter, positionFilter,annotationFilter,conseqTypeFilter,populationFrequencyFilter,proteinSubScoreFilter, studyFilter],
            height: 1359,
            border: false,
            handlers: {
                'submit': function (e) {
                    _this.variantWidget.setLoading(true);
                    //POSITION CHECK
                    var regions = [];
                    if (typeof e.values.region !== 'undefined') {
                        if (e.values.region !== "") {
                            regions = e.values.region.split(",");
                        }
                        delete  e.values.region;
                    }
                    if (!_.isUndefined(e.values.species)) {
                        var cellBaseSpecies = e.values.species.split("_")[0];
                    }

                    if (typeof e.values.gene !== 'undefined') {
                        e.values.gene = e.values.gene.toUpperCase();
                        this.panel.getForm().findField('gene').setValue(e.values.gene);
                    }

                    if (typeof e.values.snp !== 'undefined') {
                        e.values.snp = e.values.snp.replace(/\s+/g, ",").replace(/,+/g, ",").replace(/,$/g, "").replace(/^,/g, "");
                        e.values.id = e.values.snp;
                        this.panel.getForm().findField('snp').setValue(e.values.id);
                    }

                    //CONSEQUENCE TYPES CHECK
                    if (typeof e.values.ct !== 'undefined') {
                        if (e.values.ct instanceof Array) {
                            e.values.ct = e.values.ct.join(",");
                        }
                    }

                    if (regions.length > 0) {
                        e.values['region'] = regions.join(',');
                    }

                    var category = 'segments';
                    var resource = 'variants';
                    var query = regions;
                    //<!--------Query by GENE ----->
                    if (e.values.gene) {
                        category = 'genes';
                        query = e.values.gene;
                    }

                    //<!--------Query by ID ----->
                    if (e.values.id) {
                        resource = null;
                        category = 'variants';
                        query = e.values.id;
                    }

                    var url = EvaManager.url({
                        category: category,
                        resource: resource,
                        query: query,
                        params: {merge: true, exclude: 'sourceEntries'}
                    });

                    if (!_.isEmpty(e.values.studies)) {
                        e.values.studies = e.values.studies.join(',');
                    }                   

                    if (!_.isEmpty(e.values["annot-ct"])) {
                        e.values["annot-ct"] = e.values["annot-ct"].join(',');
                    }

                    if(e.values.annotVersion != '_' && !_.isUndefined(e.values.annotVersion)) {
                        var _annotVersion = e.values.annotVersion.split("_");
                        e.values['annot-vep-version'] = _annotVersion[0];
                        e.values['annot-vep-cache-version'] = _annotVersion[1];
                    }
                    delete e.values['annotVersion'];
                    var values = _.clone(e.values);
                    delete values['region'];
                    delete values['id'];
                    delete values['snp'];
                    delete values['selectFilter'];
                    delete values['gene'];

                    if (_this.formPanelVariantFilter.validatePositionFilter(category, query)) {
                        _this.variantWidget.retrieveData(url,values);
                        _this.variantWidget.retrieveDataURL = url;
                        _this.variantWidget.values = e.values;
                        _this['queryParams'] = e.values;
                        if(_this.pushURL){
                            _this._updateURL(e.values);
                        }
                        _this.pushURL = true;

                    } else {
                        _this.variantWidget.retrieveData('', '');
                    }

                }
            }
        });

        formPanel.on('form:clear', function (e) {
            _this.formPanelVariantFilter.filters[0].panel.getForm()
                .findField('species').setValue(EvaVariantWidgetPanel.defaultSpecies);
            _this.formPanelVariantFilter.filters[1].panel.getForm()
                .findField('selectFilter').setValue(EvaVariantWidgetPanel.defaultFilter);
            _this.formPanelVariantFilter.filters[1].panel.getForm()
                .findField('region').setValue(EvaVariantWidgetPanel.defaultRegion);
        });

        _this.on('studies:change', function (e) {
            var formValues = _this.formPanelVariantFilter.getValues();
            _this.formPanelVariantFilter.trigger('submit', {values: formValues, sender: _this});
        });

        return formPanel;
    },
    _loadListStudies: function (filter, species) {
        var _this = this;
        var studies = [];
        var resource = '';
        if (_.isNull(species)) {
            resource = 'all'
        } else {
            resource = 'list'
        }
        EvaManager.get({
            category: 'meta/studies',
            resource: resource,
            params: {species: species},
            success: function (response) {
                try {
                    var _tempStudies = response.response[0].result;
                    _.each(_.keys(_tempStudies), function (key) {

                        if(_.indexOf(DISABLE_STUDY_LINK, this[key].studyId) > -1){
                            this[key].link = false;
                        }else{
                            this[key].link = true;
                        }
                        studies.push(this[key])

                    },_tempStudies);

                } catch (e) {
                    console.log(e);
                }

                _this.variantWidget.studies = studies;
                filter.studiesStore.loadRawData(studies);

                if (_.isEmpty(_this.selectStudies)) {
                    //set all records checked default
                    _this.formPanelVariantFilter.filters[6].grid.getSelectionModel().selectAll()
                } else {
                    var studyArray = _this.selectStudies.split(",");
                    var items = _this.formPanelVariantFilter.filters[6].grid.getSelectionModel().store.data.items;
                    var selectStudies = [];
                    _.each(_.keys(items), function (key) {
                        if (_.indexOf(studyArray, this[key].data.studyId) > -1) {
                            selectStudies.push(this[key])
                        }
                    }, items);

                    _this.formPanelVariantFilter.filters[6].grid.getSelectionModel().select(selectStudies)
                }

                _this.selectStudies = '';
                _this.trigger('studies:change', {studies: studies, sender: _this});
            }
        });
    },
    _loadConsequenceTypes: function (filter, vepVersion) {
        var _this = this;
        var conseqTypeTreeStore = Ext.create('Ext.data.TreeStore', {
            model: 'Tree Model',
            proxy: {
                type: 'memory',
                data: filter.consequenceTypes[vepVersion],
                reader: {
                    type: 'json'
                }
            },
            root: {
                expanded: false
            }
        });

        filter.panel.reconfigure(conseqTypeTreeStore);

        var nodes = filter.panel.getRootNode();
        nodes.cascadeBy(function (n) {
            if (n.isLeaf()) {
                n.data.qtip =  n.data.description;
            }
        });

        if (!_.isEmpty(_this.selectAnnotCT)) {
            var annotCT = _this.selectAnnotCT.split(",");
            filter.selectNodes(annotCT);
        }
    },
    _loadAnnotationVersion: function (filter, species) {
        var _this = this;
        EvaManager.get({
            category: 'annotation',
            resource: '',
            params: {species: species},
            async:false,
            success: function (response) {
                try {
                    _this.annotationVersions =  response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
            }
        });
        var defaultAnnotVersion = 'default';
        if( !_.isUndefined(_this.annotationVersions)){
            if( _this.vepVersion &&  _this.cacheVersion){
                defaultAnnotVersion = _.findWhere(_this.annotationVersions, {vepVersion: _this.vepVersion,cacheVersion:_this.cacheVersion});
                _this.vepVersion = '';
                _this.cacheVersion = '';
            } else{
                defaultAnnotVersion = _.findWhere(_this.annotationVersions, {defaultVersion: true});
            }
        }
        filter.panel.items.items[0].store.loadRawData( _this.annotationVersions);
        filter.panel.form.findField('annotVersion').setValue(defaultAnnotVersion.vepVersion+'_'+defaultAnnotVersion.cacheVersion);
        filter.panel.items.items[0].store.load({
            callback : function() {
                filter.panel.form.findField('annotVersion').setValue(defaultAnnotVersion.vepVersion+'_'+defaultAnnotVersion.cacheVersion);
            }
        });

    },
    _updateURL: function (values) {

        var _this = this;
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + 'Variant-Browser&' + $.param(values);
        history.pushState ('forward', '', newurl);

        //sending tracking data to Google Analytics
        var searchParams = values['species']+'&'+values['selectFilter'];
        var filterValue;
        switch (values['selectFilter']) {
            case 'gene':
                filterValue = values['gene'];
                break;
            case 'snp':
                filterValue = values['snp'];
                break;
            default:
                filterValue = values['region'];
        }
        searchParams += '='+filterValue;
        ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:searchParams});
        ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:'species='+values['species']});
        values = _.omit(values, 'selectFilter', 'species', 'gene', 'snp', 'region');
        var gaValues = $.param(values).split("&");
        _.each(_.keys(gaValues), function (key) {
            ga('send', 'event', { eventCategory: 'Variant Browser', eventAction: 'Search', eventLabel:decodeURIComponent(this[key])});
        }, gaValues);
    }
};




