import { Button, FormControlLabel, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { QRCode } from 'antd';
import packageJson from '../../../package.json';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  const email = `mailto:${import.meta.env.VITE_EMAIL}`;
  const donateUrl = import.meta.env.VITE_DONATE_URL;
  const mobileAppUrl = import.meta.env.VITE_MOBILE_APP_URL;

  const [experimentalEnabled, setExperimentalEnabled] = useState(false);

  useEffect(() => {
    const experimentalEnabledLS = localStorage.getItem('experimentalEnabled');

    if (experimentalEnabledLS !== null) {
      setExperimentalEnabled(JSON.parse(experimentalEnabledLS));
    }
  }, []);

  const handleExperimentalToggle = () => {
    const newValue = !experimentalEnabled;

    setExperimentalEnabled(newValue);
    localStorage.setItem('experimentalEnabled', JSON.stringify(newValue));
  };

  return (
    <center>
      <Typography
        className={'about__heading'}
        variant={'h2'}
      >
        {t('menu.about')}
      </Typography>
      <br />
      <p>{t('pages.about.text1')}</p>
      <p>{t('pages.about.text2')}</p>
      <p>{t('pages.about.text3')}</p>
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={experimentalEnabled}
            color={'primary'}
            onChange={handleExperimentalToggle}
          />
        }
        label={t('pages.about.experimental-features')}
      />
      <br />
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
