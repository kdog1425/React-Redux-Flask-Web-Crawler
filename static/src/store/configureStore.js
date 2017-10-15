import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

const debugware = [];
if (process.env.NODE_ENV !== 'production') {
    const createLogger = require('redux-logger');

    debugware.push(createLogger({
        collapsed: true,
    }));
}

export default function configureStore(initialState) {
    /* eslint-disable no-underscore-dangle */
    const store = createStore(
        rootReducer, /* preloadedState, */
        initialState,
        applyMiddleware(thunkMiddleware, ...debugware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
        /* eslint-enable */
    }

    return store;
}
