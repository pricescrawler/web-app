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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SearchContainer = ({ setOrder }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs] = useState(JSON.parse(import.meta.env.VITE_CATALOGS_JSON));

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );

  /**
   * `handleProductSearch`.
   */

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      setOrder(t('menu.order.default'));
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
