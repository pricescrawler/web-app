/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import { combineReducers } from '@reduxjs/toolkit';
import { favorites } from '../favorites/favoritesReducer';
import initialState from './productsInitialState';

/**
 *  Local Storage keys.
 */

const localStorageProductLists = 'productsLists';
const localStorageLegacyProductList = 'productsList';

/**
 *  Persists the product lists state to local storage.
 */

const persistProductLists = (state) => {
  try {
    localStorage.setItem(localStorageProductLists, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }

  return state;
};

/**
 *  Returns a new state with the active list's items replaced by `updater`.
 */

const updateActiveListItems = (state, updater) => {
  const lists = state.lists.map((list) =>
    list.id === state.activeListId ? { ...list, items: updater(list.items) } : list
  );

  return persistProductLists({ ...state, lists });
};

/**
 *  Loads the product lists from local storage, migrating the legacy flat list.
 */

const loadProductLists = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(localStorageProductLists));

    if (stored?.lists?.length > 0) {
      return stored;
    }
  } catch {
    // ignore and fall through to migration / default
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(localStorageLegacyProductList));

    if (Array.isArray(legacy) && legacy.length > 0) {
      const migrated = {
        activeListId: 'default',
        lists: [{ id: 'default', items: legacy, name: 'My List' }]
      };

      persistProductLists(migrated);
      localStorage.removeItem(localStorageLegacyProductList);

      return migrated;
    }
  } catch {
    // ignore storage errors
  }

  return initialState.productLists;
};

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
      const { products } = action.payload;

      return products;
    }

    case actionTypes.GET_PRODUCTS_FAIL: {
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
      return {};
    }

    default:
      return state;
  }
};

/**
 *  Adds (or increments) an item in a list of items.
 */

const addItem = (items, payload) => {
  if (items.some((item) => item.key === payload.key)) {
    return items.map((item) =>
      item.key === payload.key ? { ...item, quantity: payload.quantity } : item
    );
  }

  return [...items, payload];
};

/**
 *  Removes or decrements an item in a list of items.
 */

const removeItem = (items, payload) => {
  if (payload.quantity === 0) {
    return items.filter((item) => item.key !== payload.key);
  }

  return items.map((item) =>
    item.key === payload.key ? { ...item, quantity: payload.quantity } : item
  );
};

/**
 *  Product Lists.
 */

export const productLists = (state = initialState.productLists, action = {}) => {
  switch (action.type) {
    case actionTypes.UPDATE_PRODUCT_LIST: {
      return updateActiveListItems(state, () => action.payload);
    }

    case actionTypes.ADD_PRODUCT_LIST: {
      return updateActiveListItems(state, (items) => addItem(items, action.payload));
    }

    case actionTypes.REMOVE_PRODUCT_LIST: {
      return updateActiveListItems(state, (items) => removeItem(items, action.payload));
    }

    case actionTypes.CREATE_PRODUCT_LIST: {
      const { id, name } = action.payload;
      const lists = [...state.lists, { id, items: [], name }];

      return persistProductLists({ ...state, activeListId: id, lists });
    }

    case actionTypes.RENAME_PRODUCT_LIST: {
      const { id, name } = action.payload;
      const lists = state.lists.map((list) => (list.id === id ? { ...list, name } : list));

      return persistProductLists({ ...state, lists });
    }

    case actionTypes.DELETE_PRODUCT_LIST: {
      if (state.lists.length <= 1) {
        return state;
      }

      const lists = state.lists.filter((list) => list.id !== action.payload);
      const activeListId = state.activeListId === action.payload ? lists[0].id : state.activeListId;

      return persistProductLists({ ...state, activeListId, lists });
    }

    case actionTypes.SELECT_PRODUCT_LIST: {
      if (!state.lists.some((list) => list.id === action.payload)) {
        return state;
      }

      return persistProductLists({ ...state, activeListId: action.payload });
    }

    case actionTypes.MOVE_PRODUCT_TO_LIST: {
      const { key, toListId } = action.payload;

      if (state.activeListId === toListId) {
        return state;
      }

      const moved = state.lists
        .find((list) => list.id === state.activeListId)
        ?.items.find((item) => item.key === key);

      if (!moved) {
        return state;
      }

      const lists = state.lists.map((list) => {
        if (list.id === state.activeListId) {
          return { ...list, items: list.items.filter((item) => item.key !== key) };
        }

        if (list.id === toListId) {
          return { ...list, items: addItem(list.items, moved) };
        }

        return list;
      });

      return persistProductLists({ ...state, lists });
    }

    default: {
      if (state === initialState.productLists) {
        return loadProductLists();
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
  favorites,
  isLoadingData,
  product,
  productLists,
  productListUpload,
  products: productsData,
  searchQuery
});
