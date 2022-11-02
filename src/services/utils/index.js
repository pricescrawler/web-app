/**
 * Get Formatted Date.
 */

export const getFormattedDate = (date) => date.split(' ')[0];

/**
 * Convert Text To Float.
 */

export const convertTextToFloat = (price) => {
  const priceDouble = parseFloat(price.replace(',', '.').replace(/[^0-9.]/g, ''));

  return priceDouble.toFixed(2);
};

/**
 * Get Formatted Price.
 */

export const getFormattedPrice = (product) => {
  if (product.campaignPrice) {
    return convertTextToFloat(product.campaignPrice);
  }
  if (product.regularPrice) {
    return convertTextToFloat(product.regularPrice);
  }

  return 0;
};

export const getLastPrice = (product) => {
  if (product.prices.length > 0) {
    return getFormattedPrice(product.prices[product.prices.length - 1]);
  }

  return 0;
};

/**
 * Render Catalog Name.
 */

export const renderCatalogName = (product) => {
  if (product.data.catalogName) {
    return product.data.catalogName;
  }

  return product.catalog;
};
