/**
 * Module dependencies.
 */

import { QRCode } from 'antd';
import React from 'react';
import packageJson from '../../../package.json';
import { useTranslation } from 'react-i18next';

/**
 * Function `About`.
 */

function About() {
  const { t } = useTranslation();
  const email = `mailto:${import.meta.env.VITE_EMAIL}`;
  const mobileAppUrl = import.meta.env.VITE_MOBILE_APP_URL;

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
        <strong>{t('pages.about.version')}:</strong>
        &nbsp;
        {packageJson.version}
      </p>
      <br />
      <p>
        <strong>{t('pages.about.contact')}:</strong>
        <br />
        <a
          className={'u-email'}
          href={email}
        >
          E-mail
        </a>
      </p>
      {mobileAppUrl ? (
        <>
          <br />
          <p>
            <strong>{t('menu.mobile-app')}:</strong>
            <br />
            <a href={mobileAppUrl}>Google Play</a>
            <QRCode
              errorLevel={'H'}
              icon={'/logo.png'}
              value={mobileAppUrl}
            />
          </p>
        </>
      ) : (
        <></>
      )}
    </center>
  );
}

export default About;
