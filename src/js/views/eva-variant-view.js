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
var variant = {};

function EvaVariantView(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAVariantView");
    _.extend(this, args);
    this.rendered = false;
    this.render();

}
EvaVariantView.prototype = {
    render: function () {
        var _this = this;

        this.targetDiv = (this.target instanceof HTMLElement) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVA-VariantView: target ' + this.target + ' not found');
            return;
        }

        this.studiesList = [];
        this.speciesList = getSpeciesList();
        this.variantInfoFromAccessioningService = null;

        this.getVariantInfoFromEVAService = function(position) {
            var webServiceResponse = EvaManager.get({
                category: 'variants',
                resource: 'info',
                query: position,
                params: params,
                async: false
            });
            var results = webServiceResponse.response[0].result;
            results.forEach(function(result) {
                result.associatedRSID = result.ids.find(x => x.startsWith("rs"));
                result.associatedSSIDs = result.ids.filter(x => x.startsWith("ss"));
            });
            return results;
        }

        if (this.accessionID) {
            this.getVariantInfoFromAccessioningService = function(accessionCategory, accessionID) {
                EvaManager.get({
                                service: ACCESSIONING_SERVICE,
                                category: accessionCategory,
                                resource: accessionID.substring(2),
                                async: false,
                                success: function (response) {
                                    try {
                                        if (typeof response !== 'undefined' && response != null && !_.isEmpty(response)) {
                                            return response.map(_this.getVariantInfoFromAccessioningServiceResponse);
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                            });
            }
            this.getVariantInfoFromAccessioningServiceResponse = function(response) {
                var variantInfo = {};

                var taxonomyIdFromAccService = response[0].data.taxonomyAccession;
                if (!_.isEmpty(_this.speciesList) && typeof taxonomyIdFromAccService !== 'undefined') {
                    speciesObj = _.chain(_this.speciesList)
                                .filter({taxonomyId: taxonomyIdFromAccService})
                                .sortBy('assemblyAccession').value()[0];
                    variantInfo.species = speciesObj.taxonomyCode + "_" + speciesObj.assemblyCode;

                    variantInfo.chromosome = response.data.contig;
                    variantInfo.start = response.data.start;

                    variantInfo.reference = response.data.referenceAllele;
                    if (response.data.alternateAllele) {
                        variantInfo.alternate = response.data.alternateAllele;
                        variantInfo.end = variantInfo.start +
                                                Math.max(response.data.referenceAllele.length,
                                                         response.data.alternateAllele.length) - 1;
                        variantInfo.position = [variantInfo.chromosome, variantInfo.start, variantInfo.reference,
                                                             variantInfo.alternate].join(":");
                        variantInfo.associatedRSID = variantInfo.clusteredVariantAccession;
                    }
                    if (this.accessionCategory === "clustered-variants") {
                        variantInfo.id = "rs" + response.accession;
                    }
                    if (this.accessionCategory === "submitted-variants") {
                        variantInfo.id = "ss" + response.accession;
                    }
                    variantInfo.associatedSSIDs = [{"ID": "ss1", "Chromosome": 1, "Start": 3001313, "End": 3001313,
                                                    "Reference": "C", "Alternate": "T",
                                                    "Handle": "EVA_HANDLE1", "Orientation":"Fwd"},
                                                   {"ID": "ss1", "Chromosome": 1, "Start": 3001313, "End": 3001313,
                                                    "Reference": "C", "Alternate": "A",
                                                    "Handle": "EVA_HANDLE1", "Orientation":"Fwd"},
                                                   {"ID": "ss2", "Chromosome": 1, "Start": 3001313, "End": 3001313,
                                                    "Reference": "C", "Alternate": "G",
                                                    "Handle": "EVA_HANDLE1", "Orientation":"Fwd"}]
                    return variantInfo;
                }
            }

            this.accessionCategory = this.accessionID.startsWith("rs") ? "clustered-variants": "submitted-variants";
            this.variantInfoFromAccessioningService = this.getVariantInfoFromAccessioningService(this.accessionCategory, this.accessionID);
        }

        // Get studies list
        EvaManager.get({
            category: 'meta/studies',
            resource: 'list',
            params: {species: this.species},
            async: false,
            success: function (response) {
                try {
                    var _tempStudies = response.response[0].result;
                    _.each(_.keys(_tempStudies), function (key) {

                        if(_.indexOf(DISABLE_STUDY_LINK, this[key].studyId) > -1){
                            this[key].link = false;
                        }else{
                            this[key].link = true;
                        }
                        _this.studiesList.push(this[key])

                    },_tempStudies);

                } catch (e) {
                    console.log(e);
                }
            }
        });

        var params = {species: this.species};
        if(this.annotationVersion){
            var _annotVersion = this.annotationVersion.split("_");
            _.extend(params, {'annot-vep-version':_annotVersion[0]},{'annot-vep-cache-version':_annotVersion[1]});
        }

        this.variant = []
        if (this.variantInfoFromAccessioningService) {
            this.variant = this.variantInfoFromAccessioningService;
            this.variantAttributesFromAccessioningService = ["chromosome", "start", "reference", "alternate", "end", "id",
                                                                               "position", "associatedSSIDs"]
            this.variant.forEach(function(variantObj) {
                var variantInfoFromEVAService = _this.getVariantInfoFromEVAService(variantObj.position)[0];
                for (var key in variantInfoFromEVAService) {
                    if (!_this.variantAttributesFromAccessioningService.includes(key)) {
                        variantObj[key] = variantInfoFromEVAService[key];
                    }
                }
                variantObj.repr = variantObj.alternate ? (variantObj.reference + "/" + variantObj.alternate) : '';
            });
            console.log(this.variantInfoFromAccessioningService);
        }
        else {
            if (this.position || this.accessionID) {
                var attributeToSearchBy = this.position ? this.position : this.accessionID;
                var variantInfoFromEVAService = this.getVariantInfoFromEVAService(attributeToSearchBy);
                if (variantInfoFromEVAService) {
                    this.variant = [variantInfoFromEVAService[0]];
                }
            }
        }

        this.draw();

        //sending tracking data to Google Analytics
        ga('send', 'event', { eventCategory: 'Views', eventAction: 'Variant', eventLabel:'species='+this.species+'variant='+this.position});
    },
    createVariantFilesPanel: function (targetDiv, variantData) {
        var _this = this;
        var variantFilesPanel = new EvaVariantFilesPanel({
            panelID: variantData.repr ? variantData.repr.replace("/", "_"):'',
            variantAlleles: variantData.repr,
            target: targetDiv,
            height: '',
            handlers: {
                "load:finish": function (e) {
//                    _this.grid.setLoading(false);
                }
            },
            statsTpl: new Ext.XTemplate(
                '<table class="ocb-stats-table" style="width:300px;">' +
                    '<tr>' +
                    '<td class="header">Minor Allele Frequency:</td>' +
                    '<td><tpl if="maf == -1 || maf == 0">NA <tpl else>{maf:number( "0.000" )} </tpl></td>' +
                    '</tr>',
                '<tr>' +
                    '<td class="header">MAF Allele:</td>' +
                    '<td><tpl if="mafAllele">{mafAllele} <tpl else>NA</tpl></td>' +
                    '</tr>',
                '<tr>' +
                    '<tr>' +
                    '<td class="header">Mendelian Errors:</td>' +
                    '<td><tpl if="mendelianErrors == -1">NA <tpl else>{mendelianErrors}</tpl></td>' +
                    '</tr>',
                '<tr>' +
                    '<td class="header">Missing Alleles:</td>' +
                    '<td><tpl if="missingAlleles == -1">NA <tpl else>{missingAlleles}</tpl></td>' +
                    '</tr>',
                '<tr>' +
                    '<td class="header">Missing Genotypes:</td>' +
                    '<td><tpl if="missingGenotypes == -1">NA <tpl else>{missingGenotypes}</tpl></td>' +
                    '</tr>',
                '</table>'
            )
        });

        if (variantData.sourceEntries) {
            variantFilesPanel.load(variantData.sourceEntries, {species: _this.species},  _this.studiesList);
            variantFilesPanel.draw();
        }

        return variantFilesPanel;
    },

    draw: function (data, content) {
        var _this = this;
        var variant = this.variant;

        if(_.isEmpty(variant)){
            var noDataEl = document.querySelector("#summary-grid");
            var noDataElDiv = document.createElement("div");
            noDataElDiv.innerHTML = '<span>No Data Available</span>';
            noDataEl.appendChild(noDataElDiv);
            return;
        }
        var variantViewDiv = document.querySelector("#variantView");
        $(variantViewDiv).addClass('show-div');
        var summaryContent = _this._renderSummaryData(variant);
        var summaryEl = document.querySelector("#summary-grid");
        var summaryElDiv = document.createElement("div");
        summaryElDiv.innerHTML = summaryContent;
        summaryEl.appendChild(summaryElDiv);

        if (this.accessionCategory == "submitted-variants" || this.position) {
            if(!_.isUndefined(_this._renderConsequenceTypeData(_this.variant))) {
                var consqTypeContent = _this._renderConsequenceTypeData(_this.variant);
                var consqTypeEl = document.querySelector("#consequence-types-grid");
                var consqTypeElDiv = document.createElement("div");
                consqTypeElDiv.innerHTML = consqTypeContent;
                consqTypeEl.appendChild(consqTypeElDiv);
            }

            var studyEl = document.querySelector("#studies-grid");
            this.variant.forEach(function(variant) {
                var studyElDiv = document.createElement("div");
                studyElDiv.setAttribute('id', `${variant.reference}_${variant.alternate}`);
                studyElDiv.setAttribute('class', 'eva variant-widget-panel ocb-variant-stats-panel');
                studyEl.appendChild(studyElDiv);
                _this.createVariantFilesPanel(studyElDiv, variant);
            });

            var popStatsEl = document.querySelector("#population-stats-grid-view");
            this.variant.forEach(function(variant) {
                var popStatsElDiv = document.createElement("div");
                popStatsElDiv.setAttribute('id', `${variant.reference}_${variant.alternate}`);
                popStatsElDiv.setAttribute('class', 'eva variant-widget-panel ocb-variant-stats-panel');
                popStatsEl.appendChild(popStatsElDiv);
                var variantData = {repr: variant.repr, sourceEntries: variant.sourceEntries,
                                    species: _this.species};
                _this._createPopulationStatsPanel(popStatsElDiv, variantData);
            });
        }

    },
    _renderSummaryData: function (data) {
        var speciesName;
        if (!_.isEmpty(this.speciesList)) {
            speciesName = _.findWhere(this.speciesList, {taxonomyCode: this.species.split("_")[0]}).taxonomyEvaName;
            speciesName = speciesName.substr(0, 1).toUpperCase() + speciesName.substr(1) + ' / ' +
                _.findWhere(this.speciesList, {taxonomyCode: this.species.split("_")[0]}).assemblyName;
        } else {
            speciesName = this.species;
        }

        var getSummaryTableHeaderRow = function(summaryData) {
            var header = '';
            _.each(_.keys(summaryData), function(key) {
                header += `<th>${key}</th>`;
            });
            return `<thead><tr>${header}</tr></thead>`;
        }
        var getSummaryTableContentRow = function(summaryData) {
            var rowContent = '';
            _.each(_.keys(summaryData), function(key) {
                rowContent += `<td>${summaryData[key]}</td>`;
            });
            return `<tr>${rowContent}</tr>`;
        }

        var summaryData = data.map(function(x) {
            return {"Organism/Assembly": speciesName, "Chromosome": x.chromosome, "Start": x.start, "End": x.end,
                    "Reference": _.escape(x.reference), "Alternate": _.escape(x.alternate)}
        });
        var _summaryTable = '<h4 class="variant-view-h4">Variant Information</h4><div class="row"><div class="col-md-8">'
        var variantInfoTitle = [data[0].chromosome, data[0].start, data[0].reference].join(":");
        var rsReference = '';

        if (this.accessionCategory === "clustered-variants") {
            summaryData = summaryData.map(x => _.omit(x, ["End", "Alternate"]));
            var submitterInfoHeading = '<h4 class="variant-view-h4">Submitted Variants</b></h4><div class="row"><div class="col-md-8">'
            var associatedSSData = data[0].associatedSSIDs;
            associatedSSData.forEach(x => x.ID = `<a href="?variant&accessionID=${x.ID}">${x.ID}</a>`);
            var ssInfoHeaderRow = getSummaryTableHeaderRow(associatedSSData[0]);
            var ssInfoContentRows = associatedSSData.map(getSummaryTableContentRow).join("");
        }
        else {
            variantInfoTitle += `:${data[0].alternate}`;
            if (data[0].associatedRSID) {
                rsReference = `<small><b>Clustered</b> under
                                <a href="?variant&accessionID=${data[0].associatedRSID}&species=${this.species}">
                                ${data[0].associatedRSID}</a></small>`;
            }
        }

        var variantInfoHeaderRow = getSummaryTableHeaderRow(summaryData[0]);
        var variantInfoContentRows = summaryData.map(getSummaryTableContentRow).join("");

        document.querySelector("#variantInfo").textContent = variantInfoTitle;
        _summaryTable += `<table class="table hover" style="font-size: small">${variantInfoHeaderRow}${variantInfoContentRows}</table>`;
        _summaryTable += '</div></div>';
        _summaryTable += ssInfoHeaderRow?
                            `${submitterInfoHeading}<table class="table hover" style="font-size: small">${ssInfoHeaderRow}${ssInfoContentRows}</table>` : '';
        _summaryTable += rsReference;
        _summaryTable += '</div></div>';

        return _summaryTable;

    },
    _renderConsequenceTypeData: function (variantDataArray) {
        var _this = this;
        return variantDataArray.map(function(data) {
            if(_.isUndefined(data.annotation)){
              return;
            }
            var annotation = data.annotation.consequenceTypes;
            var consequenceTypeHeading = '<h4 class="variant-view-h4"> Consequence Types' + (data.repr ? " for "+data.repr : "") +  '</h4>';
            if (!annotation) {
                return `${consequenceTypeHeading}<div style="margin-left:15px;">No Data Available</div>`;
            }
            annotation = annotation.sort(_this._sortBy('ensemblGeneId', _this._sortBy('ensemblTranscriptId')));
            var _consequenceTypeTable = `${consequenceTypeHeading}<div class="row"><div><table class="table hover" style="font-size: small">`;
            _consequenceTypeTable += '<thead><tr><th>Ensembl Gene ID</th><th>Ensembl Transcript ID</th><th>Accession</th><th>Name</th></tr></thead><tbody>'
            _.each(_.keys(annotation), function (key) {
                var annotationDetails = this[key];
                var soTerms = this[key].soTerms;
                _.each(_.keys(soTerms), function (key) {
                    var link = '<a href="http://www.sequenceontology.org/miso/current_svn/term/' + this[key].soAccession + '" target="_blank">' + this[key].soAccession + '</a>';
                    var so_term_detail = consequenceTypeDetails[soTerms[0].soName];
                    var color = '';
                    var impact = '';
                    var svg = '';
                    if (!_.isUndefined(so_term_detail)) {
                        color = so_term_detail.color;
                        impact = so_term_detail.impact;
                        svg = '<svg width="20" height="10"><rect x="0" y="3" width="15" height="10" fill="' + color + '"><title>' + impact + '</title></rect></svg>'
                    }

                    var ensemblGeneId = '-';
                    if (annotationDetails.ensemblGeneId) {
    //                     ensemblGeneId = '<a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g='+annotationDetails.ensemblGeneId+'" target="_blank">'+annotationDetails.ensemblGeneId+'</a>';
                        ensemblGeneId = annotationDetails.ensemblGeneId;
                    }
                    var ensemblTranscriptId = '-';
                    if (annotationDetails.ensemblTranscriptId) {
    //                    ensemblTranscriptId = '<a href="http://www.ensembl.org/Homo_sapiens/transview?transcript='+annotationDetails.ensemblTranscriptId+'" target="_blank">'+annotationDetails.ensemblTranscriptId+'</a>';
                        ensemblTranscriptId = annotationDetails.ensemblTranscriptId;
                    }
                    _consequenceTypeTable += '<tr><td class="variant-view-ensemblGeneId">' + ensemblGeneId + '</td><td class="variant-view-ensemblTranscriptId">' + ensemblTranscriptId + '</td><td class="variant-view-link">' + link + '</td><td class="variant-view-soname">' + this[key].soName + '&nbsp;' + svg + '</td></tr>'
                }, soTerms);

            }, annotation);
            _consequenceTypeTable += '</tbody></table></div></div>'
            return _consequenceTypeTable;
        }).join("");
    },
    _renderConservedRegionData: function (data) {
        var conservedRegionScores = data[0].annotation.conservedRegionScores;
        if (!conservedRegionScores) {
            return '';
        }
        var _conservedRegionTable = '<div class="row"><div class="col-md-8"><table class="table hover">'
        _conservedRegionTable += '<tr><th>Source</th><th>Score</th></tr>'
        _.each(_.keys(conservedRegionScores), function (key) {
            console.log(this[key])
            _conservedRegionTable += '<tr><td>' + this[key].source + '</td><td>' + this[key].score + '</td></tr>'

        }, conservedRegionScores);
        _conservedRegionTable += '</table></div></div>'

        return _conservedRegionTable;
    },
    _createPopulationStatsPanel: function (target, variantData) {
        var _this = this;
        this.defaultToolConfig = {
            headerConfig: {
                baseCls: 'eva-header-2'
            }
        };
        var variantPopulationStatsPanel = new EvaVariantPopulationStatsPanel({
            panelID: variantData.repr ? variantData.repr.replace("/", "_"):'',
            variantAlleles: variantData.repr,
            target: target,
            headerConfig: this.defaultToolConfig.headerConfig,
            handlers: {
                "load:finish": function (e) {
                }
            },
            height: 800

        });

        variantPopulationStatsPanel.load(variantData.sourceEntries, {species: variantData.species},  _this.studiesList);
        variantPopulationStatsPanel.draw();

        return variantPopulationStatsPanel;
    },
    _sortBy : function(name, minor){
        return function (o, p) {
            var a, b;
            if (typeof o === 'object' && typeof p === 'object' && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return typeof minor === 'function' ? minor(o, p) : o;
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
            } else {
                throw {
                    name: 'Error',
                    message: 'Expected an object when sorting by ' + name
                };
            }
        }
    }
}
