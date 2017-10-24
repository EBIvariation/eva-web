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
            host:'http://ves-ebi-f8.ebi.ac.uk:8080/dbsnp/webservices/rest',
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
            '<div><table id="dbSNP-import-table" class="responsive-table hover tablesorter"><thead>' +
            '<tr>' +
            '<th>Common name</th>' +
            '<th>Scientific name</th>' +
            '<th>Taxonomy ID</th>' +
            '<th>INSDC assembly accession</th>' +
            '<th>dbSNP build</th>' +
            '<th>Supported by Ensembl</th>' +
            '<th>Suitable for Variant Browser</th>' +
            '<th>All variants match<br>INSDC assembly</th>' +
            '<th>Current dbSNP <br>accessions searchable</th>' +
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

            var assemblyFullyMatches = _this._getImportStatus(this[key].assemblyFullyMatches,'','');

            var inEnsembl = _this._getImportStatus(this[key].inEnsembl,'','');

            var toVariantWarehouse = _this._getImportStatus(this[key].toVariantWarehouse,'',true);

            var variantsImported = _this._getImportStatus(this[key].variantsImported, this[key].variantsImportedDate, '');

            var rsSynonymsImported = _this._getImportStatus(this[key].rsSynonymsImported, this[key].rsSynonymsImportedDate,'');

            table += '<tr>' +
                '<td><span class="dbSNP-common-name">'+this[key].commonName+'</span></td>' +
                '<td><span class="dbSNP-scientific-name">'+this[key].scientificName+'</span></td>' +
                '<td><span class="dbSNP-tax-id">'+taxonomy_link+'</span></td>' +
                '<td><span class="dbSNP-assembly-accession">'+genbankAssemblyAccession+'</span></td>' +
                '<td><span class="dbSNP-build">'+this[key].lastDbsnpBuild+'</span></td>' +
                '<td><span class="dbSNP-in-ensembl">'+inEnsembl+'</span></td>' +
                '<td><span class="dbSNP-to-variant-warehouse">'+toVariantWarehouse+'</span></td>' +
                '<td><span class="dbSNP-assembly-matches">'+assemblyFullyMatches+'</span></td>' +
                '<td><span class="dbSNP-variants-imported">'+variantsImported+'</span></td>' +
                '<td><span class="dbSNP-rs-imported">'+rsSynonymsImported+'</span></td>' +
                '</tr>';
        }, data);
        table += '</tbody></table></div>';
        return table;
    },

    _getImportStatus : function (value,date,addLink){
        var el;
        switch(value) {
            case 'pending':
                el = '<p></p>';
                break;
            case 'in_progress':
                el = '<h6>In Progress<<h6>';
                break;
            case 'done':
                el = '<h5 class="icon icon-functional" data-icon="/"><span style="visibility: hidden;">Y</span>&nbsp;&nbsp;'+date+'</h5>';
                break;
            case true:
                el = '<h5 class="icon icon-functional" data-icon="/"><span style="visibility: hidden;">Y</span></h5>';
                break;
            case false:
                el = '<h5 class="icon icon-functional" data-icon="x"><span style="visibility: hidden;">N</span></h5>';
                if(addLink){
                    el = '<h5 class="icon icon-functional" data-icon="x"><span style="visibility: hidden;">N</span><span style="font-size: 10px;"><a href="?Help#accession-Panel&link=collapse22">Why?</a></span></h5>';
                }
                break;
            default:
                el = '<p></p>';
        }

        return el;
    }

}