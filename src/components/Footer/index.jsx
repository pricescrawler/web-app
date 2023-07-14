/**
 * Module dependencies.
 */

import './index.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Function `Footer`.
 */

function Footer() {
  const { t } = useTranslation();
  const [mobileAppUrl] = useState(import.meta.env.VITE_MOBILE_APP_URL);

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
        {mobileAppUrl && (
          <Link
            className={'nav-footer-link'}
            rel={'noopener noreferrer'}
            target={'_blank'}
            to={mobileAppUrl}
          >
            {t('menu.mobile-app')}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Export `Footer`.
 */

export default Footer;
