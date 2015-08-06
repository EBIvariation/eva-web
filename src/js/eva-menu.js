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
function EvaMenu(args) {
    _.extend(this, Backbone.Events);

    //set default args
    this.id = Utils.genId("EvaMenu");
    this.target;
    this.autoRender = true;

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);


    this.rendered = false;
    if (this.autoRender) {
        this.render(this.targetId);
    }
}

EvaMenu.prototype = {
    render: function () {
        var _this = this;
        console.log("Initializing");


//        var navgationHtml = '' +
//
//            '</div>' +
//            '</div>' +
//            '';

        $(this.target).click(function (e) {
            if ($(e.target).prop("tagName") == 'A') {
                _this._optionClickHandler(e.target);
            }
        });

        //HTML skel
        this.target
    },
    draw: function () {
    },
    _optionClickHandler: function (aEl) {
        $(this.target).find('.active').removeClass('active');
        $(aEl).parent().addClass('active');
        this.trigger('menu:click', {option: $(aEl).text(), sender: this})
    },
    select: function (optionName) {
        var aEl = this.target.querySelector('a[href="#' + optionName + '"]')
        this._optionClickHandler(aEl);
    }
}