/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import Swal from 'sweetalert2';
import { combineReducers } from 'redux';
import initialState from './productsInitialState';

/**
 *  Local Storage with Products List.
 */

const localStorageproductsList = 'productsList';

/**
 *  Maximum number of lists a user is able to create
 */

const MAX_LISTS = 5;

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
    case actionTypes.CREATE_NEW_LIST: {
      if (state.length === MAX_LISTS) {
        return state;
      }
      const newList = {
        name: `List ${state.length + 1}`,
        products: []
      };

      return [...state, newList];
    }

    case actionTypes.ADD_PRODUCT_TO_LIST: {
      // Find the list by its name
      const updatedState = state.map((list) => {
        if (list.name === action.payload.listName) {
          if (list.products.some((product) => product.key === action.payload.product.key)) {
            list.products = list.products.map((product) => {
              if (product.key === action.payload.product.key) {
                product.quantity = action.payload.product.quantity;
              }

              return product;
            });
          } else {
            list.products.push(action.payload.product);
          }
        }

        return list;
      });

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
    }

    case actionTypes.UPDATE_LIST_NAME: {
      const updatedState = state.map((list) => {
        if (list.name === action.payload.oldListName) {
          return {
            ...list,
            name: action.payload.newListName
          };
        }

        return list;
      });

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
    }

    case actionTypes.REMOVE_PRODUCT_FROM_LIST: {
      const updatedState = state.map((list) => {
        if (list.name === action.payload.listName) {
          if (action.payload.quantity === 0) {
            list.products = list.products.filter(
              (product) => product.key !== action.payload.productKey
            );
          } else {
            list.products = list.products.map((product) => {
              if (product.key === action.payload.productKey) {
                product.quantity = action.payload.quantity;
              }

              return product;
            });
          }
        }

        return list;
      });

      localStorage.setItem(localStorageproductsList, JSON.stringify(updatedState));

      return updatedState;
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
  products,
  searchQuery
});
