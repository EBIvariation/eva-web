/*
 *
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 - 2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

DBSNP_HOST = "https:" + "//@@DBSNP_HOST";
DGVA_HOST = "https:" + "//@@DGVA_HOST";
EVA_HOST = "https:" + "//@@EVA_HOST";
EVA_RELEASE_HOST = "https:" + "//@@EVA_RELEASE_HOST";
EVA_ACCESSIONING_HOST = "https:" + "//@@EVA_ACCESSIONING_HOST";
EVA_VCF_DUMPER_HOST = "https:" + "//@@EVA_VCF_DUMPER_HOST";

DBSNP_VERSION = '@@DBSNP_VERSION';
DGVA_VERSION = '@@DGVA_VERSION';
EVA_VERSION = '@@EVA_VERSION';
EVA_STAT_VERSION = '@@EVA_STAT_VERSION';

var EvaManager = {
    host: EVA_HOST,
    accessioning_host: EVA_ACCESSIONING_HOST,
    version: EVA_VERSION,
    getAPICallResult: function(url, apiResultType, errorHandler) {
          var d;
          $.ajax({
                      type: 'GET',
                      url: url,
                      dataType: apiResultType,
                      async: false,
                      success: function (data, textStatus, jqXHR) {
                              d = data;
                      },
                      error: errorHandler
                  });
            return d;
    },
    get: function (args) {
        var success = args.success;
        var error = args.error;
        var async = (_.isUndefined(args.async) || _.isNull(args.async) ) ? true : args.async;
        var urlConfig = _.omit(args, ['success', 'error', 'async']);

        var url = EvaManager.url(urlConfig);
        if (typeof url === 'undefined') {
            return;
        }
        console.log(url);

        var d;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',//still firefox 20 does not auto serialize JSON, You can force it to always do the parsing by adding dataType: 'json' to your call.
            async: async,
            success: function (data, textStatus, jqXHR) {
                if ($.isPlainObject(data) || $.isArray(data)) {
                    if (args.query) data.query = args.query;
                    if (_.isFunction(success)) success(data);
                    d = data;
                } else {
                    console.log('Eva returned a non json object or list, please check the url.');
                    console.log(url);
                    console.log(data)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("EvaManager: Ajax call returned : " + errorThrown + '\t' + textStatus + '\t' + jqXHR.statusText + " END");
                if (_.isFunction(error)) error(jqXHR, textStatus, errorThrown);
            }
        });
        return d;
    },
    url: function (args) {
        if (!$.isPlainObject(args)) args = {};
        if (!$.isPlainObject(args.params)) args.params = {};

        var version = this.version;
        if (typeof args.version !== 'undefined' && args.version != null) {
            version = args.version
        }

        var host = this.host;
        if (typeof args.host !== 'undefined' && args.host != null) {
            host = args.host;
        }
        if (args.service === ACCESSIONING_SERVICE) {
            host = this.accessioning_host;
        }

        delete args.host;
        delete args.version;

        var config = {
            host: host,
            version: version
        };

        var params = {
        };

        _.extend(config, args);
        _.extend(config.params, params);

        var query = '';
        if (typeof config.query !== 'undefined' && config.query != null) {
            if ($.isArray(config.query)) {
                config.query = config.query.toString();
            }
            query = '/' + config.query;
        }

        // the resource is just added if is not null to avoid composing URLS  like "query/?param=..."
        if (typeof config.resource !== 'undefined' && config.resource != null) {
            query = query + '/' + config.resource;
        }

        var url = config.host + '/' + config.version + '/' + config.category + query;
        url = Utils.addQueryParamtersToUrl(config.params, url);
        return url;
    }
};


var DgvaManager = {
    host: DGVA_HOST,
    version: DGVA_VERSION,
    get: function (args) {
        var success = args.success;
        var error = args.error;
        var async = (_.isUndefined(args.async) || _.isNull(args.async) ) ? true : args.async;
        var urlConfig = _.omit(args, ['success', 'error', 'async']);

        var url = DgvaManager.url(urlConfig);
        if (typeof url === 'undefined') {
            return;
        }
        console.log(url);

        var d;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',//still firefox 20 does not auto serialize JSON, You can force it to always do the parsing by adding dataType: 'json' to your call.
            async: async,
            success: function (data, textStatus, jqXHR) {
                if ($.isPlainObject(data) || $.isArray(data)) {
                    data.query = args.query;
                    if (_.isFunction(success)) success(data);
                    d = data;
                } else {
                    console.log('Eva returned a non json object or list, please check the url.');
                    console.log(url);
                    console.log(data)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("DgvaManager: Ajax call returned : " + errorThrown + '\t' + textStatus + '\t' + jqXHR.statusText + " END");
                if (_.isFunction(error)) error(jqXHR, textStatus, errorThrown);
            }
        });
        return d;
    },
    url: function (args) {
        if (!$.isPlainObject(args)) args = {};
        if (!$.isPlainObject(args.params)) args.params = {};

        var version = this.version;
        if (typeof args.version !== 'undefined' && args.version != null) {
            version = args.version
        }

        var host = this.host;
        if (typeof args.host !== 'undefined' && args.host != null) {
            host = args.host;
        }

        delete args.host;
        delete args.version;

        var config = {
            host: host,
            version: version
        };

        var params = {
        };

        _.extend(config, args);
        _.extend(config.params, params);

        var query = '';
        if (typeof config.query !== 'undefined' && config.query != null) {
            if ($.isArray(config.query)) {
                config.query = config.query.toString();
            }
            query = '/' + config.query;
        }

        var url = config.host + '/' + config.version + '/' + config.category + query + '/' + config.resource;
        url = Utils.addQueryParamtersToUrl(config.params, url);
        return url;
    }
};