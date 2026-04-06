/**
 * Converts a text string containing a price to a float number with two decimal places.
 * Returns 0 if the value is null, undefined or unparseable.
 * @param {string} price - The text string containing the price.
 * @returns {number} The converted price as a float number.
 * */

export const convertToFloat = (price) => {
  if (!price) return 0;
  const priceDouble = parseFloat(price.replace(',', '.').replace(/[^0-9.]/g, ''));

  return isNaN(priceDouble) ? 0 : priceDouble.toFixed(2);
};

/**
 * Parses a price string to a numeric value for comparison purposes.
 * Returns null if the value is null, undefined or unparseable.
 * @param {string} str - The price string.
 * @returns {number|null} The numeric price or null.
 * */

export const tryParsePrice = (str) => {
  if (!str) return null;
  const cleaned = str.replace(',', '.').replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);

  return isNaN(val) ? null : val;
};

/**
 * Gets the formatted price of a product based on whether it has a campaign price or regular price.
 * @param {object} product - The product object.
 * @returns {number} The formatted price as a float number.
 * */

export const getFormattedPrice = (product) => {
  if (product.campaignPrice) {
    return convertToFloat(product.campaignPrice);
  } else if (product.regularPrice) {
    return convertToFloat(product.regularPrice);
  }

  return 0;
};

/**
 * Gets the last price of a product from its list of prices.
 * @param {object} product - The product object.
 * @returns {number} The last price of the product as a float number.
 * */

export const getLastPrice = (product) => {
  if (product.prices.length > 0) {
    return getFormattedPrice(product.prices[product.prices.length - 1]);
  }

  return 0;
};

/**
 * Get Average Price.
 * @param {Array} prices - Array of prices.
 * @returns {string} - Average price rounded to two decimal places.
 * */

export const getAveragePrice = (prices) => {
  const sum = prices
    .map((price) => parseFloat(getFormattedPrice(price)))
    .reduce((acc, val) => acc + val, 0);

  return (sum / prices.length).toFixed(2);
};

/**
 * Renders the catalog name of a product.
 * @param {object} product - The product object.
 * @returns {string} The catalog name of the product.
 * */

export const renderCatalogName = (product) => {
  return product.data.catalogName || product.catalog;
};

/**
 * Hides a broken image by setting its display to none.
 * Shared handler for onError across all product image elements.
 * @param {React.SyntheticEvent} e - The image error event.
 * */

export const handleImageError = (e) => {
  e.target.style.display = 'none';
};
