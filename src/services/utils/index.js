/**
 * Converts a text string containing a price to a float number with two decimal places.
 * @param {string} price - The text string containing the price.
 * @returns {number} The converted price as a float number.
 * */

export const convertToFloat = (price) => {
  const priceDouble = parseFloat(price.replace(',', '.').replace(/[^0-9.]/g, ''));

  return priceDouble.toFixed(2);
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
 *  Gets the last price of a product from its list of prices.
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
 * Renders the catalog name of a product.
 * @param {object} product - The product object.
 * @returns {string} The catalog name of the product.
 * */

export const renderCatalogName = (product) => {
  return product.data.catalogName || product.catalog;
};
