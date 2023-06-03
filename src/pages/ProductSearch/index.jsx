/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from 'react-bootstrap';
import Loader from '@components/Loader';
import Maintenance from '@components/Maintenance';
import ProductCard from '@components/ProductCard';
import SearchContainer from '../../components/SearchContainer';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductSearch`.
 */

function ProductSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [orderBy, setOrderBy] = useState(t('menu.order.default'));
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

  const { isLoadingData, products } = useSelector((state) => state.products);

  const currentProducts = Object.assign([], products);

  /**
   * `orderBy functionality.
   */

  const handleSortChanges = (event) => {
    event.preventDefault();
    setOrderBy(event.target.value);

    let sortingFunction;

    switch (event.target.value) {
      case t('menu.order.asc'):
        sortingFunction = (a1, b1) => utils.getFormattedPrice(a1) - utils.getFormattedPrice(b1);
        break;

      case t('menu.order.desc'):
        sortingFunction = (a1, b1) => utils.getFormattedPrice(b1) - utils.getFormattedPrice(a1);
        break;

      case t('menu.order.asc-price-per-quantity'):
        sortingFunction = (a1, b1) =>
          utils.convertToFloat(a1.pricePerQuantity) - utils.convertToFloat(b1.pricePerQuantity);
        break;

      case t('menu.order.desc-price-per-quantity'):
        sortingFunction = (a1, b1) =>
          utils.convertToFloat(b1.pricePerQuantity) - utils.convertToFloat(a1.pricePerQuantity);
        break;

      default:
        sortingFunction = (a1, b1) => utils.getFormattedPrice(a1) - utils.getFormattedPrice(b1);
    }

    currentProducts.map((element) => element.products.sort(sortingFunction));

    dispatch(productsActions.getProductsSuccess(currentProducts));
  };

  /**
   * `renderFilterOptions`.
   */

  const renderFilterOptions = () => {
    if (currentProducts.length > 0) {
      return (
        <div className={'sort-by-container'}>
          <FormControl>
            <InputLabel id={'sort-by'}>{t('menu.order.default')}</InputLabel>
            <Select
              autoWidth
              id={'sort-by-select'}
              label={'Sort By'}
              labelId={'sort-by'}
              onChange={(ev) => handleSortChanges(ev)}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>{t('menu.order.default')}</em>;
                }

                return selected;
              }}
              value={orderBy}
            >
              <MenuItem value={t('menu.order.asc')}>{t('menu.order.asc')}</MenuItem>
              <MenuItem value={t('menu.order.desc')}>{t('menu.order.desc')}</MenuItem>
              <MenuItem value={t('menu.order.asc-price-per-quantity')}>
                {t('menu.order.asc-price-per-quantity')}
              </MenuItem>
              <MenuItem value={t('menu.order.desc-price-per-quantity')}>
                {t('menu.order.desc-price-per-quantity')}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    }
  };

  /**
   * `renderProductSearchResults`.
   */

  const renderProductSearchResults = () => (
    <div className={'homepage__results'}>
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
                    locale={productCatalogs.locale}
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
    <div className={'homepage'}>
      <h2 className={'homepage__heading h2'}>{t('menu.home')}</h2>
      {isMaintenanceMode ? (
        <Maintenance />
      ) : (
        <>
          <SearchContainer setOrder={setOrderBy} />
          {renderFilterOptions()}
          {!isLoadingData ? renderProductSearchResults() : <Loader />}
        </>
      )}
    </div>
  );
}

/**
 * Export `ProductSearch`.
 */

export default ProductSearch;
