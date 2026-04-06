/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import * as utils from '@services/utils';
import { useTranslation } from 'react-i18next';

/**
 * Helpers.
 */

const getBestIndex = (items, getNumericValue) => {
  const values = items.map(getNumericValue);
  const valid = values.filter((v) => v !== null && isFinite(v));
  if (valid.length === 0) return -1;
  const min = Math.min(...valid);
  return values.indexOf(min);
};

/**
 * Function `ComparisonModal`.
 */

function ComparisonModal({ items, open, onOpenChange }) {
  const { t } = useTranslation();

  const rows = [
    {
      label: t('general.comparison.price-final'),
      getValue: (item) => item.productData.campaignPrice || item.productData.regularPrice || null,
      getNumeric: (item) => parseFloat(utils.getFormattedPrice(item.productData)) || null,
      isBest: true
    },
    {
      label: t('data.product-fields.regular-price'),
      getValue: (item) => item.productData.regularPrice || null,
      getNumeric: () => null,
      isBest: false
    },
    {
      label: t('data.product-fields.campaign-price'),
      getValue: (item) => item.productData.campaignPrice || null,
      getNumeric: () => null,
      isBest: false
    },
    {
      label: t('data.product-fields.price-per-quantity'),
      getValue: (item) => item.productData.pricePerQuantity || null,
      getNumeric: (item) => utils.tryParsePrice(item.productData.pricePerQuantity),
      isBest: true
    },
    {
      label: t('data.product-fields.brand'),
      getValue: (item) => item.productData.brand || null,
      getNumeric: () => null,
      isBest: false
    },
    {
      label: t('data.product-fields.quantity'),
      getValue: (item) => item.productData.quantity || null,
      getNumeric: () => null,
      isBest: false
    }
  ];

  const bestIndexes = rows.map((row) => (row.isBest ? getBestIndex(items, row.getNumeric) : -1));

  const visibleRows = rows.filter((row) => items.some((item) => row.getValue(item)));

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className={'max-w-5xl w-[calc(100vw-2rem)] overflow-hidden p-4 sm:p-6'}>
        <DialogHeader>
          <DialogTitle>{t('general.comparison.title')}</DialogTitle>
        </DialogHeader>

        {/* Mobile: stacked cards */}
        <div className={'flex flex-col gap-3 sm:hidden overflow-y-auto max-h-[70vh]'}>
          {items.map((item, colIdx) => (
            <div
              className={'border border-border rounded-lg overflow-hidden'}
              key={`${item.locale}.${item.catalog}.${item.productData.reference}`}
            >
              <div className={'flex items-center gap-3 p-3 bg-muted/20 border-b border-border'}>
                <img
                  alt={item.productData.name}
                  className={'w-10 h-10 object-contain flex-shrink-0'}
                  referrerPolicy={'no-referrer'}
                  src={item.productData.imageUrl || '/logo.png'}
                  onError={utils.handleImageError}
                />
                <div className={'min-w-0'}>
                  <p className={'text-xs font-semibold leading-tight line-clamp-2'}>
                    {item.productData.name}
                  </p>
                  <p className={'text-xs text-muted-foreground mt-0.5'}>
                    {utils.renderCatalogName(item)}
                  </p>
                </div>
                {item.productData.productUrl && (
                  <a
                    className={'ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground'}
                    href={item.productData.productUrl}
                    rel={'noopener noreferrer'}
                    target={'_blank'}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className={'divide-y divide-border'}>
                {visibleRows.map((row) => {
                  const value = row.getValue(item);
                  const isBest = bestIndexes[rows.indexOf(row)] === colIdx && value !== null;
                  return (
                    <div
                      className={'flex items-center justify-between px-3 py-2'}
                      key={row.label}
                    >
                      <span className={'text-xs text-muted-foreground'}>{row.label}</span>
                      {value ? (
                        <span
                          className={`text-xs font-medium ${isBest ? 'text-green-600 dark:text-green-400 font-bold' : ''}`}
                        >
                          {isBest && (
                            <span
                              className={
                                'mr-1 text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full'
                              }
                            >
                              {t('general.comparison.best')}
                            </span>
                          )}
                          {value}
                        </span>
                      ) : (
                        <span className={'text-xs text-muted-foreground'}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className={'hidden sm:block overflow-x-auto'}>
          <table
            className={'w-full border-collapse'}
            style={{ minWidth: `${Math.max(items.length * 180 + 128, 400)}px` }}
          >
            <thead>
              <tr>
                <th className={'w-32'} />
                {items.map((item) => (
                  <th
                    className={'pb-4 px-3 text-center align-bottom'}
                    key={`${item.locale}.${item.catalog}.${item.productData.reference}`}
                  >
                    <div className={'flex flex-col items-center gap-2'}>
                      <div className={'w-16 h-16 flex items-center justify-center overflow-hidden'}>
                        <img
                          alt={item.productData.name}
                          className={'max-w-full max-h-full object-contain'}
                          referrerPolicy={'no-referrer'}
                          src={item.productData.imageUrl || '/logo.png'}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <span
                        className={'text-xs font-semibold leading-tight line-clamp-2 text-center'}
                      >
                        {item.productData.name}
                      </span>
                      <span className={'text-xs text-muted-foreground'}>
                        {utils.renderCatalogName(item)}
                      </span>
                      {item.productData.productUrl && (
                        <a
                          className={
                            'flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
                          }
                          href={item.productData.productUrl}
                          rel={'noopener noreferrer'}
                          target={'_blank'}
                        >
                          <ExternalLink size={11} />
                          {t('general.comparison.view-product')}
                        </a>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row, rowIdx) => {
                const bestIdx = bestIndexes[rows.indexOf(row)];
                return (
                  <tr
                    className={rowIdx % 2 === 0 ? 'bg-muted/20' : ''}
                    key={row.label}
                  >
                    <td
                      className={
                        'py-3 px-3 text-xs font-medium text-muted-foreground whitespace-nowrap'
                      }
                    >
                      {row.label}
                    </td>
                    {items.map((item, colIdx) => {
                      const value = row.getValue(item);
                      const isBest = bestIdx === colIdx && value !== null;
                      return (
                        <td
                          className={'py-3 px-3 text-sm text-center'}
                          key={`${item.locale}.${item.catalog}.${item.productData.reference}`}
                        >
                          {value ? (
                            <span
                              className={
                                isBest ? 'font-bold text-green-600 dark:text-green-400' : ''
                              }
                            >
                              {isBest && (
                                <span
                                  className={
                                    'mr-1 text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium'
                                  }
                                >
                                  {t('general.comparison.best')}
                                </span>
                              )}
                              {value}
                            </span>
                          ) : (
                            <span className={'text-muted-foreground'}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ComparisonModal;
