/**
 * Module dependencies.
 */

import { addFavorite, favorites, removeFavorite } from './favoritesReducer';
import { describe, expect, it } from 'vitest';

/**
 * Tests for the `favorites` reducer.
 */

describe('favorites reducer', () => {
  const item = { key: 'catalog.product-1', name: 'Product 1' };

  it('adds a favorite and persists it to local storage', () => {
    const state = favorites([], addFavorite(item));

    expect(state).toEqual([item]);
    expect(JSON.parse(localStorage.getItem('favorites'))).toEqual([item]);
  });

  it('does not add a duplicate favorite', () => {
    const state = favorites([item], addFavorite({ ...item }));

    expect(state).toEqual([item]);
  });

  it('removes a favorite by key', () => {
    const state = favorites([item], removeFavorite(item.key));

    expect(state).toEqual([]);
    expect(JSON.parse(localStorage.getItem('favorites'))).toEqual([]);
  });

  it('hydrates from local storage when the state is empty', () => {
    localStorage.setItem('favorites', JSON.stringify([item]));

    expect(favorites([], {})).toEqual([item]);
  });

  it('returns an empty array when local storage is empty', () => {
    expect(favorites([], {})).toEqual([]);
  });
});
