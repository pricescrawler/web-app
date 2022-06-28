import "./index.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Loader from "../../components/Loader";
import * as utils from "../../services/utils";
import * as productsActions from "../../services/store/products/productsActions";

import { Button } from "react-bootstrap";

const ProductList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { productList, isLoadingData } = useSelector((state) => state.productList);
    const [isListUpdated, setIsListUpdated] = useState(true);

    useEffect(() => {
        if (productList && productList.length > 0) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            productList.forEach((prod) => {
                const productDate = new Date(prod.productData.date);
                const productParseDate = new Date(productDate.getFullYear(), productDate.getMonth(), productDate.getDate());
                return setIsListUpdated(today.getTime() === productParseDate.getTime());
            });
        }
    }, [productList]);

    const removeFromProductList = (e, prod) => {
        e.preventDefault();
        prod.quantity = prod.quantity - 1;
        dispatch(productsActions.removeFromProductList(prod));
    };

    const addToProductList = (e, prod) => {
        e.preventDefault();
        prod.quantity = prod.quantity + 1;
        dispatch(productsActions.addToProductList(prod));
    };

    const updateList = (e) => {
        e.preventDefault();
        dispatch(productsActions.getUpdatedProductList(productList));
    }

    const renderTotalPrice = () => {
        if (productList) {
            return productList.reduce((acc, prod) => {
                return acc + (utils.getFormattedPrice(prod.productData) * prod.quantity);
            }, 0).toFixed(2);
        }
    };

    const renderTotalPriceByCatalog = () => {
        if (productList) {
            const catalogs = productList.reduce((acc, prod) => {
                if (!acc.includes(prod.catalog)) {
                    acc.push(prod.catalog);
                }
                return acc;
            }, []);
            return catalogs.map((catalog) => {
                const totalPrice = productList.reduce((acc, prod) => {
                    if (prod.catalog === catalog) {
                        return acc + (utils.getFormattedPrice(prod.productData) * prod.quantity);
                    } else {
                        return acc;
                    }
                }, 0);
                return `${catalog}: ${totalPrice.toFixed(2)}€; `;
            });
        }
    };

    const renderTable = () => {
        return (
            <div className="product-list-table">
                <table>
                    <thead>
                        <tr>
                            <th>{t("data.product-fields.image")}</th>
                            <th>{t("data.product-fields.catalog")}</th>
                            <th>{t("data.product-fields.reference")}</th>
                            <th>{t("data.product-fields.name")}</th>
                            <th>{t("data.product-fields.regular-price")}</th>
                            <th>{t("data.product-fields.price-per-quantity")}</th>
                            <th>{t("data.product-fields.quantity")}</th>
                            <th>{t("data.product-fields.history-page")}</th>
                            <th>{t("data.product-fields.store-page")}</th>
                            <th>{t("data.product-fields.remove-add")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderTableData = () => {
        if (productList) {
            return productList.map((prod) => {
                const { locale, catalog, productData, quantity, historyEnabled } = prod;
                const { reference, name, regularPrice, campaignPrice, pricePerQuantity } = productData;

                return (
                    <tr>
                        <td>
                            <img className="product-list-img" src={productData.imageUrl} alt="" />
                        </td>
                        <td>{locale}.{catalog}</td>
                        <td>{reference}</td>
                        <td>{name}</td>
                        {campaignPrice ?
                            (<td><s>{regularPrice}</s> &nbsp; {campaignPrice}</td>) :
                            (<td>{regularPrice}</td>)
                        }
                        <td>{pricePerQuantity}</td>
                        <td>{quantity}</td>
                        <td>
                            {historyEnabled ? (
                                <Link to={`/product/${locale}/${catalog}/${reference}`} target="_self">
                                    <Button variant="secondary">{t("general.go")}</Button>
                                </Link>
                            ) : <></>}
                        </td>
                        <td>
                            <a href={productData.productUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary">{t("general.go")}</Button>
                            </a>
                        </td>
                        <td>
                            <Button variant="secondary" onClick={(e) => removeFromProductList(e, prod)}>-</Button>
                            &nbsp;
                            <Button variant="secondary" onClick={(e) => addToProductList(e, prod)}>+</Button>
                        </td>
                    </tr>
                );
            });
        }
    };

    return (
        <center>
            <h2>
                <strong>{t("title.products-list")}</strong>
            </h2>
            <br />
            {!isLoadingData ? (
                <>
                    {renderTable()}
                    <br />
                    <div>
                        <h5><strong>{t("general.total-price")}:</strong> {renderTotalPrice()}€</h5>
                        <br />
                        <h6><strong>{t("general.total-price-by-catalog")}:</strong></h6>
                        <p>{renderTotalPriceByCatalog()}</p>
                    </div>
                    <br />
                    {!isListUpdated ? (
                        <>
                            <Button variant="secondary" onClick={updateList}>
                                {t("general.refresh-prices")}
                            </Button>
                        </>) : (<> </>)}
                </>) : (<Loader />)
            }
        </center>
    );
}

export default ProductList;