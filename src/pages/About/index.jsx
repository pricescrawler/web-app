/**
 * Module dependencies.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `About`.
 */

function About() {
  const { t } = useTranslation();
  const email = `mailto:${import.meta.env.VITE_EMAIL}`;

  return (
    <center>
      <div className={'h2'}>
        <strong>{t('menu.about')}</strong>
      </div>
      <br />
      <p>{t('pages.about.text1')}</p>
      <p>{t('pages.about.text2')}</p>
      <p>{t('pages.about.text3')}</p>
      <br />
      <p>
        <strong>{t('pages.about.contact')}:</strong>
        &nbsp;
        <a
          className={'u-email'}
          href={email}
        >
          E-mail
        </a>
      </p>
    </center>
  );
}

export default About;
