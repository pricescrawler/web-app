/* eslint-disable react/prop-types */
/**
 * Module dependencies.
 */

import { X, GitCompareArrows, Trash2 } from 'lucide-react';
import React from 'react';
import * as utils from '@services/utils';
import { useTranslation } from 'react-i18next';

/**
 * Function `ComparisonBar`.
 */

function ComparisonBar({ items, onRemove, onClear, onCompare }) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <div
      className={
        'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl px-3 py-2 sm:px-4 sm:py-3'
      }
    >
      <div className={'max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'}>
        {/* Product pills */}
        <div className={'flex items-center gap-2 flex-1 overflow-x-auto'}>
          {items.map((item) => (
            <div
              className={
                'relative flex items-center gap-1.5 border border-border rounded-lg px-2 py-1.5 bg-muted/40 flex-shrink-0 sm:gap-2 sm:px-3 sm:min-w-[150px]'
              }
              key={`${item.locale}.${item.catalog}.${item.productData.reference}`}
            >
              <img
                alt={item.productData.name}
                className={'w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0'}
                referrerPolicy={'no-referrer'}
                src={item.productData.imageUrl || '/logo.png'}
                onError={utils.handleImageError}
              />
              <div className={'flex flex-col min-w-0 hidden sm:flex'}>
                <span className={'text-xs font-medium truncate max-w-[100px]'}>
                  {item.productData.name}
                </span>
                <span className={'text-xs text-muted-foreground'}>
                  {utils.renderCatalogName(item)}
                </span>
              </div>
              <button
                className={
                  'absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 hover:bg-destructive hover:text-white hover:border-destructive transition-colors'
                }
                onClick={() => onRemove(item)}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
            <div
              className={
                'hidden sm:flex items-center justify-center border border-dashed border-border rounded-lg px-3 py-2 min-w-[150px] flex-shrink-0 text-xs text-muted-foreground'
              }
              key={i}
            >
              {t('general.comparison.empty-slot')}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={'flex items-center justify-between gap-2 sm:justify-end sm:flex-shrink-0'}>
          <button
            className={
              'flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 sm:py-2 sm:px-3'
            }
            onClick={onClear}
          >
            <Trash2 size={13} />
            <span>{t('general.comparison.clear')}</span>
          </button>
          <button
            className={`flex items-center gap-1.5 text-sm font-medium py-2 px-4 rounded-md transition-colors ${
              items.length < 2
                ? 'bg-primary/40 text-primary-foreground/60 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            disabled={items.length < 2}
            onClick={onCompare}
          >
            <GitCompareArrows size={15} />
            {t('general.comparison.compare')} ({items.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComparisonBar;
