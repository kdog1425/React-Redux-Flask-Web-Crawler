import { RECEIVE_PROTECTED_DATA, FETCH_PROTECTED_DATA_REQUEST,  } from '../constants';
import { RECEIVE_GRAPH_DATA, FETCH_GRAPH_DATA_REQUEST, RECEIVE_CRAWLER_DATA } from '../constants';
import { createReducer } from '../utils/misc';
import { prepareGraph } from '../utils/graph_vis_functions'

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
    graph: {},
    crawlerId: "-1",
    isCrawlerWorking: false,
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
            ifFetching: false,
            isCrawlerWorking: payload.data.isAlive,
            loaded: true,
            graph: prepareGraph(payload.data),
        }),
    [RECEIVE_CRAWLER_DATA]: (state, payload) =>
        Object.assign({}, state, {
            crawlerId: payload.data.crawlerId,
            graph: {nodes: [], edges: []}
        }),
});

