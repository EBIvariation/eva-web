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
        $("#dbSNP-import-table").tablesorter({ sortList: [[5,1], [0,0]] });
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
            async: false,
            success: function (response) {
                try {
                    data = response;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        var table =  '<div><h2>dbSNP Import Status</h2></div>' +
            '<div class="row">' +
                '<div class="col-md-12 columns">' +
                '<div class="callout success">' +
                    '<p>' +
                        'The RS ID release (v.1) for variants imported from dbSNP is now available in our FTP. ' +
                        '<a href="https://ftp.ebi.ac.uk/pub/databases/eva/rs_releases/release_1/" target="_blank">[View release]</a>' +
                    '</p>' +
                '</div>' +
                '<p>This report allows you to track the progress of the dbSNP data import.</p>' +
                '<p>' +
                    'Variants will be available in the Variant Browser if they satisfy the <a href="?Submit-Data">EVA submission requirements</a>. ' +
                    'dbSNP variants that don\'t satisfy these requirements will still be imported, and searchable via a separate ' +
                    '<a href="?Home">web view</a> and <a href="https://www.ebi.ac.uk/eva/webservices/identifiers/swagger-ui.html">API</a>, ' +
                    'and downloadable from our <a href="https://ftp.ebi.ac.uk/pub/databases/eva/rs_releases/">FTP</a>. ' +
                    'Variants that don\'t map to any INSDC assembly are present only in our FTP at the moment. ' +
                    'We will work to make this experience as intuitive as possible, while keeping our commitment to only make high-quality variants part of the core EVA database.' +
                '</p>'+
                '<p>' +
                    'In addition to the most recent RS IDs available for a given species, ' + 
                    'older RS IDs that were merged into the newer ones will also be imported to support reproducible analyses based on historical data.' +
                '</p>' +
                '<p>Please check our <a href="?Help#accessionPanel">FAQ</a> for more information about the import process.</p>'+
                '<h3>Notes</h3>' +
                '<h4>Non-human</h4>' +
                '<p>' +
                    'Some species are not associated to any build in the report below. The available ' +
                    'variants in dbSNP for those species don\'t map to any assembly.' +
                '</p>' +
                '<h4>Human</h4>' +
                'Human RS IDs have been imported into EVA: 666,772,339 RS IDs out of 666,783,996 (shown as 99.99%):' +
                '<ul>' +
                    '<li>7,941 could not be imported because they did not have mappings on grch38</li>' +
                    '<li>3,716 could not be imported because they did not have top-level placement confirmation ' +
                        '(i.e., locus could not be definitively identified).</li>' +
                '</ul>' +
                '<p>We will make those RS IDs <b>publicly searchable at EVA in the near future</b>.</p>' +
                '<p>' +
                    'No Human SS IDs were imported due to absence of batch handles in the <a href="https://ftp.ncbi.nih.gov/snp/latest_release/JSON">dbSNP JSON data release</a> ' +
                    '(meaning a batch cannot be uniquely identified with just the submitter handle).' +
                '</p>' +
                '<table id="dbSNP-import-table" class="responsive-table hover tablesorter table-fixed"><thead>' +
                '<tr>' +
                    '<th rowspan="2">Common name</th>' +
                    '<th rowspan="2">Scientific name</th>' +
                    '<th rowspan="2">Taxonomy ID</th>' +
                    '<th rowspan="2">INSDC assembly accession</th>' +
                    '<th rowspan="2">dbSNP build</th>' +
                    '<th rowspan="2"><div title="RS IDs available at EVA (web or FTP) from the last dbSNP build for a species">RS IDs <i class="icon icon-generic" data-icon="i"></div></th>' +
                    '<th rowspan="2"><div title="SS IDs available at EVA (web or FTP) from the last dbSNP build for a species">SS IDs <i class="icon icon-generic" data-icon="i"></div></th>' +
                '</tr>' +
                '</thead><tbody>';

        _.each (_.keys(data), function(key) {
            var genbankAssemblyAccession = '-';
            var taxonomy_link;

            if(this[key].genbankAssemblyAccession) {
                genbankAssemblyAccession = '<a target="_blank" href="https://www.ebi.ac.uk/ena/browser/view/' + this[key].genbankAssemblyAccession + '">' + this[key].genbankAssemblyAccession + '</a>';
            }
            
            if(this[key].taxId) {
                taxonomy_link = '<a target="_blank" href="https://www.ebi.ac.uk/ena/data/browser/Taxon:' + this[key].taxId + '">' + this[key].taxId + '</a>';
            }

            if (this[key].lastDbsnpBuild > 0) {
                lastDbsnpBuild = this[key].lastDbsnpBuild;
            } else {
                lastDbsnpBuild = "-";
            }
            var importedRs = _this._getImportStatus(this[key].importedRs, this[key].totalRsDbsnp);
            var importedSs = _this._getImportStatus(this[key].importedSs, this[key].totalSsDbsnp);

            table += '<tr>' +
                '<td><span class="dbSNP-common-name">' + this[key].commonName + '</span></td>' +
                '<td><span class="dbSNP-scientific-name">' + this[key].scientificName + '</span></td>' +
                '<td><span class="dbSNP-tax-id">' + taxonomy_link + '</span></td>' +
                '<td><span class="dbSNP-assembly-accession">' + genbankAssemblyAccession + '</span></td>' +
                '<td><span class="dbSNP-build">' + lastDbsnpBuild + '</span></td>' +
                '<td><span class="dbSNP-imported-rs">' + importedRs + '</span></td>' +
                '<td><span class="dbSNP-imported-ss">' + importedSs + '</span></td>' +
                '</tr>';
        }, data);
        table += '</tbody></table></div></div>';
        return table;
    },

    _getImportStatus : function (importedIds, totalIds) {
        var indicator;
        var percentage;
        var proportion;
        var progress;
        if(importedIds && totalIds) {
            // truncate the proportion to 4 decimals, to be showed as a percentage with 2 decimals
            proportion = Math.floor((importedIds / totalIds) * 10000) / 10000;
            progress = importedIds.toLocaleString() + ' / ' + totalIds.toLocaleString();
        } else if(totalIds) {
            proportion = 0;
            progress = '0 / ' + totalIds.toLocaleString();
        } else {
            proportion = 0;
            progress = '0 / 0';
        }
        percentage = proportion.toLocaleString(undefined, {style: 'percent', maximumFractionDigits: 2});

        indicator = '<a title="' + progress + '" class="percentage-indicator">' + percentage + '</a>';
        return indicator;
    }

}
