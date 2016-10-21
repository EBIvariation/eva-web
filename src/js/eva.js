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
function Eva(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("Eva");
    this.target;
    this.targetMenu;
    this.autoRender = true;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    this.childDivMenuMap = {};
    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

Eva.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing");

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('class', 'eva-app');
        this.div.setAttribute('id', this.id);

        this.targetMenuUl = (this.targetMenu instanceof HTMLElement ) ? this.targetMenu : document.querySelector('#' + this.targetMenu);
        this.evaMenu = this._createEvaMenu(this.targetMenuUl);

        /* Home */
        $(this.homeDiv).addClass('eva-child');
        this.childDivMenuMap['Home'] = this.homeDiv;

        /* Submit */
        $(this.submitDiv).addClass('eva-child');
        this.childDivMenuMap['Submit Data'] = this.submitDiv;

        /* About */
        $(this.aboutDiv).addClass('eva-child');
        this.childDivMenuMap['About'] = this.aboutDiv;

        /* Feedback */
        $(this.feedbackDiv).addClass('eva-child');
        this.childDivMenuMap['Feedback'] = this.feedbackDiv;

        /* api */
        $(this.apiDiv).addClass('eva-child');
        this.childDivMenuMap['API'] = this.apiDiv;

        /* Templates */
        $(this.templatesDiv).addClass('eva-child');
        this.childDivMenuMap['Templates'] = this.templatesDiv;

        /* VCF */
        $(this.vcfDiv).addClass('eva-child');
        this.childDivMenuMap['VCF'] = this.vcfDiv;

        /* studyView */
        $(this.studyView).addClass('eva-child');
        this.childDivMenuMap['eva-study'] = this.studyView;
        this.childDivMenuMap['dgva-study'] = this.studyView;

        /* variantView */
        $(this.variantView).addClass('eva-child');
        this.childDivMenuMap['variant'] = this.variantView;

        /* geneView */
        $(this.geneView).addClass('eva-child');
        this.childDivMenuMap['gene'] = this.geneView;

        /* beacon */
        $(this.beacon).addClass('eva-child');
        this.childDivMenuMap['GA4GH'] = this.beacon;

        /* clinical */
        $(this.clinicalDiv).addClass('eva-child');
        this.childDivMenuMap['Clinical Browser'] = this.clinicalDiv;

        /* FAQ */
        $(this.faqDiv).addClass('eva-child');
        this.childDivMenuMap['FAQ'] = this.faqDiv;

    },
    draw: function (option) {
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (this.targetDiv === 'undefined') {
            console.log('target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);
        this.evaMenu.draw();
        this.contentDiv = document.querySelector('#content');

        this._selectHandler(option, false);
        $("a:contains('" + option + "')").parent('li').addClass('active');

    },
    select: function (option) {
        // this.evaMenu.select(option);
        this._selectHandler(option, true);
    },
    _selectHandler: function (option, update) {
        update = update || 0;
        var _this = this;

       
        if (this.studyBrowserPanel) {
            this.studyBrowserPanel.hide();
        }

        if (this.variantWidgetPanel) {
            this.variantWidgetPanel.hide();
        }

        if (this.genomeViewerPanel) {
            this.genomeViewerPanel.hide();
        }

        if (this.beaconPanel) {
            this.beaconPanel.hide();
        }

        if (this.clinicalWidgetPanel) {
            this.clinicalWidgetPanel.hide();
        }

        $('body').find('.show-div').each(function (index, el) {
            $(el).removeClass('show-div');
            $(el).addClass('hide-div');
//           _this.div.removeChild(el)
        });
        if (this.childDivMenuMap[option]) {
            $(this.childDivMenuMap[option]).removeClass('hide-div');
            $(this.childDivMenuMap[option]).addClass('show-div');
//            this.div.appendChild(this.childDivMenuMap[option]);
        }

        //<!---- Updating URL on Tab change ---->
        if(update){
            this.pushURL(option);
        }

        switch (option) {
            case 'Home':
                _this._drawStatisticsChart();
                _this._twitterWidgetUpdate();
                break;
            case 'Study Browser':
                if (this.studyBrowserPanel) {
                    this.studyBrowserPanel.show();
                } else {
                    this.studyBrowserPanel = this._createStudyBrowserPanel(this.contentDiv);
                    // this.select('Study Browser');
                    // this.pushURL(option, false);
                }
                break;
            case 'Variant Browser':
                if (this.variantWidgetPanel) {
                    this.variantWidgetPanel.show();
                } else {
                    this.variantWidgetPanel = this._createVariantWidgetPanel(this.contentDiv);
                    // this.select('Variant Browser');
                    this.variantWidgetPanel.panel.updateLayout();
                    // this.pushURL(option, true);
                }
                break;
            case 'Genome Browser':
                if (this.genomeViewerPanel) {
                    this.genomeViewerPanel.show();
                } else {
                    this.contentDiv.className += ' eva variant-widget-panel ocb-variant-stats-panel';
                    this.genomeViewerPanel = this._createGenomeViewerPanel(this.contentDiv);
                }
                // this.pushURL(option, true);
                break;
            case 'GA4GH':
                if (this.beaconPanel) {
                    this.beaconPanel.show();
                } else {
                    this.beaconPanel = this._createBeaconPanel(this.contentDiv);
                }
                break;
            case 'Clinical Browser':
                if (this.clinicalWidgetPanel) {
                    this.clinicalWidgetPanel.show();
                } else {
                    this.clinicalWidgetPanel = this._createClinicalWidgetPanel(this.contentDiv);
                    // this.select('Clinical Browser');
                    this.clinicalWidgetPanel.panel.updateLayout();
                    this.clinicalWidgetPanel.formPanelClinvarFilter.trigger('submit', {values: this.clinicalWidgetPanel.formPanelClinvarFilter.getValues(), sender: _this});
                    // this.pushURL(option, false);
                }
            case 'dgva-study':
                this._getPublications();
                break;
            case 'eva-study':
                this._getPublications();
                break;

        }

      if (option) {
          ga('set', 'page', option);
          ga('send', 'pageview');
      }


    },
    _createEvaMenu: function (target) {
        var _this = this;
        var evaMenu = new EvaMenu({
            target: target,
            handlers: {
                'menu:click': function (e) {
                    _this._selectHandler(e.option, true);
                }
            }
        });
        return evaMenu;
    },
    _createStudyBrowserPanel: function (target) {

        var browserType = 'sgv';
        var species = '';
        var type = '';
        var search = '';
        var pushURL = true;

        if (!_.isEmpty($.urlParam('studySpecies'))) {
            species = decodeURIComponent($.urlParam('studySpecies'))
        }

        if (!_.isEmpty($.urlParam('studyType'))) {
            type = decodeURIComponent($.urlParam('studyType'))
        }

        if (!_.isEmpty($.urlParam('browserType'))) {
            browserType = decodeURIComponent($.urlParam('browserType'))
        }

        if (!_.isEmpty($.urlParam('search'))) {
            search = decodeURIComponent($.urlParam('search'))
        }

        var tab = getUrlParameters('');
        if(tab && decodeURI(tab.id) == 'Study Browser') {
            pushURL = false;
        }

        var studyBrowser = new EvaStudyBrowserWidgetPanel({
            target: target,
            species: species,
            type: type,
            browserType: browserType,
            search: search,
            pushURL:pushURL
        });
        studyBrowser.draw();
        return studyBrowser;

    },
    _createVariantWidgetPanel: function (target) {
        //      var position = '21:21989000-21989560';
        var region = '2:48000000-49000000';
        var species = 'hsapiens_grch37';
        var filter = 'region';
        var snp = '';
        var gene = 'BRCA2';
        var studies = '';
        var annotCT = '';
        var polyphen = '';
        var sift = '';
        var maf = '';
        var pushURL = true;

        if (!_.isEmpty($.urlParam('region'))) {
            region = decodeURIComponent($.urlParam('region'))
        }

        if (!_.isEmpty($.urlParam('species'))) {
            species = decodeURIComponent($.urlParam('species'))
        }

        if (!_.isEmpty($.urlParam('selectFilter'))) {
            filter = decodeURIComponent($.urlParam('selectFilter'))
        }

        if (!_.isEmpty($.urlParam('snp'))) {
            snp = decodeURIComponent($.urlParam('snp'))
        }

        if (!_.isEmpty($.urlParam('gene'))) {
            gene = decodeURIComponent($.urlParam('gene'))
        }

        if (!_.isEmpty($.urlParam('studies'))) {
            studies = decodeURIComponent($.urlParam('studies'))
        }

        if (!_.isEmpty($.urlParam('annot-ct'))) {
            annotCT = decodeURIComponent($.urlParam('annot-ct'))
        }

        if (!_.isEmpty($.urlParam('polyphen'))) {
            var _polyphen = decodeURIComponent($.urlParam('polyphen'))
            polyphen = _polyphen.replace(/\>/g, "");
        }

        if (!_.isEmpty($.urlParam('sift'))) {
            var _sift = decodeURIComponent($.urlParam('sift'))
            sift = _sift.replace(/\</g, "");
        }

        if (!_.isEmpty($.urlParam('maf'))) {
            var _maf = decodeURIComponent($.urlParam('maf'))
//            maf = _maf.replace(/\>/g, "");
            maf = _maf;
        }
        var tab = getUrlParameters('');
        if(tab && decodeURI(tab.id) == 'Variant Browser') {
            pushURL = false;
        }

        var variantWidget = new EvaVariantWidgetPanel({
            target: target,
            region: region,
            species: species,
            filter: filter,
            snp: snp,
            gene: gene,
            selectStudies: studies,
            selectAnnotCT: annotCT,
            polyphen: polyphen,
            sift: sift,
            maf: maf,
            pushURL:pushURL

        });
        variantWidget.draw();
        return variantWidget;

    },
    _createGenomeViewerPanel: function (target) {
        var genomeViewer = new EvaGenomeViewerPanel({
            target: target,
            position: $.urlParam('position')
        });
        genomeViewer.draw();
        return genomeViewer;

    },
    _createBeaconPanel: function (target) {
        var evaBeacon = new EvaBeaconPanel({
            target: target
        });
        evaBeacon.draw();
        return evaBeacon;

    },
    _createClinicalWidgetPanel: function (target) {

        var clinvarRegion = '2:48000000-49000000';
        var filter = 'region';
        var accessionId = 'RCV000030271';
        var gene = 'MSH6';
        var so = '';
        var phenotype = '';
        var type = '';
        var significance = '';
        var review = '';
        var pushURL = true;


        if (!_.isEmpty($.urlParam('clinvarRegion'))) {
            clinvarRegion = decodeURIComponent($.urlParam('clinvarRegion'));
        }

        if (!_.isEmpty($.urlParam('clinvarSelectFilter'))) {
            filter = decodeURIComponent($.urlParam('clinvarSelectFilter'))
        }

        if (!_.isEmpty($.urlParam('accessionId'))) {
            accessionId = decodeURIComponent($.urlParam('accessionId'))
        }

        if (!_.isEmpty($.urlParam('gene'))) {
            gene = decodeURIComponent($.urlParam('gene'))
        }

        if (!_.isEmpty($.urlParam('so'))) {
            so = decodeURIComponent($.urlParam('so'))
        }

        if (!_.isEmpty($.urlParam('type'))) {
            type = decodeURIComponent($.urlParam('type'))
        }

        if (!_.isEmpty($.urlParam('phenotype'))) {
            phenotype = decodeURIComponent($.urlParam('phenotype'))
        }

        if (!_.isEmpty($.urlParam('significance'))) {
            significance = decodeURIComponent($.urlParam('significance'))
        }

        if (!_.isEmpty($.urlParam('review'))) {
            review = decodeURIComponent($.urlParam('review'))
        }

        var tab = getUrlParameters('');
        if(tab && decodeURI(tab.id) == 'Clinical Browser') {
            pushURL = false;
        }

        var evaClinicalWidgetPanel = new EvaClinicalWidgetPanel({
            target: target,
            filter: filter,
            clinvarRegion: clinvarRegion,
            gene: gene,
            accessionId: accessionId,
            selectSO: so,
            phenotype: phenotype,
            type: type,
            significance: significance,
            review: review,
            pushURL:pushURL
        });
        evaClinicalWidgetPanel.draw();
        return evaClinicalWidgetPanel;

    },
    pushURL: function (option, replace) {
        replace = replace || 0;
        if (replace) {
            var replaceURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + option;
            window.history.pushState({path: option}, '', replaceURL);
        } else {
            var pageArray = ['eva-study', 'dgva-study', 'variant', 'gene', 'Variant Browser', 'Clinical Browser', 'Study Browser'];
            if (_.indexOf(pageArray, option) < 0 && !_.isEmpty(option)) {
                var optionValue = option;
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + optionValue;
                history.pushState('forward', '', newurl);
                $("a:contains('" + option + "')").parent('li').addClass('active');
            }
        }
    },
    _twitterWidgetUpdate: function () {

        var twitterWidgetEl = document.getElementById('twitter-widget');
        twitterWidgetEl.innerHTML = "";
        twitterWidgetEl.innerHTML = '<a  class="twitter-timeline" height=100 href="https://twitter.com/EBIvariation"  data-widget-id="437894469380100096">Tweets by @EBIvariation</a>';
        $.getScript('//platform.twitter.com/widgets.js', function () {
//            twttr.widgets.load();
        });
    },
    _drawStatisticsChart: function () {
        var evaStatistics = new EvaStatistics({
            targetId: 'eva-statistics'
        });
        var dgvaStatistics = new DgvaStatistics({
            targetId: 'dgva-statistics'
        });
    },
    _getPublications: function() {
        $('.pubmed-id').each(function(i, obj) {
            obj = $(obj);
            var pubmedId = obj.html();
            obj.html('<p>Attempting to retrieve publication information for PubMed ID <a class="external publication" href="http://europepmc.org/abstract/MED/' + pubmedId + '">' + pubmedId + '...</p>');
            if(pubmedId && pubmedId != '-') {
                var host = METADATA_HOST.replace("/eva/webservices/rest", "");
                var url = host + '/europepmc/webservices/rest/search?query=ext_id:' + pubmedId + ' src:med&format=json';
                if (window.location.protocol != 'https:') {
                    url = url.replace("http", "https");
                }
                // Make the actual AJAX call...
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: "json",
                    async: false,
                    success: function (response) {
                        var data = response.resultList.result[0];
                        if (data) {
                            var title = data.title;
                            var authors = data.authorString;
                            var journal = data.journalTitle;
                            var volume = data.journalVolume;
                            var year = data.pubYear;
                            var pages = data.pageInfo;
                            var pmid = data.pmid;

                            var paper_output = '<p class="publications"><a class="external publication" href="http://europepmc.org/abstract/MED/' + pmid + '">' + title + '</a><br />';
                            paper_output += authors + '<br />';
                            paper_output += '<em>' + journal + '</em> <strong>' + volume + '</strong>:' + year + ' ' + pages + '</p>';
                            obj.html(paper_output);
                        }
                    },
                    error: function (x, y, z) {
                        obj.html('&nbsp;&nbsp;PubMed:<a class="external publication" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + pubmedId + '" target="_blank">' + pubmedId + '</a><br />');
                        // x.responseText should have what's wrong
                    }
                });

            }else{
                obj.html(pubmedId);
            }
        });
        return;
    }

}
