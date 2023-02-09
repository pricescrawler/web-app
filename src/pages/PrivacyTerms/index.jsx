/**
 * Module dependencies.
 */

import { Button } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `PrivacyTerms`.
 */

function PrivacyTerms() {
  const { t } = useTranslation();

  return (
    <center>
      <div className={'h2'}>
        <strong>{t('menu.privacy-terms')}</strong>
      </div>
      <br />
      <p>{t('pages.privacy-terms.text1')}</p>
      <p>{t('pages.privacy-terms.text2')}</p>
      <br />
      <br />
      <p>
        <strong>{t('pages.privacy-terms.delete-local-data-text')}</strong>
      </p>
      <br />
      <Button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        variant={'danger'}
      >
        {t('pages.privacy-terms.delete-local-data-button')}
      </Button>
    </center>
  );
}

/**
 * Export `PrivacyTerms`.
 */

export default PrivacyTerms;
