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

var url = '';

function EvaIobioView(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EVAIobioView");
    _.extend(this, args);
    this.rendered = false;
    this.render();


}
EvaIobioView.prototype = {
    render: function () {
        var _this = this

        this.targetDiv = (this.target instanceof HTMLElement) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAv-GeneView: target ' + this.target + ' not found');
            return;
        }
        _this.draw(_this.url);
    },
    draw: function (data) {
        var _this = this;
        if(!_.isUndefined(data)){
            var iobioViewDiv = document.querySelector("#evaIobioView");
            $(iobioViewDiv).addClass('show-div');

            var elDiv = document.createElement("div");
            elDiv.innerHTML = '<iframe id="iobio" frameBorder="0"  scrolling="no" style="width:1330px;height:1200px;" src="'+data+'"></iframe>';
            iobioViewDiv.appendChild(elDiv);
        }
    }
}




