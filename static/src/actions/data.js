import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA } from '../constants/index';
import { FETCH_GRAPH_DATA_REQUEST, RECEIVE_GRAPH_DATA, RECEIVE_CRAWLER_DATA} from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user, fetch_graph, new_crawler } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import { browserHistory } from 'react-router';

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function receiveGraphData(data) {
    return {
        type: RECEIVE_GRAPH_DATA,
        payload: {
            data,
        },
    };
}

export function fetchGraphDataRequest() {
    return {
        type: FETCH_GRAPH_DATA_REQUEST,
    };
}

export function fetchGraphData(crawlerId) {
    return (dispatch) => {
        dispatch(fetchGraphDataRequest());
        fetch_graph(crawlerId).
                then(response => dispatch(receiveGraphData(response.data)))
    };
}

export function receiveCrawlerData(data) {
    console.log(data);
    return {
        type: RECEIVE_CRAWLER_DATA,
        payload: {
            data,
        }
    };
}

export function submitCrawlerRequest(rootUrl) {
    return (dispatch) => {

        new_crawler(rootUrl).
                then(response => dispatch(receiveCrawlerData(response.data))).
                then(() => browserHistory.push('/home'))
    };
}
