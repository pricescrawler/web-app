/**
 * Local Storage key.
 */

const localStorageFavorites = 'favorites';

/**
 * Action Types.
 */

export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

/**
 * Action Creators.
 */

export const addFavorite = (item) => ({ payload: item, type: ADD_FAVORITE });
export const removeFavorite = (key) => ({ payload: key, type: REMOVE_FAVORITE });

/**
 * Reducer `favorites`.
 */

export const favorites = (state = [], action = {}) => {
  switch (action.type) {
    case ADD_FAVORITE: {
      if (state.some((item) => item.key === action.payload.key)) {
        return state;
      }

      const updated = [...state, action.payload];

      try {
        localStorage.setItem(localStorageFavorites, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }

      return updated;
    }

    case REMOVE_FAVORITE: {
      const updated = state.filter((item) => item.key !== action.payload);

      try {
        localStorage.setItem(localStorageFavorites, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }

      return updated;
    }

    default: {
      if (state.length === 0) {
        try {
          return JSON.parse(localStorage.getItem(localStorageFavorites)) || [];
        } catch {
          return [];
        }
      }

      return state;
    }
  }
};

export default favorites;
