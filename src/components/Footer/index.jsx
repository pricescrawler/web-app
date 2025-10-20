/**
 * Module dependencies.
 */

import './index.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

/**
 * Function `Footer`.
 */

function Footer() {
  const { t } = useTranslation();
  const [mobileAppUrl] = useState(import.meta.env.VITE_MOBILE_APP_URL);
  const isSmallScreenSize = useMediaQuery('(max-width: 600px)');
  const isMobileApp = localStorage.getItem('isMobileApp') === 'true';

  return (
    <div className={'nav-footer-container'}>
      <div className={'nav-footer'}>
        <Link
          className={'nav-footer-link'}
          to={'/about'}
        >
          {t('menu.about')}
        </Link>
        <Link
          className={'nav-footer-link'}
          to={'/privacy-terms'}
        >
          {t('menu.privacy-terms')}
        </Link>
        {!isSmallScreenSize && !isMobileApp && mobileAppUrl && (
          <a
            className={'nav-footer-link'}
            href={mobileAppUrl}
            rel={'noopener noreferrer'}
            target={'_blank'}
          >
            {t('menu.mobile-app')}
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Export `Footer`.
 */

export default Footer;
