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
import { Search, QrCode, X, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '@services/api';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

/**
 * `SearchContainer`.
 */

const SELECTED_CATALOGS_STORAGE_KEY = 'selectedCatalogValues';

const SearchContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [catalogs, setCatalogs] = useState([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedStoreGroups, setExpandedStoreGroups] = useState(new Set());
  const inputErrorT = t('pages.search.input-error');
  const catalogErrorT = t('pages.search.catalog-error');
  const videoRef = useRef(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedCatalogs, setSelectedCatalogs] = useState(
    catalogs.filter((catalog) => catalog.selected)
  );

  const [scannerActive, setScannerActive] = useState(false);

  const handleError = (error) => {
    toast.error(String(error));
    setScannerActive(false);
  };

  const handleScan = (result) => {
    setSearchValue(result.getText());
    dispatch(productsActions.search({ selectedCatalogs, stringValue: result.getText() }));
    scanner.stop();
    setScannerActive(false);
  };

  const toggleScanner = () => {
    if (scannerActive) {
      scanner.stop();
      setScannerActive(false);

      return;
    }

    setSearchValue('');
    setScannerActive(true);
    scanner.barcode(videoRef.current, handleScan, handleError);
  };

  useEffect(() => scanner.stop, []);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
      setSearchHistory(history);
    } catch {
      setSearchHistory([]);
    }
  }, []);

  /**
   * Seeds which categories start expanded — any category that already has a
   * selection (the resolved selection: the user's own last pick if valid, otherwise
   * the backend's curated defaults) opens automatically, everything else starts
   * collapsed so a long catalog list (currently ~20 catalogs across 4 categories,
   * one with ~70 stores) doesn't dump everything on screen at once.
   */

  const seedExpandedCategories = (resolvedSelected) => {
    const categoryIds = new Set(resolvedSelected.map((catalog) => catalog.categoryId));

    setExpandedCategories(categoryIds);
  };

  /**
   * Restores which catalogs should start selected: the user's own last choice
   * (persisted in local storage) if it still validates against the current catalog
   * list, otherwise the backend's curated defaults (data.selected.public). Covers
   * first-time visitors and the case where every catalog the user had picked was
   * since deactivated or removed — falling back instead of showing zero results.
   */

  const resolveSelectedCatalogs = (fetchedCatalogs) => {
    let storedValues = null;

    try {
      storedValues = JSON.parse(localStorage.getItem(SELECTED_CATALOGS_STORAGE_KEY));
    } catch {
      storedValues = null;
    }

    if (Array.isArray(storedValues) && storedValues.length > 0) {
      const validated = fetchedCatalogs.filter((catalog) => storedValues.includes(catalog.value));

      if (validated.length > 0) return validated;
    }

    return fetchedCatalogs.filter((catalog) => catalog.selected);
  };

  const persistSelectedCatalogs = (list) => {
    localStorage.setItem(SELECTED_CATALOGS_STORAGE_KEY, JSON.stringify(list.map((c) => c.value)));
  };

  useEffect(() => {
    const cachedData = localStorage.getItem('catalogData');
    const cachedTimestamp = localStorage.getItem('catalogDataTimestamp');

    if (cachedData && cachedTimestamp) {
      const currentTime = new Date().getTime();
      const cacheDuration = 24 * 60 * 60 * 1000;

      if (currentTime - parseInt(cachedTimestamp, 10) < cacheDuration) {
        const parsedData = JSON.parse(cachedData);
        const resolvedSelected = resolveSelectedCatalogs(parsedData);

        setCatalogs(parsedData);
        setSelectedCatalogs(resolvedSelected);
        seedExpandedCategories(resolvedSelected);
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
                    baseUrl: catalog.baseUrl,
                    categoryId: category.id,
                    categoryName: category.name,
                    clientFetchSearchUrlTemplate: catalog.clientFetchSearchUrlTemplate,
                    isClientFetchRequired: catalog.isClientFetchRequired,
                    kind: 'catalog',
                    label: catalog.name,
                    selected: catalog.data.selected,
                    value: catalog.id
                  });
                } else {
                  catalog.stores.forEach((store) => {
                    fetchedCatalogs.push({
                      categoryId: category.id,
                      categoryName: category.name,
                      kind: 'store',
                      label: `${catalog.name} - ${store.name}`,
                      parentCatalogId: catalog.id,
                      parentCatalogLabel: catalog.name,
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

        const resolvedSelected = resolveSelectedCatalogs(fetchedCatalogs);

        setCatalogs(fetchedCatalogs);
        setSelectedCatalogs(resolvedSelected);
        seedExpandedCategories(resolvedSelected);
        setIsLoadingCatalogs(false);
      })
      .catch((error) => {
        toast.error(`${catalogErrorT} - (${error?.message ?? error})`);
        setIsLoadingCatalogs(false);
      });
  }, [catalogErrorT]);

  const toggleCatalog = (catalog) => {
    const isSelected = selectedCatalogs.some((c) => c.value === catalog.value);
    const updated = isSelected
      ? selectedCatalogs.filter((c) => c.value !== catalog.value)
      : [...selectedCatalogs, catalog];

    setSelectedCatalogs(updated);
    persistSelectedCatalogs(updated);
  };

  const toggleAll = () => {
    const updated = selectedCatalogs.length === catalogs.length ? [] : [...catalogs];

    setSelectedCatalogs(updated);
    persistSelectedCatalogs(updated);
  };

  const toggleCategoryExpanded = (categoryId) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);

      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);

      return next;
    });
  };

  const toggleStoreGroupExpanded = (parentCatalogId) => {
    setExpandedStoreGroups((prev) => {
      const next = new Set(prev);

      if (next.has(parentCatalogId)) next.delete(parentCatalogId);
      else next.add(parentCatalogId);

      return next;
    });
  };

  /**
   * Selects/deselects every standalone (store-less) catalog in a category. Deliberately
   * leaves store-based catalogs (e.g. Intermarché's ~70 stores) alone — bulk-selecting
   * every store at once is rarely what "select this category" means to a user.
   */

  const toggleCategoryStandalone = (standaloneCatalogs) => {
    const allSelected = standaloneCatalogs.every((catalog) =>
      selectedCatalogs.some((selected) => selected.value === catalog.value)
    );

    const updated = allSelected
      ? selectedCatalogs.filter(
          (selected) => !standaloneCatalogs.some((catalog) => catalog.value === selected.value)
        )
      : [
          ...selectedCatalogs,
          ...standaloneCatalogs.filter(
            (catalog) => !selectedCatalogs.some((selected) => selected.value === catalog.value)
          )
        ];

    setSelectedCatalogs(updated);
    persistSelectedCatalogs(updated);
  };

  /**
   * Groups the flat catalog list into category → (standalone catalogs, store groups)
   * for rendering. Kept as a plain flat array for selection state/search dispatch —
   * this is a derived view, not a second source of truth.
   */

  const groupedCatalogs = useMemo(() => {
    const categories = new Map();

    catalogs.forEach((entry) => {
      if (!categories.has(entry.categoryId)) {
        categories.set(entry.categoryId, {
          categoryName: entry.categoryName,
          standalone: [],
          storeGroups: new Map()
        });
      }

      const category = categories.get(entry.categoryId);

      if (entry.kind === 'catalog') {
        category.standalone.push(entry);
      } else {
        if (!category.storeGroups.has(entry.parentCatalogId)) {
          category.storeGroups.set(entry.parentCatalogId, {
            parentCatalogLabel: entry.parentCatalogLabel,
            stores: []
          });
        }

        category.storeGroups.get(entry.parentCatalogId).stores.push(entry);
      }
    });

    return Array.from(categories.entries())
      .map(([categoryId, value]) => ({
        categoryId,
        categoryName: value.categoryName,
        standalone: [...value.standalone].sort((a, b) => a.label.localeCompare(b.label)),
        storeGroups: Array.from(value.storeGroups.entries())
          .map(([parentCatalogId, group]) => ({
            parentCatalogId,
            parentCatalogLabel: group.parentCatalogLabel,
            stores: [...group.stores].sort((a, b) => a.label.localeCompare(b.label))
          }))
          .sort((a, b) => a.parentCatalogLabel.localeCompare(b.parentCatalogLabel))
      }))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }, [catalogs]);

  const isFiltering = catalogFilter.trim() !== '';

  const removeFromHistory = (event, itemToRemove) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const handleProductSearch = (event) => {
    event.preventDefault();

    if (searchValue !== '' && selectedCatalogs.length > 0) {
      dispatch(productsActions.search({ selectedCatalogs, stringValue: searchValue.trim() }));

      // Add to search history
      const trimmed = searchValue.trim();
      setSearchHistory((prev) => {
        const updated = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
        return updated;
      });
      setShowSuggestions(false);
    } else {
      toast.warning(inputErrorT);
    }
  };

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
                <span className={'text-muted-foreground text-sm'}>
                  {t('components.search-container.loading-stores')}
                </span>
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
                        const updated = selectedCatalogs.filter((c) => c.value !== catalog.value);

                        setSelectedCatalogs(updated);
                        persistSelectedCatalogs(updated);
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
          <Command shouldFilter={true}>
            <CommandInput
              onValueChange={setCatalogFilter}
              placeholder={'Pesquisar loja…'}
            />
            <CommandList className={'max-h-80'}>
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
              {groupedCatalogs.map((category) => {
                const categoryExpanded = isFiltering || expandedCategories.has(category.categoryId);
                const standaloneSelectedCount = category.standalone.filter((catalog) =>
                  selectedCatalogs.some((selected) => selected.value === catalog.value)
                ).length;
                const categoryTotal =
                  category.standalone.length +
                  category.storeGroups.reduce((acc, group) => acc + group.stores.length, 0);

                return (
                  <CommandGroup
                    heading={category.categoryName}
                    key={category.categoryId}
                  >
                    <CommandItem
                      onSelect={() => toggleCategoryExpanded(category.categoryId)}
                      value={`cat:${category.categoryName}`}
                    >
                      {categoryExpanded ? (
                        <ChevronDown
                          className={'mr-1 text-muted-foreground shrink-0'}
                          size={14}
                        />
                      ) : (
                        <ChevronRight
                          className={'mr-1 text-muted-foreground shrink-0'}
                          size={14}
                        />
                      )}
                      {category.standalone.length > 0 && (
                        <Checkbox
                          checked={
                            standaloneSelectedCount === category.standalone.length
                              ? true
                              : standaloneSelectedCount > 0
                                ? 'indeterminate'
                                : false
                          }
                          className={'mr-2'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryStandalone(category.standalone);
                          }}
                        />
                      )}
                      <span className={'font-medium'}>{category.categoryName}</span>
                      <span className={'ml-auto text-xs text-muted-foreground'}>
                        {categoryTotal}
                      </span>
                    </CommandItem>

                    {categoryExpanded && (
                      <>
                        {category.standalone.map((catalog) => (
                          <CommandItem
                            className={'pl-8'}
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

                        {category.storeGroups.map((group) => {
                          const groupExpanded =
                            isFiltering || expandedStoreGroups.has(group.parentCatalogId);
                          const selectedStoreCount = group.stores.filter((store) =>
                            selectedCatalogs.some((selected) => selected.value === store.value)
                          ).length;

                          return (
                            <React.Fragment key={group.parentCatalogId}>
                              <CommandItem
                                className={'pl-8'}
                                onSelect={() => toggleStoreGroupExpanded(group.parentCatalogId)}
                                value={`store-group:${group.parentCatalogLabel}`}
                              >
                                {groupExpanded ? (
                                  <ChevronDown
                                    className={'mr-1 text-muted-foreground shrink-0'}
                                    size={14}
                                  />
                                ) : (
                                  <ChevronRight
                                    className={'mr-1 text-muted-foreground shrink-0'}
                                    size={14}
                                  />
                                )}
                                {group.parentCatalogLabel}
                                <span
                                  className={`ml-auto text-xs ${selectedStoreCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                >
                                  {selectedStoreCount > 0
                                    ? t('components.search-container.stores-selected', {
                                        count: selectedStoreCount
                                      })
                                    : t('components.search-container.choose-stores')}
                                </span>
                              </CommandItem>

                              {groupExpanded &&
                                group.stores.map((store) => (
                                  <CommandItem
                                    className={'pl-14'}
                                    key={store.value}
                                    onSelect={() => toggleCatalog(store)}
                                    value={store.label}
                                  >
                                    <Checkbox
                                      checked={selectedCatalogs.some(
                                        (c) => c.value === store.value
                                      )}
                                      className={'mr-2'}
                                    />
                                    {store.label}
                                  </CommandItem>
                                ))}
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}
                  </CommandGroup>
                );
              })}
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
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setShowSuggestions(event.target.value.length > 0);
              }}
              placeholder={t('general.search-for-some-product')}
              value={searchValue}
            />
            {showSuggestions && searchHistory.length > 0 && (
              <div
                className={
                  'absolute top-full left-0 right-0 bg-background border border-input rounded-lg mt-1 shadow-lg z-10 max-h-40 overflow-y-auto'
                }
              >
                {searchHistory
                  .filter((item) => item.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className={'flex items-center group hover:bg-muted transition-colors'}
                    >
                      <button
                        className={'flex-1 text-left px-4 py-2 text-sm outline-none'}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchValue(suggestion);
                          setShowSuggestions(false);
                          dispatch(
                            productsActions.search({ selectedCatalogs, stringValue: suggestion })
                          );
                        }}
                        type={'button'}
                      >
                        {suggestion}
                      </button>
                      <button
                        className={
                          'p-2 mr-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all'
                        }
                        onMouseDown={(e) => removeFromHistory(e, suggestion)}
                        type={'button'}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Button
            className={'px-5 h-[46px] font-semibold shrink-0'}
            type={'submit'}
          >
            {t('general.search')}
          </Button>
          <button
            className={
              'w-12 h-[46px] flex items-center justify-center rounded-lg border border-input hover:bg-muted transition-colors'
            }
            onClick={toggleScanner}
            type={'button'}
          >
            {scannerActive ? (
              <X
                className={'text-muted-foreground'}
                size={18}
              />
            ) : (
              <QrCode
                className={'text-muted-foreground'}
                size={18}
              />
            )}
          </button>
        </div>

        {scannerActive && (
          <div className={'mt-3 flex justify-center'}>
            <video
              autoPlay
              muted
              playsInline
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
