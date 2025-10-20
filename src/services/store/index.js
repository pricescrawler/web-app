/**
 * Module dependencies.
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsReducer';

/**
 * Store.
 */

const store = configureStore({
  reducer: productsReducer
});

/**
 * Export `store`.
 */

export default store;
