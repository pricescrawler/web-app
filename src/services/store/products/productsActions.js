import api from '../../api';
import * as actionTypes from "./productsActionTypes";

export const getProductStart = () => {
  return { type: actionTypes.GET_PRODUCT_START };
};

export const getProductSuccess = (product) => {
  return { type: actionTypes.GET_PRODUCT_SUCCESS, payload: product };
};

export const getProductFail = (error) => {
  return { type: actionTypes.GET_PRODUCT_FAIL, payload: error };
};

export const getProductsStart = () => {
  return { type: actionTypes.GET_PRODUCTS_START };
};

export const getProductsSuccess = (products) => {
  return { type: actionTypes.GET_PRODUCTS_SUCCESS, payload: products };
};

export const getProductsFail = (error) => {
  return { type: actionTypes.GET_PRODUCTS_FAIL, payload: error };
};

export const searchProductsStart = () => {
  return { type: actionTypes.SEARCH_PRODUCTS_START };
};

export const searchProductsSuccess = () => {
  return { type: actionTypes.SEARCH_PRODUCTS_SUCCESS };
};

export const getSearchProducts = (products, searchParam) => {
  return { type: actionTypes.GET_SEARCHED_PRODUCTS, payload: { products, searchParam } };
};

export const addToProductList = (product) => {
  return { type: actionTypes.ADD_PRODUCT_LIST, payload: product };
};

export const updateProductList = (product) => {
  return { type: actionTypes.UPDATE_PRODUCT_LIST, payload: product };
};

export const removeFromProductList = (product) => {
  return { type: actionTypes.REMOVE_PRODUCT_LIST, payload: product };
};

export const search = (searchParam) => {
  const { selectedCatalogs = [], stringValue = "" } = searchParam;
  const request = { catalogs: selectedCatalogs.map(c => c.value), query: stringValue };
  return (dispatch) => {
    dispatch(getProductsStart());
    api.post("/api/v1/products/search", request).then((response) => {
      dispatch(getSearchProducts(response.data, searchParam));
    })
      .catch((error) => dispatch(getProductsFail(error)));
  };
};

export const getUpdatedProductList = (searchParam) => {
  return (dispatch) => {
    dispatch(getProductsStart());
    api.post("/api/v1/products/list/update", searchParam).then((response) => {
      dispatch(updateProductList(response.data));
    })
      .catch((error) => dispatch(getProductsFail(error)));
  };
};

export const getProduct = (searchParam) => {
  const { locale, catalog, reference } = searchParam;
  return (dispatch) => {
    dispatch(getProductStart());
    api.get(`/api/v1/products/history/${locale}/${catalog}/${reference}`).then((response) => {
      dispatch(getProductSuccess(response.data));
    })
      .catch((error) => dispatch(getProductsFail(error)));
  };
};
