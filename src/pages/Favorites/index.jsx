/**
 * Module dependencies.
 */

import { Heart } from 'lucide-react';
import { removeFavorite } from '@services/store/favorites/favoritesReducer';
import ProductCard from '@components/ProductCard';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash2 } from 'lucide-react';

/**
 * Function `Favorites`.
 */

function Favorites() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  return (
    <div className={'max-w-7xl mx-auto px-4 py-8'}>
      <div className={'flex items-center justify-center gap-3 mb-6'}>
        <h2 className={'text-2xl font-bold tracking-tight'}>{t('pages.favorites.title')}</h2>
      </div>

      {favorites.length > 0 && (
        <div className={'flex items-center justify-end gap-2 mb-6'}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={'sm'}
                variant={'outline'}
              >
                {t('pages.favorites.options.tooltip')}
                <ChevronDown
                  className={'ml-1.5'}
                  size={14}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
              <DropdownMenuItem
                onClick={() => favorites.forEach((item) => dispatch(removeFavorite(item.key)))}
              >
                <Trash2
                  className={'mr-2'}
                  size={14}
                />
                {t('pages.favorites.options.clear-all')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className={'flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center'}>
          <Heart
            className={'text-muted-foreground/30'}
            size={48}
          />
          <p className={'text-muted-foreground font-medium'}>{t('pages.favorites.empty')}</p>
          <p className={'text-muted-foreground/70 text-sm'}>{t('pages.favorites.empty-sub')}</p>
        </div>
      ) : (
        <div
          className={
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'
          }
        >
          {favorites.map((item) => (
            <ProductCard
              catalog={item.catalog}
              historyEnabled={item.historyEnabled}
              isInComparison={false}
              key={item.key}
              locale={item.locale}
              onToggleCompare={null}
              productData={item.productData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Export `Favorites`.
 */

export default Favorites;
