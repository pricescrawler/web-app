/**
 * Module dependencies.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Function `Footer`.
 */

function Footer() {
  const { t } = useTranslation();
  const [mobileAppUrl] = useState(import.meta.env.VITE_MOBILE_APP_URL);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isMobileApp = localStorage.getItem('isMobileApp') === 'true';

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');

    setIsSmallScreen(mq.matches);
    const handler = (e) => setIsSmallScreen(e.matches);

    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <footer className={'mt-auto border-t border-border/50 bg-[#1a1d20]'}>
      <div
        className={'max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6'}
      >
        <Link
          className={'text-sm text-white/50 hover:text-white transition-colors'}
          to={'/about'}
        >
          {t('menu.about')}
        </Link>
        <span className={'text-white/20 text-xs'}>·</span>
        <Link
          className={'text-sm text-white/50 hover:text-white transition-colors'}
          to={'/privacy-terms'}
        >
          {t('menu.privacy-terms')}
        </Link>
        {!isSmallScreen && !isMobileApp && mobileAppUrl && (
          <>
            <span className={'text-white/20 text-xs'}>·</span>
            <a
              className={'text-sm text-white/50 hover:text-white transition-colors'}
              href={mobileAppUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              {t('menu.mobile-app')}
            </a>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;
