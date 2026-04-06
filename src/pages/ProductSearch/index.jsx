/**
 * Module dependencies.
 */

import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUpDown, GalleryHorizontal, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import ComparisonBar from '@components/ComparisonBar';
import ComparisonModal from '@components/ComparisonModal';
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
  const [orderBy, setOrderBy] = useState('');
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('productSearchViewMode') || 'scroll'
  );
  const [comparisonItems, setComparisonItems] = useState([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ max: '', min: '' });

  const isLoadingData = useSelector((state) => state.isLoadingData);
  const products = useSelector((state) => state.products);
  const currentProducts = useMemo(() => [...products], [products]);

  const availableBrands = useMemo(() => {
    const brands = new Set();

    currentProducts.forEach((catalog) => {
      catalog.products.forEach((product) => {
        if (product.brand) brands.add(product.brand);
      });
    });

    return [...brands].sort();
  }, [currentProducts]);

  const activeFilterCount =
    selectedBrands.length + (priceRange.min !== '' ? 1 : 0) + (priceRange.max !== '' ? 1 : 0);

  const filteredProducts = useMemo(() => {
    if (activeFilterCount === 0) return currentProducts;

    return currentProducts
      .map((catalog) => ({
        ...catalog,
        products: catalog.products.filter((product) => {
          if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
          const price = parseFloat(utils.getFormattedPrice(product));
          if (priceRange.min !== '' && price < parseFloat(priceRange.min)) return false;
          if (priceRange.max !== '' && price > parseFloat(priceRange.max)) return false;
          return true;
        })
      }))
      .filter((catalog) => catalog.products.length > 0);
  }, [activeFilterCount, currentProducts, priceRange, selectedBrands]);

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setPriceRange({ max: '', min: '' });
  }, []);

  const handleSortChanges = useCallback(
    (value) => {
      setOrderBy(value);

      let sortingFunction;

      switch (value) {
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

      const updatedProducts = currentProducts.map((element) => ({
        ...element,
        products: [...element.products].sort(sortingFunction)
      }));

      dispatch(productsActions.getProductsSuccess(updatedProducts));
    },
    [currentProducts, dispatch, t]
  );

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem('productSearchViewMode', mode);
  }, []);

  const toggleComparison = useCallback((item) => {
    const key = `${item.locale}.${item.catalog}.${item.productData.reference}`;
    setComparisonItems((prev) => {
      const exists = prev.find(
        (i) => `${i.locale}.${i.catalog}.${i.productData.reference}` === key
      );
      if (exists)
        return prev.filter((i) => `${i.locale}.${i.catalog}.${i.productData.reference}` !== key);
      if (prev.length >= 4) return prev;
      return [...prev, item];
    });
  }, []);

  const isInComparison = useCallback(
    (catalog, locale, reference) =>
      comparisonItems.some(
        (i) => i.catalog === catalog && i.locale === locale && i.productData.reference === reference
      ),
    [comparisonItems]
  );

  const totalResults = filteredProducts.reduce((acc, cat) => acc + cat.products.length, 0);

  return (
    <div>
      {/* Search section */}
      <div className={'border-b border-border/60 bg-background pt-8 pb-10 px-4'}>
        <div className={'max-w-2xl mx-auto text-center mb-6'}>
          <h1 className={'text-3xl sm:text-4xl font-bold tracking-tight mb-1'}>{t('menu.home')}</h1>
          <p className={'text-muted-foreground text-sm'}>{t('general.search-for-some-product')}</p>
        </div>
        {isMaintenanceMode === 'true' ? (
          <div className={'max-w-2xl mx-auto'}>
            <Maintenance />
          </div>
        ) : (
          <div className={'max-w-2xl mx-auto'}>
            <SearchContainer />
          </div>
        )}
      </div>

      {/* Results section */}
      {isMaintenanceMode !== 'true' && (
        <div
          className={`max-w-7xl mx-auto px-4 py-6 ${comparisonItems.length > 0 ? 'pb-24 sm:pb-20' : ''}`}
        >
          {isLoadingData ? (
            <Loader />
          ) : currentProducts.length > 0 ? (
            <>
              {/* Results header */}
              <div className={'flex items-center justify-between mb-4 flex-wrap gap-3'}>
                <p className={'text-sm text-muted-foreground'}>
                  <span className={'font-semibold text-foreground'}>{totalResults}</span>{' '}
                  {totalResults === 1 ? 'resultado' : 'resultados'} em{' '}
                  <span className={'font-semibold text-foreground'}>{filteredProducts.length}</span>{' '}
                  {filteredProducts.length === 1 ? 'loja' : 'lojas'}
                </p>
                <div className={'flex items-center gap-3'}>
                  {/* Filters toggle */}
                  <button
                    className={`flex items-center gap-1.5 h-8 px-3 rounded-md border text-sm transition-colors ${
                      filtersOpen || activeFilterCount > 0
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted text-muted-foreground'
                    }`}
                    onClick={() => setFiltersOpen((v) => !v)}
                  >
                    <SlidersHorizontal size={13} />
                    {t('pages.filters.title')}
                    {activeFilterCount > 0 && (
                      <span
                        className={
                          'bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1'
                        }
                      >
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  {/* View mode toggle */}
                  <div
                    className={'flex items-center border border-border rounded-md overflow-hidden'}
                  >
                    <button
                      className={`p-1.5 transition-colors ${viewMode === 'scroll' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                      onClick={() => handleViewModeChange('scroll')}
                      title={t('menu.view-mode-scroll')}
                    >
                      <GalleryHorizontal size={15} />
                    </button>
                    <button
                      className={`p-1.5 transition-colors border-l border-border ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                      onClick={() => handleViewModeChange('grid')}
                      title={t('menu.view-mode-grid')}
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className={'flex items-center gap-2'}>
                    <ArrowUpDown
                      className={'text-muted-foreground'}
                      size={14}
                    />
                    <Select
                      onValueChange={handleSortChanges}
                      value={orderBy}
                    >
                      <SelectTrigger className={'w-full sm:w-[200px] h-8 text-sm'}>
                        <SelectValue placeholder={t('menu.order.default')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t('menu.order.asc')}>{t('menu.order.asc')}</SelectItem>
                        <SelectItem value={t('menu.order.desc')}>{t('menu.order.desc')}</SelectItem>
                        <SelectItem value={t('menu.order.asc-price-per-quantity')}>
                          {t('menu.order.asc-price-per-quantity')}
                        </SelectItem>
                        <SelectItem value={t('menu.order.desc-price-per-quantity')}>
                          {t('menu.order.desc-price-per-quantity')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Filter panel */}
              {filtersOpen && (
                <div
                  className={
                    'mb-4 p-4 border border-border rounded-lg bg-muted/20 flex flex-col gap-4'
                  }
                >
                  <div className={'flex flex-col sm:flex-row gap-4'}>
                    {/* Brand filter */}
                    {availableBrands.length > 0 && (
                      <div className={'flex-1'}>
                        <p className={'text-xs font-medium mb-2 text-muted-foreground'}>
                          {t('pages.filters.brand')}
                        </p>
                        <div className={'flex flex-wrap gap-1.5'}>
                          {availableBrands.map((brand) => (
                            <button
                              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                                selectedBrands.includes(brand)
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background border-border hover:bg-muted'
                              }`}
                              key={brand}
                              onClick={() =>
                                setSelectedBrands((prev) =>
                                  prev.includes(brand)
                                    ? prev.filter((b) => b !== brand)
                                    : [...prev, brand]
                                )
                              }
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price range filter */}
                    <div className={'shrink-0'}>
                      <p className={'text-xs font-medium mb-2 text-muted-foreground'}>
                        {t('pages.filters.price-range')}
                      </p>
                      <div className={'flex items-center gap-2'}>
                        <input
                          className={
                            'w-20 bg-background border border-input rounded-md px-2 py-1 text-sm outline-none focus:border-ring transition-colors'
                          }
                          min={'0'}
                          placeholder={t('pages.filters.price-min')}
                          type={'number'}
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                          }
                        />
                        <span className={'text-muted-foreground text-sm'}>—</span>
                        <input
                          className={
                            'w-20 bg-background border border-input rounded-md px-2 py-1 text-sm outline-none focus:border-ring transition-colors'
                          }
                          min={'0'}
                          placeholder={t('pages.filters.price-max')}
                          type={'number'}
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      className={
                        'self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors'
                      }
                      onClick={clearFilters}
                    >
                      <X size={12} />
                      {t('pages.filters.clear')}
                    </button>
                  )}
                </div>
              )}

              {/* Scroll horizontal view */}
              {viewMode === 'scroll' && (
                <div className={'space-y-4'}>
                  {filteredProducts.map((productCatalogs, index) => (
                    <div
                      className={
                        'border border-border rounded-lg shadow-sm overflow-hidden bg-card'
                      }
                      key={index}
                    >
                      <div
                        className={
                          'px-5 py-3 bg-muted/50 border-b border-border flex items-center gap-3'
                        }
                      >
                        <span className={'font-semibold text-sm'}>
                          {utils.renderCatalogName(productCatalogs)}
                        </span>
                        <span
                          className={
                            'text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border'
                          }
                        >
                          {productCatalogs.products.length}
                        </span>
                      </div>
                      <div className={'px-4 py-4 overflow-x-auto'}>
                        <div
                          className={'flex gap-3'}
                          style={{ width: 'max-content' }}
                        >
                          {productCatalogs.products.map((product, idx) => (
                            <div
                              className={'w-[175px] flex-shrink-0'}
                              key={idx}
                            >
                              <ProductCard
                                catalog={productCatalogs.catalog}
                                historyEnabled={productCatalogs.data.historyEnabled}
                                isInComparison={isInComparison(
                                  productCatalogs.catalog,
                                  productCatalogs.locale,
                                  product.reference
                                )}
                                locale={productCatalogs.locale}
                                onToggleCompare={() =>
                                  toggleComparison({
                                    catalog: productCatalogs.catalog,
                                    data: productCatalogs.data,
                                    historyEnabled: productCatalogs.data.historyEnabled,
                                    locale: productCatalogs.locale,
                                    productData: product
                                  })
                                }
                                productData={product}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid view */}
              {viewMode === 'grid' && (
                <Accordion
                  defaultValue={filteredProducts.map((_, i) => `item-${i}`)}
                  type={'multiple'}
                >
                  {filteredProducts.map((productCatalogs, index) => (
                    <AccordionItem
                      className={
                        'border border-border rounded-lg mb-4 shadow-sm overflow-hidden bg-card border-l-4 border-l-primary/40'
                      }
                      key={index}
                      value={`item-${index}`}
                    >
                      <AccordionTrigger
                        className={
                          'px-5 py-3 hover:no-underline hover:bg-muted/40 transition-colors bg-muted/20'
                        }
                      >
                        <div className={'flex items-center gap-3'}>
                          <span className={'font-semibold text-sm'}>
                            {utils.renderCatalogName(productCatalogs)}
                          </span>
                          <span
                            className={
                              'text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border'
                            }
                          >
                            {productCatalogs.products.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className={'px-4 pb-5 pt-3'}>
                        <div
                          className={
                            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'
                          }
                        >
                          {productCatalogs.products.map((product, idx) => (
                            <ProductCard
                              catalog={productCatalogs.catalog}
                              historyEnabled={productCatalogs.data.historyEnabled}
                              isInComparison={isInComparison(
                                productCatalogs.catalog,
                                productCatalogs.locale,
                                product.reference
                              )}
                              key={idx}
                              locale={productCatalogs.locale}
                              onToggleCompare={() =>
                                toggleComparison({
                                  catalog: productCatalogs.catalog,
                                  data: productCatalogs.data,
                                  historyEnabled: productCatalogs.data.historyEnabled,
                                  locale: productCatalogs.locale,
                                  productData: product
                                })
                              }
                              productData={product}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          ) : null}
        </div>
      )}
      <ComparisonBar
        items={comparisonItems}
        onClear={() => setComparisonItems([])}
        onCompare={() => setComparisonOpen(true)}
        onRemove={(item) => toggleComparison(item)}
      />

      <ComparisonModal
        items={comparisonItems}
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
      />
    </div>
  );
}

export default ProductSearch;
