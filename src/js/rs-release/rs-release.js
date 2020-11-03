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
            releaseVersion = this.getLatestReleaseVersion();
            this.updateUrl({releaseVersion: releaseVersion})
        }

        this.draw(this.createContent(releaseVersion))
        $("#rs-release-table").tablesorter({ sortList: [[2,1]] });
        $("#rs-release-table-new-data").tablesorter({ sortList: [[2,1]] });
        $(document).foundation();
    },

    draw: function (content) {
        var rsReleaseElement = document.querySelector("#" + this.target);
        rsReleaseElement.innerHTML = '';
        var rsReleaseDiv = document.createElement("div");
        $(rsReleaseDiv).html(content);
        rsReleaseElement.appendChild(rsReleaseDiv);
    },

    createContent: function (releaseVersion) {
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

        var content = '<div><h2>Clustered variants (RS) Release</h2></div>' +
                    '<div class="callout success">' +
                        '<p>' +
                            this.formatDate(releaseInfo.releaseDate) + ': The RS Release ' + releaseVersion + ' is available in our FTP. ' +
                            '<a href="' + releaseInfo.releaseFtp +'" target="_blank">[View release]</a>' +
                        '</p>' +
                    '</div>' +
                    '<p>' + releaseInfo.releaseDescription + '</p>' +
                    '<div>';

        content +=  '<ul class="accordion" data-accordion data-allow-all-closed="true">' +
                        '<li class="accordion-item" data-accordion-item>' +
                            '<a href="#" class="accordion-title">New in RS Release ' + releaseVersion + '</a>' +
                            '<div class="accordion-content" data-tab-content>';

        content += this.createWhatsNewContent(releaseVersion);

        content +=          '</div>' +
            '           </li>' +
                        '<li class="accordion-item" data-accordion-item>' +
                            '<a href="#" class="accordion-title">All RS Release Data</a>' +
                            '<div class="accordion-content" data-tab-content>';

        content += this.createReleaseDataTable(releaseVersion);

        content +=          '</div>' +
                        '</li>' +
                    '</ul>';
        return content;
    },

    formatDate: function(isoDate) {
        var date =  new Date(isoDate);
        var month = date.getMonth() + 1;
        return date.getDate() + '/' + month + '/' + date.getFullYear();
    },

    createReleaseDataTable: function(releaseVersion) {
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

        var table = '<table id="rs-release-table" class="responsive-table hover tablesorter table-fixed">' +
                    '<thead>' +
                    '<tr>' +
                        '<th>Scientific name</th>' +
                        '<th>Taxonomy ID</th>' +
                        '<th><div title="RS IDs that can be browsed on the EVA websites">Current RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                        '<th><div title="RS IDs that are resolved to multiple location on the genome">Multi-mapped RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                        '<th><div title="RS IDs that should NOT be used because they are merged into another active RS">Merged RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                        '<th><div title="RS IDs that should NOT be used since these RS IDs were deprecated">Deprecated RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                        '<th><div title="RS IDs that should NOT be used because they have been merged into a deprecated RS">Merged Deprecated RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                        '<th><div title="RS IDs that could NOT be mapped against an assembly">Unmapped RS <i class="icon icon-generic" data-icon="i"></div></th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';

        _.each(releaseData, function (species) {
            releaseLink = '<a target="_blank" href="' + species.releaseLink + '">' + species.scientificName + '</a>';
            taxonomyLink = '<a target="_blank" href="' + species.taxonomyLink + '">' + species.taxonomyId + '</a>';

            table += '<tr>' +
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

        table +=    '</tbody></table>';
        return table;
    },

    createWhatsNewContent: function(releaseVersion) {
        var newDataReleased;
        EvaManager.get({
            host:EVA_RELEASE_HOST,
            version: EVA_VERSION,
            category: 'stats',
            resource: 'per-species/new',
            params: {releaseVersion: releaseVersion},
            async: false,
            success: function (response) {
                try {
                    newDataReleased = response;
                } catch (e) {
                    console.log(e);
                }
            }
        });

        var table = '<table id="rs-release-table-new-data" class="responsive-table hover tablesorter table-fixed">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>Scientific name</th>' +
                                '<th>Taxonomy ID</th>' +
                                '<th><div title="RS IDs that were created in this release">New RS IDs <i class="icon icon-generic" data-icon="i"></div></th>' +
                                '<th><div title="SS id that were clustered in this release under an new or existing RS id">New SS IDs Clustered <i class="icon icon-generic" data-icon="i"></div></th>' +
                            '</tr>' +
                        '</thead>' +
                    '<tbody>';

        _.each(newDataReleased, function (species) {
            releaseLink = '<a target="_blank" href="' + species.releaseLink + '">' + species.scientificName + '</a>';
            taxonomyLink = '<a target="_blank" href="' + species.taxonomyLink + '">' + species.taxonomyId + '</a>';

            table += '<tr>' +
                        '<td><span class="rs-release-scientific-name">' + releaseLink + '</span></td>' +
                        '<td><span class="rs-release-tax-id">' + taxonomyLink + '</span></td>' +
                        '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.newCurrentRs.toLocaleString() + '</span></td>' +
                        '<td class="numerical-column-right-align"><span class="rs-release-current-rs">' + species.newSsClustered.toLocaleString() + '</span></td>' +
                     '</tr>';
        })

        table +=    '</tbody></table>';
        return table;
    },

    updateUrl: function (values) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + 'RS-Release&' + $.param(values);
        history.pushState('', '', newUrl);
    },

    getLatestReleaseVersion: function () {
        var latestReleaseVersion;
        EvaManager.get({
            host:EVA_RELEASE_HOST,
            version: EVA_VERSION,
            category: 'info',
            resource: 'latest',
            async: false,
            success: function (response) {
                try {
                    latestReleaseVersion = response.releaseVersion;
                } catch (e) {
                    console.log(e);
                }
            }
        });
        return latestReleaseVersion;
    }
}