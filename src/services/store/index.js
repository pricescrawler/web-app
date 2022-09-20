/**
 * Module dependencies.
 */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import productsReducer from './products/productsReducer';
import thunk from 'redux-thunk';

/**
 * `rootReducer`.
 */

const rootReducer = combineReducers({
  product: productsReducer,
  productList: productsReducer,
  products: productsReducer
});

/**
 * Store.
 */

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

/**
 * Export `store`.
 */

export default store;
