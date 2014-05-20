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

function Vertex(args) {
    this.id = 'v' + Utils.genId();

    this.edges = [];
    this.edgesIndex = {};

    //set instantiation args, must be last
    _.extend(this, args);
}

Vertex.prototype = {
    removeEdge: function (edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].id === edge.id) {
                this.edges.splice(i, 1);
                delete this.edgesIndex[edge.id];
                break;
            }
        }
    },
    removeEdges: function () {
        this.edges = [];
        this.edgesIndex = {};
    },
    addEdge: function (edge) {
        if(this.containsEdge(edge) === false){
            this.edges.push(edge);
            this.edgesIndex[edge.id] = edge;
        }
    },
    containsEdge: function (edge) {
        if (typeof this.edgesIndex[edge.id] !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    toJSON: function () {
        return {
            id: this.id
        }
    }
}