/**
 * Module dependencies.
 */

import './index.scss';
import { Button } from '@mui/material';
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
  const donateUrl = import.meta.env.VITE_DONATE_URL;
  const mobileAppUrl = import.meta.env.VITE_MOBILE_APP_URL;

  return (
    <center>
      <h2 className={'h2 about__heading'}>{t('menu.about')}</h2>
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
      {donateUrl ? (
        <>
          <br />
          <a
            href={donateUrl}
            rel={'noopener noreferrer'}
            target={'_blank'}
          >
            <Button
              color={'warning'}
              style={{ textTransform: 'capitalize' }}
              variant={'contained'}
            >
              {t('general.donate')}
            </Button>
          </a>
        </>
      ) : (
        <></>
      )}
    </center>
  );
}

export default About;
