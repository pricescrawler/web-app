import { combineReducers } from "redux";

import initialState from "./productsInitialState";
import * as actionTypes from "./productsActionTypes";

const localStorage_productsList = "productsList";

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
      return false;
    default:
      return state;
  }
};

export const products = (state = initialState.products, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return action.payload;
    case actionTypes.GET_SEARCHED_PRODUCTS:
      const { products } = action.payload;
      return products;
    case actionTypes.GET_PRODUCTS_FAIL:
      alert(action.payload + " - " + action.payload.response.statusText);
      return {};
    default:
      return state;
  }
};

export const product = (state = initialState.product, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_SUCCESS:
      return action.payload;
    case actionTypes.GET_PRODUCT_FAIL:
      alert(action.payload);
      return {};
    default:
      return state;
  }
};

export const productList = (state = initialState.productList, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT_LIST:
      if (state.some(item => item.key === action.payload.key)) {
        const prods = state.map(item => {
          if (item.key === action.payload.key) {
            item.quantity = action.payload.quantity;
          }
          return item;
        });
        localStorage.setItem(localStorage_productsList, JSON.stringify(prods));
        return prods;
      } else {
        const prods = [...state, action.payload];
        localStorage.setItem(localStorage_productsList, JSON.stringify(prods));
        return prods;
      }
    case actionTypes.UPDATE_PRODUCT_LIST:
      localStorage.setItem(localStorage_productsList, JSON.stringify(action.payload));
      return action.payload;
    case actionTypes.REMOVE_PRODUCT_LIST:
      if (action.payload.quantity === 0) {
        const prods = state.filter(item => item.key !== action.payload.key);
        localStorage.setItem(localStorage_productsList, JSON.stringify(prods));
        return prods;
      } else {
        const prods = state.map(item => {
          if (item.key === action.payload.key) {
            item.quantity = action.payload.quantity;
          }
          return item;
        });
        localStorage.setItem(localStorage_productsList, JSON.stringify(prods));
        return prods;
      }
    default:
      if (state.length === 0) {
        const prods = JSON.parse(localStorage.getItem(localStorage_productsList));
        if (prods) {
          return prods;
        } else {
          localStorage.setItem(localStorage_productsList, JSON.stringify(state));
        }
      } else {
        return state;
      }
  }
  return state;
};

export const searchQuery = (state = initialState.searchQuery, action = {}) => {
  switch (action.type) {
    case actionTypes.GET_SEARCHED_PRODUCTS:
      return action.payload.searchParam;
    default:
      return state;
  }
};

export default combineReducers({
  isLoadingData,
  product,
  products,
  productList,
  searchQuery,
});
