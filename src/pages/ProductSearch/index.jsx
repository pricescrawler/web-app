/**
 * Module dependencies.
 */

import './index.css';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Accordion, Button, ButtonGroup, Form, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@components/Loader';
import { MultiSelect } from 'react-multi-select-component';
import ProductCard from '@components/ProductCard';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductSearch`.
 */

function ProductSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs] = useState(JSON.parse(import.meta.env.VITE_CATALOGS_JSON));

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );
  const { isLoadingData, products } = useSelector((state) => state.products);

  const currentProducts = Object.assign([], products);

  /**
   * `handleProductSearch`.
   */

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
    } else {
      // eslint-disable-next-line no-alert
      return alert('Catalogs or search query missing.');
    }
  };

  /**
   * `renderSearchContainer`.
   */

  const renderSearchContainer = () => (
    <center>
      <div className={'search-container'}>
        <MultiSelect
          className={'search-text mb-1'}
          labelledBy={'Select'}
          onChange={setSelectedCatalogs}
          options={catalogs}
          value={selectedCatalogs}
        />
        <Form
          className={'d-flex'}
          onSubmit={handleProductSearch}
        >
          <FormControl
            className={'me-1'}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t('general.search-for-some-product')}
            type={'search'}
          />
          <Button
            type={'submit'}
            variant={'secondary'}
          >
            {t('general.search')}
          </Button>
        </Form>
      </div>
    </center>
  );

  /**
   * `orderByPriceASC`.
   */

  const orderByPriceASC = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      // eslint-disable-next-line id-length
      element.products.sort((a, b) => utils.getFormattedPrice(a) - utils.getFormattedPrice(b))
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `orderByPriceDESC`.
   */

  const orderByPriceDESC = (event) => {
    event.preventDefault();

    currentProducts.map((element) =>
      // eslint-disable-next-line id-length
      element.products.sort((a, b) => utils.getFormattedPrice(b) - utils.getFormattedPrice(a))
    );

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `renderFilterOptions`.
   */

  const renderFilterOptions = () => {
    if (currentProducts.length > 0) {
      return (
        <div className={'d-flex justify-content-end mt-3 mb-3 me-1'}>
          <ButtonGroup>
            <Button
              onClick={orderByPriceASC}
              variant={'outline-secondary'}
            >
              {t('menu.order.asc')}
            </Button>
            <Button
              onClick={orderByPriceDESC}
              variant={'outline-secondary'}
            >
              {t('menu.order.desc')}
            </Button>
          </ButtonGroup>
        </div>
      );
    }
  };

  /**
   * `renderProductSearchResults`.
   */

  const renderProductSearchResults = () => (
    <div>
      {currentProducts.map((productCatalogs, index) => (
        <Accordion
          alwaysOpen
          className={'m-1'}
          defaultActiveKey={['0']}
          key={index}
        >
          <Accordion.Item eventKey={'0'}>
            <Accordion.Header>
              <strong>{utils.renderCatalogName(productCatalogs)}</strong>
            </Accordion.Header>
            <Accordion.Body>
              <div className={'catalog-grid'}>
                {productCatalogs.products.map((product, index) => (
                  <ProductCard
                    catalog={productCatalogs.catalog}
                    historyEnabled={productCatalogs.data.historyEnabled}
                    key={index}
                    locale={'pt'}
                    productData={product}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );

  return (
    <>
      <center>
        <h2>
          <strong>{t('menu.home')}</strong>
        </h2>
      </center>
      <br />
      {renderSearchContainer()}
      {renderFilterOptions()}
      {!isLoadingData ? renderProductSearchResults() : <Loader />}
    </>
  );
}

/**
 * Export `ProductSearch`.
 */

export default ProductSearch;
