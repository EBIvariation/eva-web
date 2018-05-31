/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2017 EMBL - European Bioinformatics Institute
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

function EvadbSNPImportProgress(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EvadbSNPImportProgress");
    _.extend(this, args);
    this.rendered = false;
    this.render();
}
EvadbSNPImportProgress.prototype = {
    render: function () {
        var _this = this;
        _this._draw( _this._createContent());
        $("#dbSNP-import-table").tablesorter();
        //sending tracking data to Google Analytics
        ga('send', 'event', { eventCategory: 'Views', eventAction: 'EvadbSNPImportProgress', eventLabel: 'EvadbSNPImportProgress'});
    },
    _draw: function (content) {
        var _this = this;
        var el = document.querySelector("#" + this.target);
        el.innerHTML = '';
        var elDiv = document.createElement("div");
        $(elDiv).html(content);
        el.appendChild(elDiv);
        el.applyAuthorStyles = true;
    },
    _createContent: function () {
        var _this = this;
        var data;
        EvaManager.get({
            host:DBSNP_HOST,
            version: DBSNP_VERSION,
            category: 'import-status',
            resource: '',
            params:{size:80},
            async: false,
            success: function (response) {
                try {
                    data = response._embedded.importStatus;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        var table =  '<div><h2>Non-human dbSNP Import Status</h2></div>' +
            '<div class="row">' +
                '<div class="col-md-12 columns">'+
                '<p>This report allows you to track the progress of the dbSNP data import.' +
                '<p>' +
                    'Variants will be available in the Variant Browser if they satisfy the <a href="?Submit-Data">EVA submission requirements</a>. ' +
                    'dbSNP variants that don\t satisfy these requirements will still be imported, and searchable via a separate web view and API' +
                    'We will work to make this experience as intuitive as possible, while keeping our commitment to only make high-quality variants part of the core EVA database.' +
                '</p>'+
                '<p>Please check our <a href="?Help#accessionPanel">FAQ</a> for more information about the import process.</p>'+
                '<table id="dbSNP-import-table" class="responsive-table hover tablesorter"><thead>' +
                '<tr>' +
                    '<th>Common name</th>' +
                    '<th>Scientific name</th>' +
                    '<th>Taxonomy ID</th>' +
                    '<th>INSDC assembly accession</th>' +
                    '<th>dbSNP build</th>' +
                    '<th><div title="Supported by evidence means genotypes or frequencies were submitted along with the variant">Current dbSNP IDs supported <br>by evidence searchable</div></th>' +
                    '<th>Current dbSNP <br>IDs searchable</th>' +
                    '<th>Previous dbSNP <br>accessions searchable</th>' +
                '</tr>' +
                '</thead><tbody>';

        data = _.sortBy(data, 'commonName');
        _.each (_.keys(data), function(key) {
            var genbankAssemblyAccession = '-';
            var taxonomy_link;

            if(!_.isNull(this[key].genbankAssemblyAccession)){
                genbankAssemblyAccession = '<a target="_blank" href="https://www.ebi.ac.uk/ena/data/view/'+this[key].genbankAssemblyAccession+'">'+this[key].genbankAssemblyAccession+'</a>';
            }

            if(this[key].taxId){
                taxonomy_link = '<a target="_blank" href="https://www.ebi.ac.uk/ena/data/view/Taxon:'+this[key].taxId+'">'+this[key].taxId+'</a>';
            }

            var variantsWithEvidenceImported = _this._getImportStatus(this[key].variantsWithEvidenceImported, this[key].variantsWithEvidenceImportedDate, '');

            var variantsImported = _this._getImportStatus(this[key].variantsImported, this[key].variantsImportedDate, '');

            var rsSynonymsImported = _this._getImportStatus(this[key].rsSynonymsImported, this[key].rsSynonymsImportedDate,'');

            table += '<tr>' +
                '<td><span class="dbSNP-common-name">'+this[key].commonName+'</span></td>' +
                '<td><span class="dbSNP-scientific-name">'+this[key].scientificName+'</span></td>' +
                '<td><span class="dbSNP-tax-id">'+taxonomy_link+'</span></td>' +
                '<td><span class="dbSNP-assembly-accession">'+genbankAssemblyAccession+'</span></td>' +
                '<td><span class="dbSNP-build">'+this[key].lastDbsnpBuild+'</span></td>' +
                '<td><span class="dbSNP-variants-with-evidence-imported">'+variantsWithEvidenceImported+'</span></td>' +
                '<td><span class="dbSNP-variants-imported">'+variantsImported+'</span></td>' + 
                '<td><span class="dbSNP-rs-imported">'+rsSynonymsImported+'</span></td>' +
                '</tr>';
        }, data);
        table += '</tbody></table></div></div>';
        return table;
    },

    _getImportStatus : function (value,dateString,addLink){
        var el;
        var date = new Date(dateString);
        switch(value) {
            case 'pending':
                el = '<p></p>';
                break;
            case 'in_progress':
                el = '<h6>In progress</h6>';
                break;
            case 'done':
                el = '<h5 class="icon icon-functional" data-icon="/"><span style="visibility: hidden;">Y</span></h5>'
                    + '<h6>' + date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear() + '</h6>';
                break;
            case true:
                el = '<h5 class="icon icon-functional" data-icon="/"><span style="visibility: hidden;">Y</span></h5>';
                break;
            case false:
                el = '<p></p>';
                break;
            default:
                el = '<p><h5 class="icon icon-generic" data-icon="?"><span style="visibility: hidden;">?</span></p>';
        }

        return el;
    }

}
