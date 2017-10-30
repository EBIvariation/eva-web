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
var summary = {};
var files = [];
function EvaStudyView(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAStudyView");
    this.type = 'eva';
    this.projectId = 'PRJEB5473';
    _.extend(this, args);
    this.rendered = false;
    this.render();
}
EvaStudyView.prototype = {
    render: function () {
        var _this = this;
        var params = {};

        if (this.type === 'dgva') {
            var params = {structural: 'true'};
        }

        EvaManager.get({
            category: 'studies',
            resource: 'summary',
            query: this.projectId,
            params: params,
            async: false,
            success: function (response) {
                try {
                    summary = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        if (this.type === 'eva') {
            var studySpeciesList = '';
            EvaManager.get({
                category: 'meta/species',
                resource: 'list',
                async: false,
                success: function (response) {
                    try {
                        studySpeciesList = response.response[0].result;
                    } catch (e) {
                        console.log(e);
                    }
                }
            });

            var speciesCode;
            var filesParams;
            var GRCh38_studies = ['PRJEB15197', 'PRJEB15198', 'PRJEB15384'];
            if (!_.isUndefined(_.findWhere(studySpeciesList, {taxonomyScientificName: summary[0].speciesScientificName}))) {
                //TO BE REMOVED temp fix
                if(summary[0].speciesCommonName  == 'Human' && _.indexOf(GRCh38_studies, summary[0].id) < 0){
                    speciesCode = 'hsapiens_grch37';
                    _.extend(summary[0],{assemblyAccession:'GCA_000001405.1'});
                }else {
                    speciesCode = _.findWhere(studySpeciesList, {taxonomyScientificName: summary[0].speciesScientificName}).taxonomyCode + '_' + _.findWhere(studySpeciesList, {taxonomyScientificName: summary[0].speciesScientificName}).assemblyCode;
                    _.extend(summary[0], {assemblyAccession: _.findWhere(studySpeciesList, {taxonomyScientificName: summary[0].speciesScientificName}).assemblyAccession});
                }
                filesParams = {species: speciesCode};
            } else {
                filesParams = {species: ''};
            }

            if(!_.isEmpty(filesParams.species)){
                EvaManager.get({
                    category: 'studies',
                    resource: 'files',
                    query: this.projectId,
                    params: filesParams,
                    async: false,
                    success: function (response) {
                        try {
                            files = response.response[0].result;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }

        }
        _this._parseData();

        //sending tracking data to Google Analytics
        ga('send', 'event', { eventCategory: 'Views', eventAction: 'Study', eventLabel: this.projectId});
    },
    _draw: function (data, content) {
        var _this = this;
        var el = document.querySelector("#" + this.target);
        el.innerHTML = '';
        var elDiv = document.createElement("div");
        $(elDiv).html(content);
        el.appendChild(elDiv);
        el.applyAuthorStyles = true;
    },
    _parseData: function (data) {
        var _this = this;
        var data = {};
        var divContent = '';
        if (_.isEmpty(summary) == false && this.type === 'eva') {
            data = {summaryData: summary, filesData: files }
            divContent = _this._createContent(data)
        } else if (_.isEmpty(summary) == false && this.type === 'dgva') {
            data = {summaryData: summary }
            divContent = _this._createContent(data)
        }
        _this._draw(data, divContent);

    },
    _createContent: function (data) {
        var _this = this;
        var publications = data.summaryData[0].publications;
        var pubLinks = '';
        if(!_.isEmpty(publications) && publications != '-'){
            for (i = 0; i < publications.length; i++) {
                pubLinks += '<a class="pubmed-id" href="http://www.ncbi.nlm.nih.gov/pubmed/?term=' + publications[i] + '" target="_blank">' + publications[i]  + '</a><br />'
            }
        }else{
            pubLinks = '<span class="pubmed-id">-</span>';
        }

        if (_this.type === 'eva') {

            var taxonomyId = new Array();
            if (data.summaryData[0].taxonomyId) {
                for (i = 0; i < data.summaryData[0].taxonomyId.length; i++) {
                    var taxLink = 'http://www.ebi.ac.uk/ena/data/view/Taxon:' + data.summaryData[0].taxonomyId[i];
                    taxonomyId.push(['<a href="' + taxLink + '" target="_blank">' + data.summaryData[0].taxonomyId[i] + '</a>']);
                }
            }

            var projectURL = '-' ;
            var ena_link = '<a id="ena_link" href="http://www.ebi.ac.uk/ena/data/view/' + data.summaryData[0].id + '" target="_blank">Submitted Files</a>';
            var eva_link = '';
            if (data.summaryData[0].browsable) {
                eva_link = '<a id="eva_link" href="ftp://ftp.ebi.ac.uk/pub/databases/eva/' + data.summaryData[0].id + '" target="_blank">Browsable Files</a>';
            }

            if (!_.isUndefined(_this._getProjectUrl(data.summaryData[0].id)) && _this._getProjectUrl(data.summaryData[0].id) != '-') {
                projectURL = '<a href="' + _this._getProjectUrl(data.summaryData[0].id) + '" target="_blank">' + _this._getProjectUrl(data.summaryData[0].id) + '</a><br />';
            }

            var assembly_link= '-';
            if(!_.isUndefined(data.summaryData[0].assemblyAccession)){
               assembly_link = '<a href="http://www.ebi.ac.uk/ena/data/view/'+data.summaryData[0].assemblyAccession+'" target="_blank">'+data.summaryData[0].assemblyAccession+'<a>';
            }

            var _filesTable = '<div><h3>' + data.summaryData[0].name + '</h3>' +
                '<span class="row study-view-data"><div class="medium-12 columns"><div><h4>General Information</h4></div><table id="summaryTable" class="table table-bordered study-view-table">' +
                '<thead><tr><th class="col-name"></th><th class="col-value"></th></tr></thead><tbody>' +
                '<tr><td><b>Genome</b></td><td><span id="organism-span">' + data.summaryData[0].speciesCommonName + '</span></td></tr>' +
                '<tr><td><b>Sample(s)</b></td><td><span id="scientific-name-span">' + data.summaryData[0].speciesScientificName + '</span></td></tr>' +
                '<tr><td><b>Taxonomy ID</b></td><td><span id="taxonomy-id-span">' + taxonomyId.join() + '</span></td></tr>' +
                '<tr><td><b>Center</b></td><td><span id="center-span">' + data.summaryData[0].center + '</span></td></tr>' +
                '<tr><td><b>Material</b></td><td><span id="material-span">' + data.summaryData[0].material + '</span></td></tr>' +
                '<tr><td><b>Scope</b></td><td><span id="scope-span">' + data.summaryData[0].scope + '</span></td></tr>' +
                '<tr><td><b>Type</b></td><td><span id="type-span">' + data.summaryData[0].experimentType + '</span></td></tr>' +
                '<tr><td><b>Genome Assembly</b></td><td><span id="assembly-span">' + assembly_link + '</span></td></tr>' +
                '<tr><td><b>Source Type</b></td><td><span id="source-type-span">' + data.summaryData[0].sourceType + '</span></td></tr>' +
                '<tr><td><b>Platform</b></td><td><span id="platform-span">' + data.summaryData[0].platform + '</span></td></tr>' +
                '<tr><td><b>Number of samples</b></td><td><span id="samples-span">' + data.summaryData[0].numSamples + '</span></td></tr>' +
                '<tr><td><b>Description</b></td><td><span id="description-span">' + data.summaryData[0].description + '</span></td></tr>' +
                '<tr><td><b>Resource</b></td><td><span id="resource-span">' + projectURL + '</div></td></tr>' +
                '<tr><td><b>Download</b></td><td><span id="download-span">'+ena_link+'<br /><br />'+eva_link+'</span></td></tr>' +
                '<tr><td><span><b>Publications</b></span></td><td>'+pubLinks+'</tr>' +
                '</tbody></table>'

            if (data.filesData.length > 0) {
                var fileNameArr = [];

                for (i = 0; i < data.filesData.length; i++) {
                    var fileName = files[i].fileName;
                    var regex = /_accessioned.vcf/g;
                    if (fileName.match(regex)) {
                        _.extend(data.filesData[i], {ftpId: fileName.replace(regex, ".vcf.gz")});
                        fileNameArr.push(fileName.replace(regex, ".vcf.gz"));
                    } else {
                        fileNameArr.push(fileName)
                    }
                }
                var fileNameList = fileNameArr.join(',');
                var ftpLink = {};
                EvaManager.get({
                    category: 'files',
                    resource: 'url',
                    query: fileNameList,
                    async: false,
                    success: function (response) {
                        try {
                            ftpLink = response.response;

                        } catch (e) {
                            console.log(e);
                        }
                    }
                });

                if (!_.isUndefined(ftpLink)) {

                    _filesTable += '<div><h4>Files</h4></div><table id="filesTable" class="table table-striped"><thead><tr>' +
                        '<th>File Name</th>' +
                        '<th>Samples with Genotypes</th>' +
                        '<th>Variants Count</th>' +
                        '<th>SNP Count</th>' +
                        '<th>Indel Count</th>' +
                        '<th>Pass Count</th>' +
                        '<th>Transitions/Transversions Ratio</th>' +
                        '<th>Mean Quality</th>' +
//                    '<th>View</th>' +
                        '</tr></thead><tbody>'
                    for (i = 0; i < data.filesData.length; i++) {
                        var ftpLocation = '';
                        var downloadLink = data.filesData[i].fileName;
                        if (!_.isUndefined(_.findWhere(ftpLink, {id: data.filesData[i].fileName}))) {
                            ftpLocation = _.findWhere(ftpLink, {id: data.filesData[i].fileName}).result[0];
                        }
                        if (ftpLink.length > 0 && ftpLocation != 'ftp:/null' && !_.isEmpty(ftpLocation)) {
                            downloadLink = '<a href="' + ftpLocation + '" target="_blank">' + data.filesData[i].fileName + '</a>';
                        }
                        var samples_count;
                        var variantsCount;
                        var snpsCount;
                        var indelsCount;
                        var passCount;
                        var transitionsCount;
                        var meanQuality;
                        if (!_.isUndefined(data.filesData[i].stats) && !_.isNull(data.filesData[i].stats)) {
                            if (data.filesData[i].stats.samplesCount) {
                                samples_count = data.filesData[i].stats.samplesCount;
                            } else {
                                samples_count = 'NA';
                            }
                            variantsCount = data.filesData[i].stats.variantsCount;
                            snpsCount = data.filesData[i].stats.snpsCount;
                            indelsCount = data.filesData[i].stats.indelsCount;
                            passCount = data.filesData[i].stats.passCount;
                            transitionsCount = (data.filesData[i].stats.transitionsCount / data.filesData[i].stats.transversionsCount).toFixed(2) + '&nbsp;(' + data.filesData[i].stats.transitionsCount + '/' + data.filesData[i].stats.transversionsCount + ')';
                            if(!isNaN(data.filesData[i].stats.meanQuality)){
                                meanQuality = data.filesData[i].stats.meanQuality.toFixed(2);
                            }else{
                                meanQuality = 'NA';
                            }
                        } else {
                            samples_count = 'NA';
                            variantsCount = 'NA';
                            snpsCount = 'NA';
                            indelsCount = 'NA';
                            passCount = 'NA';
                            transitionsCount = 'NA';
                            meanQuality = 'NA';
                        }

                        _filesTable += '<tr>' +
                            '<td class="link">' + downloadLink + '</td>' +
                            '<td><span class="samples_count">' + samples_count + '</span></td>' +
                            '<td><span class="variants_ount">' + variantsCount + '</span></td>' +
                            '<td><span class="snps_count">' + snpsCount + '</span></td>' +
                            '<td><span class="indels_count">' + indelsCount + '</span></td>' +
                            '<td><span class="pass_count">' + passCount + '</span></td>' +
                            '<td><span class="transition_count">' + transitionsCount + '</span></td>' +
                            '<td><span class="mean_count">' + meanQuality + '</span></td>' +
                            '</tr>'
                    }
                    _filesTable += '</tbody></table>'
                }


            }
            _filesTable += '</div></div>'
        }
        else if (_this.type === 'dgva') {
            var taxonomyId = new Array();

            if (data.summaryData[0].taxonomyId) {
                for (i = 0; i < data.summaryData[0].taxonomyId.length; i++) {
                    var taxLink = 'http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + data.summaryData[0].taxonomyId[i];
                    taxonomyId.push(['<a href="' + taxLink + '" target="_blank">' + data.summaryData[0].taxonomyId[i] + '</a>']);
                }
            }

            var _filesTable = '<div><h3>' + data.summaryData[0].name + '</h3>' +
                '<div class="row study-view-data"><div class="medium-12 columns"><div><h4>General Information</h4></div><table id="summaryTable" class="table table-bordered  study-view-table">' +
                '<thead><tr><th class="col-name"></th><th class="col-value"></th></tr></thead><tbody>' +
                '<tr><td><b>Genome</b></td><td class="eva-capitalize"><span id="organism-span">' + data.summaryData[0].speciesCommonName + '</span></td></tr>' +
                '<tr><td><b>Sample(s)</b></td><td><span id="scientific-name-span">' + data.summaryData[0].speciesScientificName + '</span></td></tr>' +
                '<tr><td><b>Taxonomy ID</b></td><td><span id="taxonomy-id-span">' + taxonomyId.join() + '</span></td></tr>' +
                '<tr><td><b>Study Type</b></td><td><span id="study-type-span">' + data.summaryData[0].typeName + '</span></td></tr>' +
                '<tr><td><b>Experiment Type</b></td><td><span id="exp-type-span">' + data.summaryData[0].experimentType + '</span></td></tr>' +
                '<tr><td><b>Platform</b></td><td><span id="platform-span">' + data.summaryData[0].platform + '</span></td></tr>' +
                '<tr><td><b>Genome Assembly</b></td><td><span id="assembly-span">' + data.summaryData[0].assembly + '</span></td></tr>' +
                '<tr><td><b>Number of Variants</b></td><td><span id="variants-span">' + data.summaryData[0].numVariants + '</span></td></tr>' +
                '<tr><td><b>Description</b></td><td><span id="description-span">' + data.summaryData[0].description + '</span></td></tr>' +
                '<tr><td><b>Download</b></td><td><span id="download-span"><a href="ftp://ftp.ebi.ac.uk/pub/databases/dgva/' + data.summaryData[0].id + '_' + data.summaryData[0].name + '" target="_blank">FTP</a></span></td></tr>' +
                '<tr><td><span><b>Publications</b></span></td><td>'+pubLinks+'</tr>' +
                '</tbody></table></div></div>'

        }

        return _filesTable;
    },
    _getProjectUrl: function (data) {
        var _this = this;
        var projects = getProjects();
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].id === data) {
                return projects[i].url;
            }
        }
    }

}


