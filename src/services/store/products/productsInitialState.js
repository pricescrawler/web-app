/**
 * `initialState`
 */

const initialState = {
  isLoadingData: false,
  product: {},
  productLists: {
    activeListId: 'default',
    lists: [{ id: 'default', items: [], name: 'My List' }]
  },
  productListId: {},
  products: [],
  searchQuery: {}
};

/**
 * Export `initialState`.
 */

export default initialState;
