/**
 * Module dependencies.
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsReducer';

/**
 * Store.
 */

const store = configureStore({
  reducer: {
    product: productsReducer,
    productList: productsReducer,
    productListId: productsReducer,
    products: productsReducer
  }
});

/**
 * Export `store`.
 */

export default store;
