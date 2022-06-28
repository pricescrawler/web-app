import "./index.css"
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { Accordion, Button, ButtonGroup, Form, FormControl } from "react-bootstrap";

import Loader from "../../components/Loader";
import ProductCard from "../../components/ProductCard";
import * as productsActions from "../../services/store/products/productsActions";
import * as utils from "../../services/utils";

const ProductSearch = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const [catalogs] = useState(JSON.parse(process.env.REACT_APP_CATALOGS_JSON));

    const [selectedCatalogs, setSelectedCatalogs] = useState(catalogs.filter(catalog => catalog.selected));
    const { products, isLoadingData } = useSelector((state) => state.products);
    var currentProducts = Object.assign([], products);

    const handleProductSearch = (e) => {
        e.preventDefault();

        if (searchValue !== "" && selectedCatalogs.length > 0) {
            dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
        } else {
            return alert("Catalogs or search query missing.");
        }
    }

    const renderSearchContainer = () => {
        return (
            <center>
                <div className="search-container">
                    <MultiSelect className="search-text mb-1" options={catalogs} value={selectedCatalogs} onChange={setSelectedCatalogs} labelledBy={"Select"} />
                    <Form className="d-flex" onSubmit={handleProductSearch}>
                        <FormControl className="me-1" type="search" placeholder={t("general.search-for-some-product")} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button type="submit" variant="secondary">{t("general.search")}</Button>
                    </Form>
                </div>
            </center>
        );
    };

    const orderByPriceASC = (e) => {
        e.preventDefault();

        currentProducts.map((element) => (
            element.products.sort((a, b) => {
                return utils.getFormattedPrice(a) - utils.getFormattedPrice(b);
            })
        ));

        dispatch(productsActions.getProductsSuccess(currentProducts));
    };

    const orderByPriceDESC = (e) => {
        e.preventDefault();

        currentProducts.map((element) => (
            element.products.sort((a, b) => {
                return utils.getFormattedPrice(b) - utils.getFormattedPrice(a);
            })
        ));

        dispatch(productsActions.getProductsSuccess(currentProducts));
    };

    const renderFilterOptions = () => {
        if (currentProducts.length > 0) {
            return (
                <div className="d-flex justify-content-end mt-3 mb-3 me-1">
                    <ButtonGroup>
                        <Button variant="outline-secondary" onClick={orderByPriceASC}>{t("menu.order.asc")}</Button>
                        <Button variant="outline-secondary" onClick={orderByPriceDESC}>{t("menu.order.desc")}</Button>
                    </ButtonGroup>
                </div>
            );
        };
    }

    const renderProductSearchResults = () => {
        return (
            <div>
                {currentProducts.map((productCatalogs) => (
                    <Accordion className="m-1" defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <strong>{utils.renderCatalogName(productCatalogs)}</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="catalog-grid">
                                    {productCatalogs.products.map((product) => (
                                        <ProductCard locale="pt" catalog={productCatalogs.catalog} productData={product} historyEnabled={productCatalogs.data.historyEnabled} />
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ))}
            </div>
        );
    };

    return (
        <>
            <center>
                <h2><strong>{t("menu.home")}</strong></h2>
            </center>
            <br />
            {renderSearchContainer()}
            {renderFilterOptions()}
            {!isLoadingData ? renderProductSearchResults() : <Loader />}
        </>
    );
}

export default ProductSearch;