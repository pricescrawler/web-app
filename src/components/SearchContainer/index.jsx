import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SearchContainer = ({ setOrder }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs, setCatalogs] = useState([]);
  const inputErrorT = t('pages.search.input-error');
  const catalogErrorT = t('pages.search.catalog-error');
  const url = import.meta.env.VITE_API_URL;

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );

  useEffect(() => {
    const cachedData = localStorage.getItem('catalogData');
    const cachedTimestamp = localStorage.getItem('catalogDataTimestamp');

    if (cachedData && cachedTimestamp) {
      const currentTime = new Date().getTime();
      const cacheDuration = 24 * 60 * 60 * 1000;

      if (currentTime - parseInt(cachedTimestamp, 10) < cacheDuration) {
        const parsedData = JSON.parse(cachedData);

        setCatalogs(parsedData);
        setSelectedCatalogs(parsedData.filter((catalog) => catalog.selected));

        return;
      }
    }

    fetch(`${url}/api/v1/locales`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedCatalogs = [];

        data.forEach((locale) => {
          locale.categories.forEach((category) => {
            category.catalogs.forEach((catalog) => {
              if (catalog.active) {
                if (catalog.stores.length === 0) {
                  const catalogData = {
                    label: catalog.name,
                    selected: catalog.data.selected,
                    value: catalog.id
                  };

                  fetchedCatalogs.push(catalogData);
                } else {
                  catalog.stores.forEach((store) => {
                    const catalogData = {
                      label: `${catalog.name} - ${store.name}`,
                      selected: !!store.data.selected,
                      value: `${catalog.id}#${store.id}`
                    };

                    fetchedCatalogs.push(catalogData);
                  });
                }
              }
            });
          });
        });

        localStorage.setItem('catalogData', JSON.stringify(fetchedCatalogs));
        localStorage.setItem('catalogDataTimestamp', new Date().getTime().toString());

        setCatalogs(fetchedCatalogs);
        setSelectedCatalogs(fetchedCatalogs.filter((catalog) => catalog.selected));
      })
      .catch((error) => {
        Swal.fire({
          confirmButtonColor: '#6c757d',
          icon: 'error',
          text: `${catalogErrorT} - (${error})`,
          title: 'Error'
        });
      });
  }, [url, catalogErrorT]);

  const handleStoreRemoval = (catalogValue) => {
    const updatedCatalogs = selectedCatalogs.filter((catalog) => catalog.value !== catalogValue);

    setSelectedCatalogs(updatedCatalogs);
  };

  const handleCatalog = (ev) => {
    const selectedCatalog = ev.target.value[ev.target.value.length - 1];

    if (selectedCatalog === 'select-all') {
      if (selectedCatalogs.length !== catalogs.length) {
        setSelectedCatalogs([...catalogs]);
      } else {
        setSelectedCatalogs([]);
      }
    } else {
      const isCatalogSelected = selectedCatalogs.some(
        (catalog) => catalog.label === selectedCatalog
      );

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
    }
  };

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      setOrder(t('menu.order.default'));
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
    } else {
      Swal.fire({
        confirmButtonColor: '#6c757d',
        icon: 'info',
        text: inputErrorT,
        title: 'Info'
      });
    }
  };

  return (
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
            <MenuItem value={'select-all'}>
              <Checkbox
                checked={selectedCatalogs.length === catalogs.length}
                color={'secondary'}
              />
              <ListItemText primary={t('pages.search.select-all')} />
            </MenuItem>
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
};

SearchContainer.propTypes = {
  setOrder: PropTypes.func.isRequired
};

export default SearchContainer;
