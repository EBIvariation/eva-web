/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2019 EMBL - European Bioinformatics Institute
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
function EvaMultiVariantView(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAMultiVariantView");
    _.extend(this, args);
    this.rendered = false;
    this.accessionIDs = _.map(decodeURI(this.accessionID).split(","), function trim(x) {return x.trim();});
    this.page = this.page ? this.page: 1;
    //Since the identifier web service does not support multiple identifiers yet,
    //five results at a time seem to provide the best response time
    this.numResultsPerPage = 5;
}

EvaMultiVariantView.prototype = {
    render: function () {
        document.getElementById("navigation-strip").remove();
        if (this.page >= 1) {
            var summaryContent = this._getSummaryContentForIDs(this.accessionIDs, this.page, this.numResultsPerPage);
            var variantViewDiv = document.querySelector("#variantView");
            $(variantViewDiv).addClass('show-div');
            var summaryEl = document.querySelector("#summary-grid");
            var summaryElDiv = document.createElement("div");
            summaryElDiv.innerHTML = summaryContent;
            summaryEl.appendChild(summaryElDiv);

            var pagerDiv = document.createElement("div");
            pagerDiv.innerHTML = this._getPagerContent();
            summaryEl.appendChild(pagerDiv);
        }
    },

    _getSummaryContentForIDs: function(accessionIDs, page, numResultsPerPage) {
        var summaryContent = "";
        var summaryDisplayFields = {id: "ID", assoc_rs: "Associated RS ID", detailedViewURLLink: "Detailed Variant view",
                                    organism : "Organism", assembly: "Assembly", submitterHandle: "Study",
                                    contig: "Chromosome/Contig accession", chromosome: "Chromosome", start: "Start",
                                    end: "End", reference: "Reference", alternate: "Alternate", id: "ID",
                                    type: "Type", evidence: "Allele frequencies / genotypes available?",
                                    assemblyMatch: "Alleles match reference assembly?",
                                    allelesMatch: 'Passed allele checks? <i class="icon icon-generic" data-icon="i">',
                                    validated: '<a id="constant-hyperlink-color" href="https://www.ncbi.nlm.nih.gov/projects/SNP/snp_legend.cgi?legend=validation" target="_blank">Validated?</a>',
                                    createdDate: "Created Date"};
        var variantInfoHeaderRow = null;
        var summaryData = [];

        for (var i = (page - 1) * numResultsPerPage; (i < accessionIDs.length && i < page * numResultsPerPage); i++) {
            var currAccessionID = accessionIDs[i];
            var evaVariantView = new EvaVariantView({
                target:'variantViewContent',
                position:this.position,
                accessionID:currAccessionID,
                species:this.species,
                assemblyAccession: this.assemblyAccession,
                annotationVersion:this.annotationVersion,
                summaryOnly: true
            });

            evaVariantView.initGlobalEnv();
            evaVariantView.storeVariantInfo();
            this.assemblyAccession = evaVariantView.assemblyAccession;

            var array = evaVariantView._getSpeciesOrganismValues(); var organism = array[1];
            summaryData = this._getSummaryContentForVariant(evaVariantView.variant, currAccessionID, organism,
                                                            this.species, this.assemblyAccession,
                                                            summaryDisplayFields, evaVariantView.isHumanSNPSearch,
                                                            evaVariantView.humanSNPLink);

            if (evaVariantView.accessionCategory === "clustered-variants") {
                summaryData = summaryData.map(function(x) {
                                return _.omit(x, [summaryDisplayFields.assoc_rs, summaryDisplayFields.submitterHandle,
                                summaryDisplayFields.end, summaryDisplayFields.reference, summaryDisplayFields.alternate,
                                summaryDisplayFields.evidence, summaryDisplayFields.assemblyMatch,
                                summaryDisplayFields.allelesMatch, summaryDisplayFields.validated]);
                              });
            }

            if (variantInfoHeaderRow == null) {
                variantInfoHeaderRow = evaVariantView._getSummaryTableHeaderRow(summaryDisplayFields, summaryData[0]);
            }
            var variantInfoContentRows = summaryData.map(evaVariantView._getSummaryTableContentRow).join("");
            summaryContent += variantInfoContentRows;
        }

        summaryContent = '<table id="variant-view-summary" class="hover ebi-themed-table" style="font-size: small; table-layout: auto">' +
                            variantInfoHeaderRow + summaryContent + '</table>';
        return summaryContent;
    },

    _getSummaryContentForVariant: function (variant, accessionID, organism, species, assemblyAccession,
                                            summaryDisplayFields, isHumanSNPSearch, humanSNPLink) {
        var rsReference = "";
        if (variant !== undefined && variant.length > 0) {
            if (variant[0].associatedRSID) {
                rsReference = '<a href="'
                                + EvaVariantView.prototype._getAccessionIDNavURL(variant[0].associatedRSID, species, assemblyAccession)
                                + '">' + variant[0].associatedRSID + '</a>';
            }

            var getDetailedViewURL =
                function(accessionID, species, assemblyAccession) {
                    return '<a href="'
                            + EvaVariantView.prototype._getAccessionIDNavURL(accessionID, species, assemblyAccession)
                            + '">Detailed view</a>';
                };
            var detailedViewURLForAccession = getDetailedViewURL(accessionID, species, assemblyAccession);
            summaryData = variant.map(function(x) {
                var summaryDataObj = {};
                summaryDataObj[summaryDisplayFields.id] = x.id;
                summaryDataObj[summaryDisplayFields.assoc_rs] = rsReference;
                summaryDataObj[summaryDisplayFields.detailedViewURLLink] = detailedViewURLForAccession;
                summaryDataObj[summaryDisplayFields.organism] = organism;
                summaryDataObj[summaryDisplayFields.assembly] = EvaVariantView.prototype.getAssemblyLink(x.assemblyAccession);
                summaryDataObj[summaryDisplayFields.submitterHandle] = x.submitterHandle;
                summaryDataObj[summaryDisplayFields.contig] = x.contig;
                summaryDataObj[summaryDisplayFields.chromosome] = x.chromosome;
                summaryDataObj[summaryDisplayFields.start] = x.start;
                summaryDataObj[summaryDisplayFields.end] = x.end;
                summaryDataObj[summaryDisplayFields.reference] = _.escape(x.referenceRepr);
                summaryDataObj[summaryDisplayFields.alternate] = _.escape(x.alternateRepr);
                summaryDataObj[summaryDisplayFields.id] = x.id;
                summaryDataObj[summaryDisplayFields.type] = x.variantTypeLink;
                summaryDataObj[summaryDisplayFields.evidence] = x.evidence;
                summaryDataObj[summaryDisplayFields.assemblyMatch] = x.assemblyMatch;
                summaryDataObj[summaryDisplayFields.allelesMatch] = x.allelesMatch;
                summaryDataObj[summaryDisplayFields.validated] = x.validated;
                summaryDataObj[summaryDisplayFields.createdDate] = x.createdDate;
                return summaryDataObj;
            });
        }
        else {
            var summaryDataEntry = {};
            _.each(_.values(summaryDisplayFields), function(key) {
                if (key == summaryDisplayFields.id) {
                    var humanSNPAdditionalInfo = (isHumanSNPSearch ?
                                                    'See <a href="' + humanSNPLink + '">NCBI data here</a>.'  : '');
                    summaryDataEntry[key] = "<b>No data available in EVA for " + accessionID + ".</b> "
                                                + humanSNPAdditionalInfo;
                }
                else {
                    summaryDataEntry[key] = " ";
                }
            });
            summaryData = [summaryDataEntry];
        }

        return summaryData;
    },

    _getPagerContent: function () {
        var getNavURL = function(accessionIDs, species, assemblyAccession, page)
                                    { return EvaVariantView.prototype._getAccessionIDNavURL(accessionIDs, species, assemblyAccession)
                                                + "&page=" + page;
                                    };

        var prevLink = (this.page > 1) ? getNavURL(this.accessionIDs, this.species, this.assemblyAccession,
                                                    this.page - 1): "";
        var nextLink = "";
        if ((this.page * this.numResultsPerPage) < this.accessionIDs.length) {
            nextLink = getNavURL(this.accessionIDs, this.species, this.assemblyAccession, this.page + 1);
        }

        var prevAnchor = prevLink? '<a href="' + prevLink + '">&lt;&lt; Previous</a>': "";
        var nextAnchor = nextLink? '<a href="' + nextLink + '">Next &gt;&gt;</a>': "";
        var pagerContent = '<span style="float:left">' + prevAnchor + '</span>'
                           + '<span style="float:right">' + nextAnchor + '</span>';

        return pagerContent;
    }
}