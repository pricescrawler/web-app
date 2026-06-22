/**
 * Returns the product lists slice.
 */

export const selectProductLists = (state) => state.productLists.lists;

/**
 * Returns the id of the currently active list.
 */

export const selectActiveListId = (state) => state.productLists.activeListId;

/**
 * Returns the currently active list (or undefined if none matches).
 */

export const selectActiveList = (state) =>
  state.productLists.lists.find((list) => list.id === state.productLists.activeListId);

/**
 * Returns the items of the currently active list.
 */

export const selectActiveListItems = (state) => selectActiveList(state)?.items ?? [];
