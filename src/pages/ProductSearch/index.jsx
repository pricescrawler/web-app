/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from 'react-bootstrap';
import Loader from '@components/Loader';
import Maintenance from '@components/Maintenance';
import ProductCard from '@components/ProductCard';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductSearch`.
 */

function ProductSearch() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState(t('menu.order.default'));
  const [catalogs] = useState(JSON.parse(import.meta.env.VITE_CATALOGS_JSON));
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

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
      setOrderBy(t('menu.order.default'));
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
    } else {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'info',
        text: 'Catalogs or search query missing.',
        title: 'Info'
      });
    }
  };

  const handleStoreRemoval = (catalogValue) => {
    const updatedCatalogs = selectedCatalogs.filter((catalog) => catalog.value !== catalogValue);

    setSelectedCatalogs(updatedCatalogs);
  };

  const handleCatalog = (ev) => {
    const selectedCatalog = ev.target.value[ev.target.value.length - 1];
    const isCatalogSelected = selectedCatalogs.some((catalog) => catalog.label === selectedCatalog);

    if (isCatalogSelected) {
      const updatedCatalogs = selectedCatalogs.filter(
        (catalog) => catalog.label !== selectedCatalog
      );

      setSelectedCatalogs(updatedCatalogs);
    } else {
      const catalogToAdd = catalogs.find((catalog) => catalog.label === selectedCatalog);

      if (catalogToAdd) {
        const updatedCatalogs = [...selectedCatalogs, catalogToAdd];

        setSelectedCatalogs(updatedCatalogs);
      }
    }
  };

  /**
   * `renderSearchContainer`.
   */

  const renderSearchContainer = () => (
    <div className={'homepage__search'}>
      <div className={'homepage__search-container'}>
        <FormControl
          fullWidth
          sx={{ border: '1px solid #dee2e6' }}
        >
          {selectedCatalogs.length === 0 && (
            <InputLabel id={'search-multi-select-label'}>{t('general.search')}</InputLabel>
          )}
          <Select
            className={'homepage__multi'}
            labelId={'search-multi-select-label'}
            multiple
            onChange={handleCatalog}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((catalog, index) => (
                  <Chip
                    key={`chip-${index}`}
                    label={catalog.label}
                    onDelete={() => handleStoreRemoval(catalog.value)}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    size={'small'}
                    variant={'outlined'}
                  />
                ))}
              </Box>
            )}
            value={selectedCatalogs}
          >
            {catalogs
              .sort((a1, b1) => {
                if (a1.selected && !b1.selected) {
                  return -1;
                }
                if (!a1.selected && b1.selected) {
                  return 1;
                }

                return a1.label.localeCompare(b1.label);
              })
              .map((catalog, index) => {
                const isSelected = selectedCatalogs.some(
                  (selectedCatalog) => selectedCatalog.value === catalog.value
                );

                return (
                  <MenuItem
                    key={`menu-item-${index}`}
                    value={catalog.label}
                  >
                    <Checkbox
                      checked={isSelected}
                      color={'secondary'}
                    />
                    <ListItemText primary={catalog.label} />
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <form
          action={'POST'}
          className={'homepage__form'}
          onSubmit={handleProductSearch}
        >
          <FormControl fullWidth>
            <Stack
              direction={'row'}
              spacing={0.4}
            >
              <TextField
                autoComplete={'off'}
                className={'homepage__textfield'}
                color={'secondary'}
                fullWidth
                label={t('general.search-for-some-product')}
                onChange={(event) => setSearchValue(event.target.value)}
                variant={'outlined'}
              />
              <Divider
                color={'secondary'}
                flexItem
                orientation={'vertical'}
                spacing={1}
                variant={'middle'}
              />
              <Button
                className={'homepage__search-button'}
                color={'secondary'}
                endIcon={<SendIcon />}
                sx={{ textTransform: 'capitalize' }}
                type={'submit'}
                variant={'contained'}
              >
                {t('general.search')}
              </Button>
            </Stack>
          </FormControl>
        </form>
      </div>
    </div>
  );

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
          {renderSearchContainer()}
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
