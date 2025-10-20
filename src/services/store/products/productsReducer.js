/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import Swal from 'sweetalert2';
import { combineReducers } from '@reduxjs/toolkit';
import initialState from './productsInitialState';

/**
 *  Local Storage with Products List.
 */

const localStorageproductsList = 'productsList';

/**
 *  `isLoadingData`.
 */

export const isLoadingData = (state = initialState.isLoadingData, action) => {
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
    case actionTypes.UPLOAD_PRODUCT_LIST:
      return false;

    default:
      return state;
  }
};

/**
 *  Products.
 */

export const productsData = (state = initialState.products, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return action.payload;

    case actionTypes.GET_SEARCHED_PRODUCTS: {
      // eslint-disable-next-line no-shadow
      const { products } = action.payload;

      return products;
    }

    case actionTypes.GET_PRODUCTS_FAIL: {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'error',
        text: `${action.payload} - ${action.payload.response.statusText}`,
        title: `Error`
      });

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
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'error',
        text: `${action.payload} - ${action.payload.response.statusText}`,
        title: `Error`
      });

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
    case actionTypes.UPDATE_PRODUCT_LIST: {
      localStorage.setItem(localStorageproductsList, JSON.stringify(action.payload));

      return action.payload;
    }

    case actionTypes.ADD_PRODUCT_LIST: {
      let updatedProducts;

      if (state.some((item) => item.key === action.payload.key)) {
        updatedProducts = state.map((item) => {
          if (item.key === action.payload.key) {
            return { ...item, quantity: action.payload.quantity };
          }

          return item;
        });
      } else {
        updatedProducts = [...state, action.payload];
      }

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedProducts));

      return updatedProducts;
    }

    case actionTypes.REMOVE_PRODUCT_LIST: {
      let updatedProducts;

      if (action.payload.quantity === 0) {
        updatedProducts = state.filter((item) => item.key !== action.payload.key);
      } else {
        updatedProducts = state.map((item) => {
          if (item.key === action.payload.key) {
            return { ...item, quantity: action.payload.quantity };
          }

          return item;
        });
      }

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedProducts));

      return updatedProducts;
    }

    default: {
      if (state.length === 0) {
        const storedList = JSON.parse(localStorage.getItem(localStorageproductsList)) || [];

        return storedList;
      }

      return state;
    }
  }
};

/**
 *  Product List Upload.
 */

export const productListUpload = (state = initialState.productListId, action = {}) => {
  switch (action.type) {
    case actionTypes.UPLOAD_PRODUCT_LIST: {
      return action.payload;
    }

    default:
      return state;
  }
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
  productListUpload,
  products: productsData,
  searchQuery
});
