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

function EdgeConfig(args) {

    this.id;
    this.rendererConfig = {};
    this.renderer = new DefaultEdgeRenderer(this.rendererConfig);
    this.type;
    this.visible;

    //set instantiation args, must be last
    _.extend(this, args);

    this.renderer.setConfig(this.rendererConfig);
}

EdgeConfig.prototype = {
    render:function(args){
        this.renderer.render(args);
    },
    toJSON: function () {
        return {
            id: this.id,
            renderer:this.renderer,
            type: this.type,
            visible: this.visible
        };
    }
}