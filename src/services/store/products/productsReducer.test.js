/**
 * Module dependencies.
 */

import * as actionTypes from './productsActionTypes';
import { describe, expect, it } from 'vitest';
import { productsData } from './productsReducer';

/**
 * Tests for the `productsData` reducer.
 */

describe('productsData reducer', () => {
  it('resets to an empty list when the search fails', () => {
    const state = productsData([{ catalog: 'continente', products: [] }], {
      type: actionTypes.GET_PRODUCTS_FAIL
    });

    expect(state).toEqual([]);
    expect(() => [...state]).not.toThrow();
  });
});
