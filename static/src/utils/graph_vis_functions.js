/* eslint camelcase: 0 */
import vis from 'vis'

export function drawGraph(graph) {
    if (typeof(window.s) !== 'undefined'){
        window.s = null;
    }

    var container = document.getElementById('sigma-container');
    var options = {};
    window.s = new vis.Network(container, graph, options);
}

export function prepareGraph(results) {
    var nodes = results.nodes;
    var edges = results.edges;
    for (var i in nodes) {
       nodes[i].label = nodes[i].url.substring(0,20) + '...';
       nodes[i].id = nodes[i].id.toString()
    }

    for (var i in edges) {
        edges[i].from = edges[i].source.toString();
        edges[i].to = edges[i].target.toString();
    }
    var graph = {nodes: nodes, edges: edges};
    drawGraph(graph);
    return graph;
}