/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import api from '@services/api';
import { toast } from 'sonner';

/**
 * Get Product Start.
 */

export const getProductStart = () => ({ type: actionTypes.GET_PRODUCT_START });

/**
 * Get Product Success.
 */

export const getProductSuccess = (product) => ({
  payload: product,
  type: actionTypes.GET_PRODUCT_SUCCESS
});

/**
 * Get Product Fail.
 */

export const getProductFail = (error) => ({
  payload: error,
  type: actionTypes.GET_PRODUCT_FAIL
});

/**
 * Get Products Start.
 */

export const getProductsStart = () => ({
  type: actionTypes.GET_PRODUCTS_START
});

/**
 * Get Products Success.
 */

export const getProductsSuccess = (products) => ({
  payload: products,
  type: actionTypes.GET_PRODUCTS_SUCCESS
});

/**
 *Get Products Fail.
 */

export const getProductsFail = (error) => ({
  payload: error,
  type: actionTypes.GET_PRODUCTS_FAIL
});

/**
 * Search Products Start.
 */

export const searchProductsStart = () => ({
  type: actionTypes.SEARCH_PRODUCTS_START
});

/**
 * Search Products Success.
 */

export const searchProductsSuccess = () => ({
  type: actionTypes.SEARCH_PRODUCTS_SUCCESS
});

/**
 * Get Search Products.
 */

export const getSearchProducts = (products, searchParam) => ({
  payload: { products, searchParam },
  type: actionTypes.GET_SEARCHED_PRODUCTS
});

/**
 * Add to Product List.
 */

export const addToProductList = (product) => ({
  payload: product,
  type: actionTypes.ADD_PRODUCT_LIST
});

/**
 * Update Product List.
 */

export const updateProductList = (product) => ({
  payload: product,
  type: actionTypes.UPDATE_PRODUCT_LIST
});

/**
 * Upload Product List.
 */

export const uploadProductList = (product) => ({
  payload: product,
  type: actionTypes.UPLOAD_PRODUCT_LIST
});

/**
 * Remove from Product List.
 */

export const removeFromProductList = (product) => ({
  payload: product,
  type: actionTypes.REMOVE_PRODUCT_LIST
});

/**
 * Create Product List.
 */

export const createProductList = (name) => ({
  payload: { id: crypto.randomUUID(), name },
  type: actionTypes.CREATE_PRODUCT_LIST
});

/**
 * Rename Product List.
 */

export const renameProductList = (id, name) => ({
  payload: { id, name },
  type: actionTypes.RENAME_PRODUCT_LIST
});

/**
 * Delete Product List.
 */

export const deleteProductList = (id) => ({
  payload: id,
  type: actionTypes.DELETE_PRODUCT_LIST
});

/**
 * Select Product List.
 */

export const selectProductList = (id) => ({
  payload: id,
  type: actionTypes.SELECT_PRODUCT_LIST
});

/**
 * Move Product to another List.
 */

export const moveProductToList = (key, toListId) => ({
  payload: { key, toListId },
  type: actionTypes.MOVE_PRODUCT_TO_LIST
});

/**
 * Builds the URL a client-fetch-required catalog's search page lives at, by
 * substituting `{query}` into the catalog's `clientFetchSearchUrlTemplate` (a path
 * relative to its `baseUrl`).
 */

const buildClientFetchUrl = (catalog, query) => {
  const path = (catalog.clientFetchSearchUrlTemplate || '').replace(
    '{query}',
    encodeURIComponent(query)
  );

  return new URL(path, catalog.baseUrl).toString();
};

/**
 * Fetches a client-fetch-required catalog's search page directly from the browser
 * (so the request comes from the user's own IP/session, not the backend's), then
 * hands the raw HTML to the backend's content parser, which reuses the same parsing
 * logic as a normal search — the backend itself never contacts the catalog. Only
 * catalogs with `isClientFetchRequired` reach this path; the backend also enforces
 * this server-side and rejects any other catalog.
 */

const searchClientFetchCatalog = (catalog, query) => {
  const catalogKey = catalog.value.split('#')[0];

  return fetch(buildClientFetchUrl(catalog, query))
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((html) =>
      api.post('/api/v1/products/parser/list', {
        catalog: catalogKey,
        content: html,
        date: new Date().toISOString()
      })
    )
    .then((response) => ({
      catalog: catalogKey.split('.').pop(),
      data: { catalogName: catalog.label, historyEnabled: false },
      locale: catalogKey.split('.')[0],
      products: response.data
    }))
    .catch((error) => {
      toast.error(
        `Erro ao pesquisar ${catalog.label} diretamente do browser: ${error?.message ?? error}`
      );
      return {
        catalog: catalogKey.split('.').pop(),
        data: {},
        locale: catalogKey.split('.')[0],
        products: []
      };
    });
};

/**
 * Search.
 */

export const search = (searchParam) => {
  const { selectedCatalogs = [], stringValue = '' } = searchParam;
  const serverCatalogs = selectedCatalogs.filter((catalog) => !catalog.isClientFetchRequired);
  const clientCatalogs = selectedCatalogs.filter((catalog) => catalog.isClientFetchRequired);
  const request = {
    catalogs: serverCatalogs.map((catalog) => catalog.value),
    query: stringValue
  };

  return (dispatch) => {
    dispatch(getProductsStart());

    const serverSearch =
      serverCatalogs.length > 0
        ? api.post('/api/v1/products/search', request).then((response) => response.data)
        : Promise.resolve([]);
    const clientSearch = Promise.all(
      clientCatalogs.map((catalog) => searchClientFetchCatalog(catalog, stringValue))
    );

    Promise.all([serverSearch, clientSearch])
      .then(([serverResults, clientResults]) => {
        const allResults = [...serverResults, ...clientResults];
        const reorderedResponse = selectedCatalogs.map((catalog) =>
          allResults.find((item) => item.catalog === catalog.value.split('.').pop())
        );

        dispatch(getSearchProducts(reorderedResponse, searchParam));
      })
      .catch((error) => {
        toast.error(`Erro ao pesquisar produtos: ${error?.message ?? error}`);
        dispatch(getProductsFail(error));
      });
  };
};

/**
 * Get Updated Product List.
 */

export const getUpdatedProductList = (searchParam) => (dispatch) => {
  dispatch(getProductsStart());
  api
    .post('/api/v1/products/list/update', searchParam)
    .then((response) => {
      dispatch(updateProductList(response.data));
    })
    .catch((error) => {
      toast.error(`Erro ao atualizar lista: ${error?.message ?? error}`);
      dispatch(getProductsFail(error));
    });
};

/**
 * Get Product.
 */

export const getProduct = (searchParam) => {
  const { catalog, locale, reference } = searchParam;

  return (dispatch) => {
    dispatch(getProductStart());
    api
      .get(`/api/v1/products/history/${locale}/${catalog}/${reference}`)
      .then((response) => {
        dispatch(getProductSuccess(response.data));
      })
      .catch((error) => {
        toast.error(`Erro ao carregar produto: ${error?.message ?? error}`);
        dispatch(getProductsFail(error));
      });
  };
};

export const saveProductList = (searchParam) => (dispatch) => {
  dispatch(getProductStart());
  api
    .post('/api/v1/products/list/store', searchParam)
    .then((response) => {
      dispatch(uploadProductList(response));
    })
    .catch((error) => {
      toast.error(`Erro ao guardar lista: ${error?.message ?? error}`);
      dispatch(getProductsFail(error));
    });
};

export const retrieveProductList = (searchParam) => (dispatch) => {
  dispatch(getProductStart());
  api
    .get(`/api/v1/products/list?id=${searchParam}`)
    .then((response) => {
      dispatch(updateProductList(response.data));
    })
    .catch((error) => {
      toast.error(`Erro ao recuperar lista: ${error?.message ?? error}`);
      dispatch(getProductsFail(error));
    });
};
