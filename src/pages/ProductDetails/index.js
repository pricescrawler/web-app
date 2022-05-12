import "./index.css"
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../components/Loader";
import PricesChart from "../../components/PricesChart";
import { Button, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

import * as utils from "../../services/utils";
import * as productsActions from "../../services/store/products/productsActions";

const ProductDetails = () => {
    const { t } = useTranslation();
    const { locale, catalog, reference } = useParams();
    const { product, isLoadingData } = useSelector((state) => state.product);
    const { products } = useSelector((state) => state.products);
    const { productList } = useSelector((state) => state.productList);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productsActions.getProduct({ locale, catalog, reference }));
    }, [dispatch, locale, catalog, reference]);

    const isProductLoaded = () => {
        return product.pricesHistory ? true : false;
    };

    const renderStatistics = () => {
        if (product.pricesHistory) {
            const maxPrice = Math.max(...product.pricesHistory.map(price => parseFloat(utils.getFormattedPrice(price))));
            const minPrice = Math.min(...product.pricesHistory.map(price => parseFloat(utils.getFormattedPrice(price))));

            return (
                <p><strong>Min:</strong> {minPrice} | <strong>Max:</strong> {maxPrice} | <strong>Avg:</strong> {getAveragePrice(product.pricesHistory)}</p>
            );
        }
    }

    const getAveragePrice = (prices) => {
        var sum = 0;

        for (var i = 0; i < prices.length; i++) {
            var price = parseFloat(utils.getFormattedPrice(prices[i]));
            sum += price;
        }

        return (sum / prices.length).toFixed(2);
    }

    const renderProductPrices = () => {
        const productFiltered = products.filter(cat => cat.locale === locale && cat.catalog === catalog);

        if (productFiltered.length > 0) {
            const prod = productFiltered[0];
            var p = prod.products.filter(prod => prod.reference === reference);
            if (p.length > 0) {
                const { regularPrice, campaignPrice, pricePerQuantity } = p[0];
                const price = campaignPrice ? campaignPrice : regularPrice;

                return (
                    <>
                        {campaignPrice ?
                            (<p><strong>{t("data.product-fields.regular-price")}:</strong> <s>{regularPrice}</s> &nbsp; {campaignPrice}</p>) :
                            (<p><strong>{t("data.product-fields.regular-price")}:</strong> {regularPrice}</p>)
                        }
                        <p><strong>{t("data.product-fields.price-per-quantity")}:</strong> {pricePerQuantity}</p>
                        <p>{renderPriceIndicator(product.pricesHistory, price)}</p>
                        <br />
                    </>
                );
            }
        }
    }

    const renderPriceIndicator = (prices, currentPrice) => {
        const averagePrice = prices.reduce((acc, curr) => acc + parseFloat(utils.getFormattedPrice(curr)), 0) / prices.length;
        const productPrice = parseFloat(utils.convertTextToFloat(currentPrice));

        if (productPrice === averagePrice) {
            return (
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{t("data.product-titles.price-indicator-info")}</Tooltip>}>
                    <div>
                        <strong>{t("data.product-titles.price-indicator")}: </strong><span className="badge-orange">{productPrice}€</span>
                    </div>
                </OverlayTrigger>
            );
        } else if (productPrice > averagePrice) {
            return (
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{t("data.product-titles.price-indicator-info")}</Tooltip>}>
                    <div>
                        <strong>{t("data.product-titles.price-indicator")}: </strong><span className="badge-red">{productPrice}€</span>
                    </div>
                </OverlayTrigger>
            );
        } else {
            return (
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{t("data.product-titles.price-indicator-info")}</Tooltip>}>
                    <div>
                        <strong>{t("data.product-titles.price-indicator")}: </strong><span className="badge-green">{productPrice}€</span>
                    </div>
                </OverlayTrigger>
            );
        }
    };

    const renderProductData = () => {
        return (
            <>
                <div className="mb-3">
                    <p><strong>{t("data.product-fields.locale")}:</strong> {product.locale} | <strong>{t("data.product-fields.catalog")}:</strong> {product.catalog} | <strong>{t("data.product-fields.reference")}:</strong> {product.reference}</p>
                </div>
                <div className="mb-3">
                    <p><strong>{t("data.product-fields.name")}:</strong> {product.name ? product.name : "-"}</p>
                    <p><strong>{t("data.product-fields.brand")}:</strong> {product.brand ? product.brand : "-"}</p>
                    <p><strong>{t("data.product-fields.quantity")}:</strong> {product.quantity ? product.quantity : "-"}</p>
                    <p><strong>{t("data.product-fields.description")}:</strong> {product.description ? product.description : "-"}</p>
                </div>
                <div>
                    {renderProductPrices()}
                </div>
            </>
        );
    };

    const renderTable = () => {
        return (
            <table className="BorderLine">
                <thead>
                    <tr>
                        <th>{t("data.product-fields.regular-price")}</th>
                        <th>{t("data.product-fields.campaign-price")}</th>
                        <th>{t("data.product-fields.price-per-quantity")}</th>
                        <th>{t("data.product-fields.quantity")}</th>
                        <th>{t("general.date")}</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableData(product.pricesHistory)}
                </tbody>
            </table>
        );
    };

    const renderTableData = (pricesHistory) => {
        const prices = Object.assign([], pricesHistory);

        if (prices) {
            prices.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });

            return prices.map((prod) => {
                const { regularPrice, campaignPrice, pricePerQuantity, quantity, date } = prod;
                const dateFormatted = date.split(" ")[0];
                return (
                    <tr>
                        <td>{regularPrice}</td>
                        <td>{campaignPrice}</td>
                        <td>{pricePerQuantity}</td>
                        <td>{quantity}</td>
                        <td>{dateFormatted}</td>
                    </tr>
                )
            })
        }
    };

    const createChartData = (prices) => {
        const chartData = [];
        if (prices) {
            prices.forEach((value) => {
                chartData.push({
                    price: utils.getFormattedPrice(value),
                    pricePerQuantity: value.pricePerQuantity,
                    quantity: value.quantity,
                    date: utils.getFormattedDate(value.date),
                });
            });
        }
        return chartData;
    };

    const renderAddToListButton = () => {
        const productFiltered = products.filter(cat => cat.locale === locale && cat.catalog === catalog);

        if (productFiltered.length > 0) {
            const prod = productFiltered[0];
            var p = prod.products.filter(prod => prod.reference === reference);
            if (p.length > 0) {
                return (
                    <Button variant="secondary" onClick={() => {
                        const productData = p[0];
                        const product = productList.find((prod) => prod.key === locale + catalog + productData.reference);
                        if (product) {
                            product.quantity = product.quantity + 1;
                            dispatch(productsActions.addToProductList(product));
                        } else {
                            dispatch(productsActions.addToProductList({ key: locale + catalog + productData.reference, locale, catalog, productData, quantity: 1 }));
                        }
                    }}>
                        {t("data.product-fields.add-to-list")}
                    </Button>
                );
            }
        }
    };

    return (
        <>
            {!isLoadingData && !isProductLoaded() ? (
                <center>
                    <h2 style={{ color: "red" }}>{t("general.no-data")}</h2>
                </center>
            ) : (<></>)
            }
            {!isLoadingData && isProductLoaded() ? (
                <>
                    <Container>
                        <Row>
                            <center>
                                <h2>
                                    <strong>{t("title.product-details")}</strong>
                                </h2>
                                <br />
                            </center>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <center>
                                    <img className="product-img" src={product.imageUrl} alt="" />
                                </center>
                            </Col>
                            <Col md="auto">
                                <center>
                                    {renderProductData()}
                                </center>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <center>
                                <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary">
                                        {t("data.product-fields.store-page")}
                                    </Button>
                                </a>
                                &nbsp;
                                {renderAddToListButton()}
                            </center>
                        </Row>
                        <br />
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <center>
                                    <br />
                                    <h4><strong>{t("general.price-evolution")}</strong></h4>
                                    {renderStatistics()}
                                    <PricesChart data={createChartData(product.pricesHistory)} />
                                </center>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <center>
                                    <br />
                                    <h4><strong>{t("general.prices-history")}</strong></h4>
                                    {renderTable()}
                                </center>
                            </Col>
                        </Row>
                    </Container>
                </>
            ) : (<Loader />)
            }
        </>
    );
}

export default ProductDetails;