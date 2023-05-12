/**
 * Module dependencies.
 */

import './index.scss';
import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `PrivacyTerms`.
 */

function PrivacyTerms() {
  const { t } = useTranslation();

  return (
    <div className={'terms'}>
      <div className={'terms__container'}>
        <div className={'terms__content'}>
          <h2 className={'terms__heading h2'}>{t('menu.privacy-terms')}</h2>
          <p className={'terms__paragraph'}>{t('pages.privacy-terms.text1')}</p>
          <p className={'terms__paragraph'}>{t('pages.privacy-terms.text2')}</p>
          <p className={'terms__paragraph'}>{t('pages.privacy-terms.delete-local-data-text')}</p>
          <br />
        </div>
        <Button
          className={'terms__btn'}
          color={'error'}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={{ textTransform: 'capitalize' }}
          variant={'contained'}
        >
          {t('pages.privacy-terms.delete-local-data-button')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Export `PrivacyTerms`.
 */

export default PrivacyTerms;
