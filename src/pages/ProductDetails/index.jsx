/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Info,
  Plus,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@components/Loader';
import PricesChart from '@components/PricesChart';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductDetails`.
 */

function ProductDetails() {
  const { t } = useTranslation();
  const { catalog, locale, reference } = useParams();
  const isLoadingData = useSelector((state) => state.isLoadingData);
  const product = useSelector((state) => state.product);
  const products = useSelector((state) => state.products);
  const productList = useSelector((state) => state.productList);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsActions.getProduct({ catalog, locale, reference }));
  }, [dispatch, locale, catalog, reference]);

  const [added, setAdded] = useState(false);

  const isProductLoaded = () => !!product.prices;

  const renderStatistics = () => {
    if (!product.prices) return null;

    const maxPrice = Math.max(
      ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
    );
    const minPrice = Math.min(
      ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
    );

    const stats = [
      { label: t('data.product-titles.price-min'), value: `${minPrice}€` },
      { label: t('data.product-titles.price-max'), value: `${maxPrice}€` },
      {
        label: t('data.product-titles.price-avg'),
        value: `${utils.getAveragePrice(product.prices)}€`
      },
      { label: t('data.product-titles.price-last'), value: utils.getLastPrice(product) }
    ];

    return (
      <div className={'grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl'}>
        {stats.map((stat, i) => (
          <Card
            className={'text-center'}
            key={i}
          >
            <CardContent className={'pt-4 pb-3 px-3'}>
              <p className={'text-xs text-muted-foreground mb-1'}>{stat.label}</p>
              <p className={'text-lg font-bold'}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderEanUpc = (eanUpc) => {
    if (!eanUpc) return null;
    if (eanUpc.length === 1) return eanUpc[0];

    return eanUpc.map((code, index) => (
      <span key={index}>
        <br />
        {code}
      </span>
    ));
  };

  const renderPriceIndicator = (prices, currentPrice) => {
    const averagePrice = utils.getAveragePrice(prices);
    const productPrice = parseFloat(utils.convertToFloat(currentPrice));

    let color, icon, label;

    if (productPrice > averagePrice) {
      color =
        'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800';
      icon = <TrendingUp size={12} />;
      label = `${productPrice}€`;
    } else if (productPrice < averagePrice) {
      color =
        'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800';
      icon = <TrendingDown size={12} />;
      label = `${productPrice}€`;
    } else {
      color =
        'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      icon = null;
      label = `${productPrice}€`;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={'flex items-center gap-1.5'}>
              <span className={'text-sm font-medium text-muted-foreground'}>
                {t('data.product-titles.price-indicator')}:
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}
              >
                {icon}
                {label}
              </span>
              <Info
                className={'text-muted-foreground/50 cursor-help'}
                size={12}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className={'max-w-[200px] text-xs'}>
              {t('data.product-titles.price-indicator-info')}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderProductPrices = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length === 0) return null;
    const p = productFiltered[0].products.filter((prod) => prod.reference === reference);

    if (p.length === 0) return null;

    const { campaignPrice, pricePerQuantity, regularPrice } = p[0];
    const price = campaignPrice || regularPrice;

    return (
      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-baseline gap-2'}>
          {campaignPrice ? (
            <>
              <span className={'text-2xl font-bold text-green-600 dark:text-green-400'}>
                {campaignPrice}
              </span>
              <span className={'text-base text-muted-foreground line-through'}>{regularPrice}</span>
            </>
          ) : (
            <span className={'text-2xl font-bold'}>{regularPrice}</span>
          )}
        </div>
        {pricePerQuantity && <p className={'text-sm text-muted-foreground'}>{pricePerQuantity}</p>}
        {renderPriceIndicator(product.prices, price)}
      </div>
    );
  };

  const renderAddToListButton = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length === 0) return null;
    const p = productFiltered[0].products.filter((prod) => prod.reference === reference);

    if (p.length === 0) return null;

    return (
      <Button
        onClick={() => {
          const productData = p[0];
          const prodInfo = productList.find(
            (prod) => prod.key === `${locale}.${catalog}.${productData.reference}`
          );

          if (prodInfo) {
            dispatch(
              productsActions.addToProductList({
                ...prodInfo,
                quantity: prodInfo.quantity + 1
              })
            );
          } else {
            dispatch(
              productsActions.addToProductList({
                catalog,
                historyEnabled: true,
                key: `${locale}.${catalog}.${productData.reference}`,
                locale,
                product: productData,
                quantity: 1
              })
            );
          }
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        size={'sm'}
        variant={added ? 'default' : 'outline'}
        className={added ? 'bg-green-500 hover:bg-green-500 border-green-500 text-white' : ''}
      >
        {added ? (
          <Check
            className={'mr-1'}
            size={14}
          />
        ) : (
          <Plus
            className={'mr-1'}
            size={14}
          />
        )}
        {t('data.product-fields.add-to-list')}
      </Button>
    );
  };

  const renderProductOutdatedAlert = () => {
    if (!product.prices?.length) return null;

    const lastPrice = product.prices[product.prices.length - 1];
    const now = new Date();
    const lastPriceDate = new Date(lastPrice.date);

    const isOutdated =
      now.getFullYear() !== lastPriceDate.getFullYear() ||
      now.getMonth() !== lastPriceDate.getMonth() ||
      now.getDate() !== lastPriceDate.getDate();

    if (!isOutdated) return null;

    return (
      <Alert
        className={
          'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 max-w-2xl w-full'
        }
        variant={'default'}
      >
        <AlertTriangle className={'text-amber-600 dark:text-amber-400 h-4 w-4'} />
        <AlertDescription className={'text-amber-700 dark:text-amber-300'}>
          {t('data.error.product-outdated')}
        </AlertDescription>
      </Alert>
    );
  };

  if (isLoadingData || !isProductLoaded()) return <Loader />;

  return (
    <div className={'max-w-5xl mx-auto px-4 py-8'}>
      <h2 className={'text-2xl font-bold tracking-tight mb-8 text-center'}>
        {t('title.product-details')}
      </h2>

      {/* Product header */}
      <Card className={'mb-6'}>
        <CardContent className={'p-6'}>
          <div className={'flex flex-col md:flex-row gap-8 items-start'}>
            {/* Image */}
            <div
              className={
                'flex-shrink-0 flex items-center justify-center bg-muted/40 rounded-lg p-4 w-full md:w-48 h-48'
              }
            >
              <img
                alt={product.name}
                className={'max-h-full max-w-full object-contain'}
                loading={'lazy'}
                referrerPolicy={'no-referrer'}
                src={product.imageUrl}
              />
            </div>

            {/* Info */}
            <div className={'flex-1 flex flex-col gap-4'}>
              <div>
                <div className={'flex flex-wrap gap-2 text-xs text-muted-foreground mb-2'}>
                  <span className={'bg-muted px-2 py-0.5 rounded font-mono'}>{product.locale}</span>
                  <span className={'bg-muted px-2 py-0.5 rounded font-mono'}>
                    {product.catalog}
                  </span>
                  <span className={'bg-muted px-2 py-0.5 rounded font-mono'}>
                    {product.reference}
                  </span>
                </div>
                <h3 className={'text-xl font-semibold leading-tight'}>{product.name || '-'}</h3>
              </div>

              <div className={'grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'}>
                {[
                  [t('data.product-fields.brand'), product.brand],
                  [t('data.product-fields.quantity'), product.quantity],
                  [t('data.product-fields.description'), product.description],
                  ['EAN/UPC', product.eanUpc ? renderEanUpc(product.eanUpc) : null]
                ].map(([label, value]) =>
                  value ? (
                    <div key={label}>
                      <span className={'text-muted-foreground text-xs'}>{label}</span>
                      <p className={'font-medium'}>{value}</p>
                    </div>
                  ) : null
                )}
              </div>

              {renderProductPrices()}

              <div className={'flex gap-2 pt-2'}>
                <a
                  href={product.productUrl}
                  rel={'noopener noreferrer'}
                  target={'_blank'}
                >
                  <Button size={'sm'}>
                    <ExternalLink
                      className={'mr-1.5'}
                      size={14}
                    />
                    {t('data.product-fields.store-page')}
                  </Button>
                </a>
                {renderAddToListButton()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price evolution section */}
      <div className={'flex flex-col items-center gap-5 mb-6'}>
        <h4 className={'text-lg font-semibold'}>{t('general.price-evolution')}</h4>
        {renderProductOutdatedAlert()}
        {renderStatistics()}
        <div className={'w-full'}>
          <PricesChart data={product.prices} />
        </div>
      </div>

      {/* Price history table */}
      <div className={'flex flex-col gap-3'}>
        <h4 className={'text-lg font-semibold'}>{t('general.prices-history')}</h4>
        <Card>
          <CardContent className={'p-0'}>
            <div className={'max-h-[420px] overflow-x-auto overflow-y-auto rounded-lg w-full'}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={'text-center sticky top-0'}>
                      {t('data.product-fields.regular-price')}
                    </TableHead>
                    <TableHead className={'text-center sticky top-0'}>
                      {t('data.product-fields.campaign-price')}
                    </TableHead>
                    <TableHead className={'text-center sticky top-0'}>
                      {t('data.product-fields.price-per-quantity')}
                    </TableHead>
                    <TableHead className={'text-center sticky top-0'}>
                      {t('data.product-fields.quantity')}
                    </TableHead>
                    <TableHead className={'text-center sticky top-0'}>
                      {t('general.date')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...product.prices]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className={'text-center'}>{row.regularPrice}</TableCell>
                        <TableCell className={'text-center'}>{row.campaignPrice}</TableCell>
                        <TableCell className={'text-center'}>{row.pricePerQuantity}</TableCell>
                        <TableCell className={'text-center'}>{row.quantity ?? row.name}</TableCell>
                        <TableCell className={'text-center text-muted-foreground text-xs'}>
                          {row.date}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductDetails;
