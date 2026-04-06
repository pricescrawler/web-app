/* eslint-disable react/prop-types */

/**
 * Module dependencies.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Moon, Sun, Menu as MenuIcon, Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

/**
 * Function `NavigationBar`.
 */

function NavigationBar({ theme }) {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const productList = useSelector((state) => state.productList);
  const favorites = useSelector((state) => state.favorites);
  const numberOfProducts = () => productList.reduce((acc, prod) => acc + prod.quantity, 0);
  const logo = '/logo.png';
  const location = useLocation();

  const selectedLanguage = () => {
    if (lang !== 'pt-PT' && lang !== 'en-GB') {
      setLang('en-GB');

      return 'en-GB';
    }

    return lang;
  };

  const { darkMode, setDarkMode } = theme;

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('site-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const count = numberOfProducts();
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 px-1 pb-0.5 border-b-2 ${
      isActive(path)
        ? 'text-white border-white'
        : 'text-white/70 border-transparent hover:text-white hover:border-white/50'
    }`;

  return (
    <nav
      className={'fixed top-0 left-0 right-0 z-50 bg-[#1a1d20] shadow-lg border-b border-white/5'}
    >
      <div className={'max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-3'}>
        {/* Logo + Brand */}
        <Link
          className={'flex items-center gap-2.5 shrink-0'}
          to={'/'}
        >
          <img
            alt={'Prices Crawler logo'}
            className={'rounded-md'}
            height={32}
            src={logo}
            width={32}
          />
          <span className={'font-bold text-white text-base tracking-tight hidden sm:block'}>
            {t('title.base')}
          </span>
        </Link>

        <div className={'flex-1'} />

        {/* Desktop links */}
        <div className={'hidden md:flex items-center gap-5'}>
          <Link
            className={navLinkClass('/')}
            to={'/'}
          >
            {t('menu.home')}
          </Link>

          <Link
            className={`${navLinkClass('/product/list')} flex items-center gap-1.5`}
            to={'/product/list'}
          >
            <ShoppingCart size={14} />
            {t('menu.product-list')}
            {count > 0 && (
              <span
                className={
                  'bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none'
                }
              >
                {count}
              </span>
            )}
          </Link>

          <Link
            className={`${navLinkClass('/favorites')} flex items-center gap-1.5`}
            to={'/favorites'}
          >
            <Heart size={14} />
            {t('menu.favorites')}
            {favorites.length > 0 && (
              <span
                className={
                  'bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none'
                }
              >
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Language select */}
          <Select
            onValueChange={changeLanguage}
            value={selectedLanguage()}
          >
            <SelectTrigger
              className={
                'w-[80px] h-8 bg-white/10 border-white/20 text-white text-xs hover:bg-white/20 focus:ring-white/30 transition-colors'
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'pt-PT'}>🇵🇹 PT</SelectItem>
              <SelectItem value={'en-GB'}>🇬🇧 EN</SelectItem>
            </SelectContent>
          </Select>

          {/* Dark mode toggle */}
          <button
            aria-label={'Toggle dark mode'}
            className={
              'w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200'
            }
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={'flex md:hidden items-center gap-2'}>
          {count > 0 && (
            <Link to={'/product/list'}>
              <div className={'relative'}>
                <ShoppingCart
                  className={'text-white'}
                  size={20}
                />
                <span
                  className={
                    'absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5 leading-none'
                  }
                >
                  {count}
                </span>
              </div>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={'menu'}
                className={
                  'w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors'
                }
              >
                <MenuIcon size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={'end'}
              className={'w-48'}
            >
              <DropdownMenuItem asChild>
                <Link
                  className={'w-full'}
                  to={'/'}
                >
                  {t('menu.home')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className={'w-full flex items-center justify-between'}
                  to={'/product/list'}
                >
                  {t('menu.product-list')}
                  {count > 0 && (
                    <span
                      className={
                        'bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none'
                      }
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className={'w-full flex items-center justify-between'}
                  to={'/favorites'}
                >
                  {t('menu.favorites')}
                  {favorites.length > 0 && (
                    <span
                      className={
                        'bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none'
                      }
                    >
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Select
                  onValueChange={changeLanguage}
                  value={selectedLanguage()}
                >
                  <SelectTrigger
                    className={'w-full border-none focus:ring-0 focus:ring-offset-0 h-7 text-sm'}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'pt-PT'}>🇵🇹 PT</SelectItem>
                    <SelectItem value={'en-GB'}>🇬🇧 EN</SelectItem>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={toggleDarkMode}>
                <span className={'flex items-center gap-2 text-sm'}>
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
