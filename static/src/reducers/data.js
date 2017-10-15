import { RECEIVE_PROTECTED_DATA, FETCH_PROTECTED_DATA_REQUEST,  } from '../constants';
import { RECEIVE_GRAPH_DATA, FETCH_GRAPH_DATA_REQUEST, RECEIVE_CRAWLER_DATA } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
    graph: {},
    crawlerId: "-1",
};

export default createReducer(initialState, {
    [RECEIVE_PROTECTED_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROTECTED_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [FETCH_GRAPH_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [RECEIVE_GRAPH_DATA]: (state, payload) =>
        Object.assign({}, state, {
            isFetching: false,
            loaded: true,
            graph: prepareGraph(payload.data.data)
        }),
    [RECEIVE_CRAWLER_DATA]: (state, payload) =>
        Object.assign({}, state, {
            crawlerId: payload.data.data.crawlerId
        }),
});

function drawGraph(graph) {
    if (typeof(window.s) !== 'undefined'){
        // to delete & refresh the graph
        window.s = null;
        // var g = document.getElementById('sigma-container');
        // var p = g.parentNode;
        // p.removeChild(g);
        // var c = document.createElement('div');
        // c.setAttribute('id', 'sigma-container');
        // c.style.width = '80%';
        // c.style.height = '80%';
        // c.style.margin = '0 auto';
        // c.style.textAlign = 'left';
        // p.appendChild(c);
    }

    var container = document.getElementById('sigma-container');
    var options = {};
    window.s = new vis.Network(container, graph, options);
}

function prepareGraph(results) {
    console.log(results);
    var nodes = results.nodes;
    var edges = results.edges;
    var xOffsets = {};
    for (var i in nodes) {
       nodes[i].label = nodes[i].url.substring(0,20) + '...';
       nodes[i].id = nodes[i].id.toString()
       nodes[i].size = 1;
       var level = nodes[i].level;
       nodes[i].y = level;
       if (!(level in xOffsets)){
           xOffsets[level] = 0;
       }
       xOffsets[level] += 1;
       nodes[i].x = xOffsets[level];
    }

    for (var i in edges) {
        edges[i].id = edges[i].id.toString();
        edges[i].from = edges[i].source.toString();
        edges[i].to = edges[i].target.toString();
    }
    var graph = {nodes: nodes, edges: edges};
    drawGraph(graph);
    return graph;
}
