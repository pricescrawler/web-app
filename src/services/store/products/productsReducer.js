/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import { combineReducers } from 'redux';
import initialState from './productsInitialState';

/**
 *  Local Storage with Products List.
 */

const localStorageproductsList = 'productsList';

/**
 *  `isLoadingData`.
 */

export const isLoadingData = (state = initialState.isLoadingData.valueOf, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_START:
    case actionTypes.GET_PRODUCTS_START:
    case actionTypes.SEARCH_PRODUCTS_START:
      return true;

    case actionTypes.GET_PRODUCTS_FAIL:
    case actionTypes.GET_PRODUCT_SUCCESS:
    case actionTypes.GET_PRODUCTS_SUCCESS:
    case actionTypes.SEARCH_PRODUCTS_SUCCESS:
    case actionTypes.GET_SEARCHED_PRODUCTS:
    case actionTypes.UPDATE_PRODUCT_LIST:
      return false;

    default:
      return state;
  }
};

/**
 *  Products.
 */
// FIXME: Replace function name

export const products = (state = initialState.products, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return action.payload;

    case actionTypes.GET_SEARCHED_PRODUCTS: {
      // eslint-disable-next-line no-shadow
      const { products } = action.payload;

      return products;
    }

    case actionTypes.GET_PRODUCTS_FAIL: {
      // eslint-disable-next-line no-alert
      alert(`${action.payload} - ${action.payload.response.statusText}`);

      return {};
    }

    default:
      return state;
  }
};

/**
 *  Product.
 */

export const product = (state = initialState.product, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_SUCCESS: {
      return action.payload;
    }

    case actionTypes.GET_PRODUCT_FAIL: {
      // eslint-disable-next-line no-alert
      alert(action.payload);

      return {};
    }

    default:
      return state;
  }
};

/**
 *  Product List.
 */

export const productList = (state = initialState.productList, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT_LIST: {
      if (state.some((item) => item.key === action.payload.key)) {
        const prods = state.map((item) => {
          if (item.key === action.payload.key) {
            item.quantity = action.payload.quantity;
          }

          return item;
        });

        localStorage.setItem(localStorageproductsList, JSON.stringify(prods));

        return prods;
      }

      const prods = [...state, action.payload];

      localStorage.setItem(localStorageproductsList, JSON.stringify(prods));

      return prods;
    }

    case actionTypes.UPDATE_PRODUCT_LIST: {
      localStorage.setItem(localStorageproductsList, JSON.stringify(action.payload));

      return action.payload;
    }

    case actionTypes.REMOVE_PRODUCT_LIST: {
      if (action.payload.quantity === 0) {
        const prods = state.filter((item) => item.key !== action.payload.key);

        localStorage.setItem(localStorageproductsList, JSON.stringify(prods));

        return prods;
        // eslint-disable-next-line no-else-return
      } else {
        const prods = state.map((item) => {
          if (item.key === action.payload.key) {
            item.quantity = action.payload.quantity;
          }

          return item;
        });

        localStorage.setItem(localStorageproductsList, JSON.stringify(prods));

        return prods;
      }
    }

    default: {
      if (state.length === 0) {
        const prods = JSON.parse(localStorage.getItem(localStorageproductsList));

        if (prods) {
          return prods;
        }

        localStorage.setItem(localStorageproductsList, JSON.stringify(state));
      } else {
        return state;
      }
    }
  }

  return state;
};

/**
 *  Search Query.
 */

export const searchQuery = (state = initialState.searchQuery, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_SEARCHED_PRODUCTS: {
      return action.payload.searchParam;
    }

    default:
      return state;
  }
};

/**
 * Export
 */

export default combineReducers({
  isLoadingData,
  product,
  productList,
  products,
  searchQuery
});
