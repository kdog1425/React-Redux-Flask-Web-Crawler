/* eslint camelcase: 0 */
export function prepareGraph(results) {
    if (typeof(results) == 'undefined') return {};
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
    return graph;
}