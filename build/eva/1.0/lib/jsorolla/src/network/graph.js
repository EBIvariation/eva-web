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

function Graph(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId('Graph');

    this.vertices = [];
    this.edges = [];

    this.display = {
        style: {

        },
        layouts: {

        }
    };

    this.numberOfVertices = 0;
    this.numberOfEdges = 0;

    this.graphType = '';

    //set instantiation args, must be last
    _.extend(this, args);

    this.verticesIndex = {};
    this.edgesIndex = {};

    this.edgeDraw = {};


    this.on(this.handlers);
}

Graph.prototype = {
    setType: function (type) {
        this.graphType = type;
    },
    clean: function () {
        this.numberOfVertices = 0;
        this.numberOfEdges = 0;
        this.vertices = [];
        this.edges = [];
        this.verticesIndex = {};
        this.edgesIndex = {};

        this.edgeDraw = {};
    },
    addEdge: function (edge) {
        var _this = this;
        if (edge.source == null || edge.target == null) {
            return false
        }
        // Check if already exists
        if (this.containsEdge(edge)) {
            return false;
        }

        this.addVertex(edge.source);
        this.addVertex(edge.target);
        var length = this.edges.push(edge);
        var insertPosition = length - 1;
        this.edgesIndex[edge.id] = insertPosition;

        //update source edges
        edge.source.addEdge(edge);
        //update target edges
        if (edge.source !== edge.target) {
            edge.target.addEdge(edge);
        }
        this.trigger('edge:add', {edge: edge, graph: this});

        /* count edges between same vertices */
        var stId = edge.source.id + edge.target.id;
        var tsId = edge.target.id + edge.source.id;
        if (typeof this.edgeDraw[stId] === 'undefined') {
            this.edgeDraw[stId] = -1;
        }
        if (typeof this.edgeDraw[tsId] === 'undefined') {
            this.edgeDraw[tsId] = -1;
        }
        this.edgeDraw[stId]++;
        this.edgeDraw[tsId]++;
        edge.overlapCount = this.edgeDraw[stId];
//        edge.overlapCount = function () {
//            return _this.edgeDraw[stId];
//        };

        this.numberOfEdges++;
        return true;
    },
    addVertex: function (vertex) {
        if (vertex == null) {
            return false
        }
        // Check if already exists
        if (this.containsVertex(vertex)) {
            return false;
        }
        // Add the vertex
        var length = this.vertices.push(vertex);
        var insertPosition = length - 1;
        this.verticesIndex[vertex.id] = insertPosition;

        this.trigger('vertex:add', {vertex: vertex, graph: this});
        this.numberOfVertices++;
        return true;
    },
    removeEdge: function (edge) {
        if (edge == null) {
            return false
        }
        // Check if already exists
        if (!this.containsEdge(edge)) {
            return false;
        }

        //remove edge from vertex
        edge.source.removeEdge(edge);
        edge.target.removeEdge(edge);

//        /* count edges between same vertices */
//        var stId = edge.source.id + edge.target.id;
//        var tsId = edge.target.id + edge.source.id;
//        this.edgeDraw[stId]--;
//        this.edgeDraw[tsId]--;


        var position = this.edgesIndex[edge.id];
        delete this.edgesIndex[edge.id];
        delete this.edges[position];

        this.trigger('edge:remove', {edge: edge, graph: this});
        this.numberOfEdges--;


        return true;
    },
    removeVertex: function (vertex) {
        if (vertex == null) {
            return false
        }
        // Check if already exists
        if (!this.containsVertex(vertex)) {
            return false;
        }

        for (var i = 0; i < vertex.edges.length; i++) {
            var edge = vertex.edges[i];
            // remove edges from source or target
            if (edge.source !== vertex) {
                edge.source.removeEdge(edge);
            }
            if (edge.target !== vertex) {
                edge.target.removeEdge(edge);
            }

            var position = this.edgesIndex[edge.id];
            delete this.edgesIndex[edge.id];
            delete this.edges[position];

            this.trigger('edge:remove', {edge: edge, graph: this});
            this.numberOfEdges--;
        }
        vertex.removeEdges();

        var position = this.verticesIndex[vertex.id];
        delete this.verticesIndex[vertex.id];
        delete this.vertices[position];

        this.trigger('vertex:remove', {vertex: vertex, graph: this});
        this.numberOfVertices--;
        return true;
    },
    containsEdge: function (edge) {
        if (typeof this.edgesIndex[edge.id] !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    containsVertex: function (vertex) {
        if (typeof this.verticesIndex[vertex.id] !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    /**/
    getVertexById: function (vertexId) {
        return this.vertices[this.verticesIndex[vertexId]];
    },
    getEdgeById: function (edgeId) {
        return this.edges[this.edgesIndex[edgeId]];
    },
    /**/
    addLayout: function (layout) {
        this.display.layouts[layout.id] = layout;
    },

    /**/
    getAsSIF: function (separator) {
        if (typeof separator === 'undefined') {
            separator = '\t';
        }
        var sifText = "";
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (typeof edge !== 'undefined') {
                var line = "";
                line = edge.source.id + separator + edge.relation + separator + edge.target.id + "\n";
                sifText += line;
            }
        }
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            if (typeof vertex !== 'undefined') {
                var line = "";
                if (vertex.edges.length == 0) {
                    line = vertex.id + separator + separator + "\n";
                }
                sifText += line;
            }
        }
        return sifText;
    },
    getAsDOT: function () {
        var dotText = "graph network {\n" + this.getAsSIF(' ') + "}";
        return dotText;
    },

    toJSON: function () {
        var vertices = [];
        for (var i = 0; i < this.vertices.length; i++) {
            if (typeof this.vertices[i] !== 'undefined') {
                vertices.push(this.vertices[i]);
            }
        }
        var edges = [];
        for (var i = 0; i < this.edges.length; i++) {
            if (typeof this.edges[i] !== 'undefined') {
                edges.push(this.edges[i]);
            }
        }
        return {vertices: vertices, edges: edges};
    }
}