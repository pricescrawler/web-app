/**
 * Module dependencies.
 */

import {
  convertToFloat,
  getAveragePrice,
  getFormattedPrice,
  getLastPrice,
  renderCatalogName,
  tryParsePrice
} from './index';
import { describe, expect, it } from 'vitest';

/**
 * Tests for `convertToFloat`.
 */

describe('convertToFloat', () => {
  it('converts a comma-separated price string', () => {
    expect(convertToFloat('1,99 €')).toBe('1.99');
  });

  it('converts a dot-separated price string', () => {
    expect(convertToFloat('10.50')).toBe('10.50');
  });

  it('returns 0 for null, undefined or empty values', () => {
    expect(convertToFloat(null)).toBe(0);
    expect(convertToFloat(undefined)).toBe(0);
    expect(convertToFloat('')).toBe(0);
  });

  it('returns 0 for unparseable values', () => {
    expect(convertToFloat('abc')).toBe(0);
  });
});

/**
 * Tests for `tryParsePrice`.
 */

describe('tryParsePrice', () => {
  it('parses a comma-separated price string to a number', () => {
    expect(tryParsePrice('1,99 €')).toBe(1.99);
  });

  it('returns null for null, undefined or empty values', () => {
    expect(tryParsePrice(null)).toBeNull();
    expect(tryParsePrice(undefined)).toBeNull();
    expect(tryParsePrice('')).toBeNull();
  });

  it('returns null for unparseable values', () => {
    expect(tryParsePrice('abc')).toBeNull();
  });
});

/**
 * Tests for `getFormattedPrice`.
 */

describe('getFormattedPrice', () => {
  it('prefers the campaign price when present', () => {
    expect(getFormattedPrice({ campaignPrice: '2,50 €', regularPrice: '3,00 €' })).toBe('2.50');
  });

  it('falls back to the regular price', () => {
    expect(getFormattedPrice({ regularPrice: '3,00 €' })).toBe('3.00');
  });

  it('returns 0 when no price is available', () => {
    expect(getFormattedPrice({})).toBe(0);
  });
});

/**
 * Tests for `getLastPrice`.
 */

describe('getLastPrice', () => {
  it('returns the formatted price of the last entry', () => {
    const product = {
      prices: [{ regularPrice: '1,00 €' }, { regularPrice: '2,00 €' }]
    };

    expect(getLastPrice(product)).toBe('2.00');
  });

  it('returns 0 when the product has no prices', () => {
    expect(getLastPrice({ prices: [] })).toBe(0);
  });
});

/**
 * Tests for `getAveragePrice`.
 */

describe('getAveragePrice', () => {
  it('returns the average rounded to two decimal places', () => {
    const prices = [{ regularPrice: '1,00 €' }, { regularPrice: '2,00 €' }];

    expect(getAveragePrice(prices)).toBe('1.50');
  });
});

/**
 * Tests for `renderCatalogName`.
 */

describe('renderCatalogName', () => {
  it('returns the catalog name from the product data', () => {
    expect(renderCatalogName({ catalog: 'catalog-id', data: { catalogName: 'My Catalog' } })).toBe(
      'My Catalog'
    );
  });

  it('falls back to the catalog identifier', () => {
    expect(renderCatalogName({ catalog: 'catalog-id', data: {} })).toBe('catalog-id');
  });
});
