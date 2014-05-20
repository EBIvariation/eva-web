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
function XLSXNetworkDataAdapter(args) {
    var _this = this;
    _.extend(this, Backbone.Events);

    this.dataSource;
    this.async = true;

    this.graph = new Graph();
    this.xlsx;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);


    if (this.async) {
        this.dataSource.on('success', function (data) {
            _this.parse(data);
        });
        this.dataSource.fetch(this.async);
    } else {
        var data = this.dataSource.fetch(this.async);
        this.parse(data);
    }


};

XLSXNetworkDataAdapter.prototype.parse = function (data) {
    try {
        this.xlsx = XLSX.read(data, {type: 'binary'});
        this.trigger('data:load', {workbook: this.xlsx, sender: this});
    } catch (e) {
        console.log(e);
        this.trigger('error:parse', {errorMsg: 'Parse error', sender: this});
    }
};
XLSXNetworkDataAdapter.prototype.parseSheet = function (sheetName) {
    var csv = XLSX.utils.sheet_to_csv(this.xlsx.Sheets[sheetName]);
    return csv;
};
