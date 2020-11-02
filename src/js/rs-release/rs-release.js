/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2020 EMBL - European Bioinformatics Institute
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

function EvaRsRelease(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EvaRsRelease");
    _.extend(this, args);
    this.render();
}

EvaRsRelease.prototype = {
    render: function() {
        var releaseVersion = $.urlParam('releaseVersion');
        if (!releaseVersion) {
            this.updateUrl({releaseVersion: 2})
            releaseVersion = 2;
        }

        this.draw(this.createContent(releaseVersion))
        $("#rs-release-table").tablesorter({ sortList: [[2,1]] });
    },

    draw: function (content) {
        var rsReleaseElement = document.querySelector("#" + this.target);
        rsReleaseElement.innerHTML = '';
        var rsReleaseDiv = document.createElement("div");
        $(rsReleaseDiv).html(content);
        rsReleaseElement.appendChild(rsReleaseDiv);
    },

    createContent: function (releaseVersion) {
        var releaseData;
        EvaManager.get({
            host:EVA_RELEASE_HOST,
            version: EVA_VERSION,
            category: 'stats',
            resource: 'per-species',
            params: {releaseVersion: releaseVersion},
            async: false,
            success: function (response) {
                try {
                    releaseData = response;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        var releaseInfo;
        EvaManager.get({
            host:EVA_RELEASE_HOST,
            version: EVA_VERSION,
            category: 'info',
            params: {releaseVersion: releaseVersion},
            async: false,
            success: function (response) {
                try {
                    releaseInfo = response[0];
                } catch (e) {
                    console.log(e);
                }
            }
        });

        var table = '<div><h2>Clustered variants (RS) Release</h2></div>' +
                    '<div class="callout success">' +
                        '<p>' +
                            'The RS ID release (v.' + releaseVersion + ') is now available in our FTP. ' +
                            '<a href="' + releaseInfo.releaseFtp +'" target="_blank">[View release]</a>' +
                        '</p>' +
                    '</div>' +
                    '<p>' + releaseInfo.releaseDescription + '</p>' +
                    '<table id="rs-release-table" class="responsive-table hover tablesorter table-fixed">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Scientific name</th>' +
                                '<th>Taxonomy ID</th>' +
                                '<th><div title="RS IDs that can be browsed on the EVA websites">Current RS</div></th>' +
                                '<th><div title="RS IDs that are resolved to multiple location on the genome">Multi-mapped RS</div></th>' +
                                '<th><div title="RS IDs that should NOT be used because they are merged into another active RS">Merged RS</div></th>' +
                                '<th><div title="RS IDs that should NOT be used since these RS IDs were deprecated">Deprecated RS</div></th>' +
                                '<th><div title="RS IDs that should NOT be used because they have been merged into a deprecated RS">Merged Deprecated RS</div></th>' +
                                '<th><div title="RS IDs that could NOT be mapped against an assembly">Unmapped RS</div></th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>';

        _.each(releaseData, function (species) {
            var scientificNameNormalized = species.scientificName.toLowerCase().replace(' ', '_');
            releaseLink = '<a target="_blank" href="ftp://ftp.ebi.ac.uk/pub/databases/eva/rs_releases/release_2/by_species/' + scientificNameNormalized + '">' + species.scientificName + '</a>';
            taxonomyLink = '<a target="_blank" href="https://www.ebi.ac.uk/ena/data/view/Taxon:' + species.taxonomyId + '">' + species.taxonomyId + '</a>';

            table +=        '<tr>' +
                                '<td><span class="rs-release-scientific-name">' + releaseLink + '</span></td>' +
                                '<td><span class="rs-release-tax-id">' + taxonomyLink + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.currentRs.toLocaleString() + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.multiMappedRs.toLocaleString() + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.mergedRs.toLocaleString() + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.deprecatedRs.toLocaleString() + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.mergedDeprecatedRs.toLocaleString() + '</span></td>' +
                                '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.unmappedRs.toLocaleString() + '</span></td>' +
                            '</tr>';
        })

        table +=        '</tbody>' +
                    '</table>';
        return table
    },

    updateUrl: function (values) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + 'RS-Release&' + $.param(values);
        history.pushState('', '', newUrl);
    }
}