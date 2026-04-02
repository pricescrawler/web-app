/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import * as productsActions from '@services/store/products/productsActions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, GitCompareArrows, History, Plus, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductCard`.
 */

function ProductCard({
  catalog,
  historyEnabled,
  isInComparison,
  locale,
  onToggleCompare,
  productData
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const [added, setAdded] = useState(false);

  const truncate = (value, max = 40) =>
    value && value.length > max ? `${value.substring(0, max)}…` : value;

  const addToList = (event) => {
    event.preventDefault();
    const product = productList.find(
      (prod) => prod.key === `${locale}.${catalog}.${productData.reference}`
    );

    if (product) {
      dispatch(
        productsActions.addToProductList({
          ...product,
          quantity: product.quantity + 1
        })
      );
    } else {
      dispatch(
        productsActions.addToProductList({
          catalog,
          historyEnabled,
          key: `${locale}.${catalog}.${productData.reference}`,
          locale,
          product: productData,
          quantity: 1
        })
      );
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasCampaign = !!productData.campaignPrice;

  return (
    <Card
      className={
        'group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border border-border/60 bg-card'
      }
    >
      {/* Campaign badge */}
      {hasCampaign && (
        <div
          className={
            'absolute top-3 right-3 z-10 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-1 flex items-center gap-1 shadow-md'
          }
        >
          <Tag size={9} />
          PROMO
        </div>
      )}

      {/* Compare button */}
      {onToggleCompare && (
        <button
          className={`absolute top-3 left-3 z-10 rounded-full p-1.5 shadow-md transition-colors ${
            isInComparison
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground border border-border'
          }`}
          onClick={onToggleCompare}
          title={isInComparison ? t('general.comparison.remove') : t('general.comparison.add')}
        >
          <GitCompareArrows size={12} />
        </button>
      )}

      {/* Product image */}
      <div className={'relative flex items-center justify-center p-4 h-[140px] overflow-hidden'}>
        <img
          alt={productData.name || 'Product'}
          className={
            'max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105'
          }
          referrerPolicy={'no-referrer'}
          src={productData.imageUrl || '/logo.png'}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      <CardContent className={'flex-1 p-4 flex flex-col gap-2'}>
        {/* Name */}
        <p
          className={'font-semibold text-sm leading-tight min-h-[2.5rem] line-clamp-2'}
          title={productData.name}
        >
          {productData.name || '-'}
        </p>

        {/* Price */}
        <div className={'flex items-baseline gap-2'}>
          {hasCampaign ? (
            <>
              <span className={'text-lg font-bold text-green-600 dark:text-green-400'}>
                {productData.campaignPrice}
              </span>
              <span className={'text-sm text-muted-foreground line-through'}>
                {productData.regularPrice}
              </span>
            </>
          ) : (
            <span className={'text-lg font-bold'}>{productData.regularPrice || '-'}</span>
          )}
        </div>

        {/* Price per quantity */}
        {productData.pricePerQuantity && (
          <p className={'text-xs text-muted-foreground'}>
            {truncate(productData.pricePerQuantity)}
          </p>
        )}

        {/* Meta info */}
        <div className={'mt-auto pt-2 border-t border-border/50 flex flex-col gap-1'}>
          {productData.brand && (
            <p className={'text-xs text-muted-foreground'}>
              <span className={'font-medium text-foreground/70'}>
                {t('data.product-fields.brand')}:
              </span>{' '}
              {truncate(productData.brand, 30)}
            </p>
          )}
          {productData.quantity && (
            <p className={'text-xs text-muted-foreground'}>
              <span className={'font-medium text-foreground/70'}>
                {t('data.product-fields.quantity')}:
              </span>{' '}
              {truncate(productData.quantity, 30)}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className={'p-3 pt-0 flex gap-2'}>
        <a
          className={'flex-1'}
          href={productData.productUrl}
          rel={'noopener noreferrer'}
          target={'_blank'}
        >
          <button
            className={
              'w-full h-full flex items-center justify-center text-xs font-medium py-2 px-3 rounded-md border border-border hover:bg-accent transition-colors'
            }
          >
            <ExternalLink size={12} />
          </button>
        </a>

        {historyEnabled && (
          <Link
            className={'flex-1'}
            to={`/product/${locale}/${catalog}/${productData.reference}`}
          >
            <button
              className={
                'w-full h-full flex items-center justify-center text-xs font-medium py-2 px-3 rounded-md border border-border hover:bg-accent transition-colors'
              }
            >
              <History size={12} />
            </button>
          </Link>
        )}

        <button
          className={`flex-1 flex items-center justify-center text-xs font-medium py-2 px-3 rounded-md transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          onClick={addToList}
        >
          {added ? <Check size={12} /> : <Plus size={12} />}
        </button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
