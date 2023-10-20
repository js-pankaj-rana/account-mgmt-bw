import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import sizeof from 'object-sizeof';

import reducers from './reducers';

const accountManagementPersistConfig = {
  key: 'accountManagementRoot',
  storage: sessionStorage
};

const middleware = applyMiddleware(promise, thunk);

const persistedReducer = persistReducer(
  accountManagementPersistConfig,
  reducers
);

export default () => {
  // sanitizers to keep redux devtools from using excessive memory
  const MAX_SIZE_PAYLOAD = 1000;
  const actionSanitizer = action =>
    sizeof(action.payload) > MAX_SIZE_PAYLOAD
      ? { ...action, payload: '<<LONG_BLOB>>' }
      : action;

  // compose
  const composeEnhancers =
    (process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // add sanitizers here as devtools options
          // see https://github.com/zalmoxisus/redux-devtools-extension/tree/94f7e53800f4665bddc9b7438c5cc75cfb4547cc#12-advanced-store-setup
          // section 1.2
          serialize: true,
          trace: true,
          actionSanitizer,
          stateSanitizer: state =>
            state.payload ? { ...state, payload: '<<LONG_BLOB>>' } : state
        })
      : null) || compose;

  const enhancer = composeEnhancers(middleware);

  const store = createStore(persistedReducer, undefined, enhancer);

  const persistor = persistStore(store);

  return { store, persistor };
};
