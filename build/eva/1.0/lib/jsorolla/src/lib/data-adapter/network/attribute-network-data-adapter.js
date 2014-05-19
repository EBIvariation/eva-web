/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

function AttributeNetworkDataAdapter(args) {
    var _this = this;
    _.extend(this, Backbone.Events);

    this.dataSource;
    this.async = true;
    this.jsonObject;
    this.ignoreColumns = {};

    //set instantiation args, must be last
    _.extend(this, args);

    this.attributes = [];
    this.data = [];

    this.on(this.handlers);

    if (this.async) {
        this.dataSource.on('success', function (data) {
            _this.parse(data);
        });
        this.dataSource.fetch(this.async);
    } else {
        var data = this.dataSource.fetch(this.async);
        _this.parse(data);
    }


};

AttributeNetworkDataAdapter.prototype.parse = function (data) {
    var _this = this;

//    var lines = data.split("\n");
//    if (lines.length > 2) {
//        var types = lines[0].substring(1).replace(/^\s+|\s+$/g, "").split("\t");
//        var defVal = lines[1].substring(1).replace(/^\s+|\s+$/g, "").split("\t");
//        var headers = lines[2].substring(1).replace(/^\s+|\s+$/g, "").split("\t");
//
//        for (var i = 0; i < headers.length; i++) {
//            this.attributes.push({
//                "name": headers[i],
//                "type": types[i],
//                "defaultValue": defVal[i]
//            });
//        }
//    }
//
//    for (var i = 3; i < lines.length; i++) {
//        var line = lines[i].replace(/^\s+|\s+$/g, "");
//        if ((line != null) && (line.length > 0)) {
//            var fields = line.split("\t");
//            if (fields[0].substr(0, 1) != "#") {
//                this.data.push(fields);
//            }
//        }
//    }


    try {

        var lines = data.split("\n");
        var firstLine = lines[0].replace(/^\s+|\s+$/g, "");
        var numColumns = firstLine.split("\t").length;
        for (var i = 0; i < numColumns; i++) {
            var name = "Column" + i;
            if (i == 0) {
                name = "Id";
            }

            if (this.ignoreColumns[i] !== true) {
                this.attributes.push({
                    "name": name,
                    "type": "string",
                    "defaultValue": ""
                });
            }
        }

        //ignore attributes
        if (Object.keys(this.ignoreColumns).length > 0) {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].replace(/^\s+|\s+$/g, "");
                if ((line != null) && (line.length > 0) && line.substr(0, 1) != "#") {
                    var fields = line.split("\t");

                    var filteredFields = [];
                    for (var j = 0; j < fields.length; j++) {
                        if (this.ignoreColumns[j] !== true) {
                            filteredFields.push(fields[j])
                        }
                    }

                    this.data.push(filteredFields);
                }
            }
        }else{
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].replace(/^\s+|\s+$/g, "");
                if ((line != null) && (line.length > 0) && line.substr(0, 1) != "#") {
                    var fields = line.split("\t");
                    this.data.push(fields);
                }
            }
        }

        this.trigger('data:load', {sender: this});
    } catch (e) {
        console.log(e);
        this.trigger('error:parse', {errorMsg: 'Parse error', sender: this});
    }


};

AttributeNetworkDataAdapter.prototype.getAttributesJSON = function () {
    var json = {};
    json.attributes = this.attributes;
    json.data = this.data;
    return json;
};
