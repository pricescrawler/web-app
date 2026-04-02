/**
 * Module dependencies.
 */

import * as productsActions from '@services/store/products/productsActions';
import * as scanner from '@components/Scanner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, QrCode, X, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import api from '@services/api';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

/**
 * `SearchContainer`.
 */

const SearchContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs, setCatalogs] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const inputErrorT = t('pages.search.input-error');
  const catalogErrorT = t('pages.search.catalog-error');
  const videoRef = useRef(null);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );

  const handleError = (error) => {
    return alert(error);
  };

  const handleScan = (result) => {
    setSearchValue(result.getText());
    dispatch(productsActions.search({ selectedCatalogs, stringValue: result.getText() }));
    scanner.stop();
  };

  const startScanner = () => {
    setSearchValue('');
    scanner.barcode(videoRef.current, handleScan, handleError);
  };

  useEffect(() => {
    const experimentalEnabledLS = localStorage.getItem('experimentalEnabled');

    if (experimentalEnabledLS !== null) {
      setExperimentalFeatures(JSON.parse(experimentalEnabledLS));
    }
  }, []);

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
        setIsLoadingCatalogs(false);

        return;
      }
    }

    setIsLoadingCatalogs(true);

    api
      .get('/api/v1/locales')
      .then((response) => response.data)
      .then((data) => {
        const fetchedCatalogs = [];

        data.forEach((locale) => {
          locale.categories.forEach((category) => {
            category.catalogs.forEach((catalog) => {
              if (catalog.active) {
                if (catalog.stores.length === 0) {
                  fetchedCatalogs.push({
                    label: catalog.name,
                    selected: catalog.data.selected,
                    value: catalog.id
                  });
                } else {
                  catalog.stores.forEach((store) => {
                    fetchedCatalogs.push({
                      label: `${catalog.name} - ${store.name}`,
                      selected: !!store.data.selected,
                      value: `${catalog.id}#${store.id}`
                    });
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
        setIsLoadingCatalogs(false);
      })
      .catch((error) => {
        alert(`${catalogErrorT} - (${error})`);
        setIsLoadingCatalogs(false);
      });
  }, [catalogErrorT]);

  const toggleCatalog = (catalog) => {
    const isSelected = selectedCatalogs.some((c) => c.value === catalog.value);

    if (isSelected) {
      setSelectedCatalogs(selectedCatalogs.filter((c) => c.value !== catalog.value));
    } else {
      setSelectedCatalogs([...selectedCatalogs, catalog]);
    }
  };

  const toggleAll = () => {
    if (selectedCatalogs.length === catalogs.length) {
      setSelectedCatalogs([]);
    } else {
      setSelectedCatalogs([...catalogs]);
    }
  };

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue }));
    } else {
      alert(inputErrorT);
    }
  };

  const sortedCatalogs = [...catalogs].sort((a, b) => {
    if (a.selected && !b.selected) return -1;
    if (!a.selected && b.selected) return 1;

    return a.label.localeCompare(b.label);
  });

  const allSelected = selectedCatalogs.length === catalogs.length && catalogs.length > 0;

  return (
    <div className={'flex flex-col gap-3'}>
      {/* Catalog selector */}
      <Popover
        onOpenChange={setCatalogOpen}
        open={catalogOpen}
      >
        <PopoverTrigger asChild>
          <button
            className={
              'w-full bg-background hover:bg-muted/50 border border-input rounded-lg px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors min-h-11 shadow-sm'
            }
            disabled={isLoadingCatalogs}
            type={'button'}
          >
            <div className={'flex flex-wrap gap-1.5 flex-1'}>
              {isLoadingCatalogs ? (
                <span className={'text-muted-foreground text-sm'}>A carregar lojas…</span>
              ) : selectedCatalogs.length === 0 ? (
                <span className={'text-muted-foreground text-sm'}>
                  {t('pages.search.select-catalog')}
                </span>
              ) : allSelected ? (
                <span className={'text-foreground text-sm font-medium'}>
                  {t('pages.search.select-all')} ({catalogs.length})
                </span>
              ) : (
                selectedCatalogs.slice(0, 4).map((catalog) => (
                  <span
                    className={
                      'bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-xs font-medium flex items-center gap-1'
                    }
                    key={catalog.value}
                  >
                    {catalog.label}
                    <button
                      className={'hover:opacity-70 transition-opacity'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCatalogs(
                          selectedCatalogs.filter((c) => c.value !== catalog.value)
                        );
                      }}
                      type={'button'}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))
              )}
              {!allSelected && selectedCatalogs.length > 4 && (
                <span className={'text-muted-foreground text-xs self-center'}>
                  +{selectedCatalogs.length - 4} mais
                </span>
              )}
            </div>
            <ChevronDown
              className={`text-muted-foreground shrink-0 transition-transform duration-200 ${catalogOpen ? 'rotate-180' : ''}`}
              size={16}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={'start'}
          className={'p-0 w-[var(--radix-popover-trigger-width)] max-w-lg shadow-2xl'}
        >
          <Command>
            <CommandInput placeholder={'Pesquisar loja…'} />
            <CommandList className={'max-h-64'}>
              <CommandEmpty>Nenhuma loja encontrada.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  className={'font-medium'}
                  onSelect={toggleAll}
                  value={'__select-all__'}
                >
                  <Checkbox
                    checked={allSelected}
                    className={'mr-2'}
                  />
                  {t('pages.search.select-all')}
                  <span className={'ml-auto text-xs text-muted-foreground'}>{catalogs.length}</span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup>
                {sortedCatalogs.map((catalog) => (
                  <CommandItem
                    key={catalog.value}
                    onSelect={() => toggleCatalog(catalog)}
                    value={catalog.label}
                  >
                    <Checkbox
                      checked={selectedCatalogs.some((c) => c.value === catalog.value)}
                      className={'mr-2'}
                    />
                    {catalog.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Search input */}
      <form
        action={'POST'}
        onSubmit={handleProductSearch}
      >
        <div className={'flex gap-2'}>
          <div className={'relative flex-1'}>
            <Search
              className={'absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground'}
              size={16}
            />
            <input
              autoComplete={'off'}
              className={
                'w-full bg-background border border-input hover:border-ring/50 focus:border-ring rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-sm'
              }
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t('general.search-for-some-product')}
              value={searchValue}
            />
          </div>
          <Button
            className={'px-5 h-[46px] font-semibold shrink-0'}
            type={'submit'}
          >
            {t('general.search')}
          </Button>
          {experimentalFeatures && (
            <button
              className={
                'w-12 h-[46px] flex items-center justify-center rounded-lg border border-input hover:bg-muted transition-colors'
              }
              onClick={startScanner}
              type={'button'}
            >
              <QrCode
                className={'text-muted-foreground'}
                size={18}
              />
            </button>
          )}
        </div>

        {experimentalFeatures && !searchValue && (
          <div className={'mt-3 flex justify-center'}>
            <video
              ref={videoRef}
              style={{ borderRadius: '0.5rem', height: 'auto', width: '75%' }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchContainer;
