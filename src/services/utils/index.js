export const getFormattedDate = (date) => {
    return date.split(" ")[0];
};

export const getFormattedPrice = (product) => {
    if (product.campaignPrice) {
        return convertTextToFloat(product.campaignPrice);
    } else if (product.regularPrice) {
        return convertTextToFloat(product.regularPrice);
    } else {
        return 0;
    }
};

export const convertTextToFloat = (price) => {
    const priceDouble = parseFloat(price.replace(",", ".").replace(/[^0-9.]/g, ""));
    return priceDouble.toFixed(2);
};

export const renderCatalogName = (product) => {
    if (product.data.catalogName) {
        return product.data.catalogName;
    } else {
        return product.catalog;
    }
}
