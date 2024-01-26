import './index.scss';
import { Button, FormControlLabel, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { QRCode } from 'antd';
import packageJson from '../../../package.json';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  const email = `mailto:${import.meta.env.VITE_EMAIL}`;
  const donateUrl = import.meta.env.VITE_DONATE_URL;
  const mobileAppUrl = import.meta.env.VITE_MOBILE_APP_URL;
  const isMobileApp = localStorage.getItem('isMobileApp') === 'true';

  const [experimentalEnabled, setExperimentalEnabled] = useState(false);

  useEffect(() => {
    const experimentalEnabledLS = localStorage.getItem('experimentalEnabled');

    if (experimentalEnabledLS !== null) {
      setExperimentalEnabled(JSON.parse(experimentalEnabledLS));
    }

    if (isMobileApp) {
      setExperimentalEnabled(false);
    }
  }, [isMobileApp]);

  const handleExperimentalToggle = () => {
    const newValue = !experimentalEnabled;

    setExperimentalEnabled(newValue);
    localStorage.setItem('experimentalEnabled', JSON.stringify(newValue));
  };

  return (
    <div className={'about'}>
      <div className={'about__container'}>
        <div className={'about__content'}>
          <h2 className={'about__heading h2'}>{t('menu.about')}</h2>
          <p className={'about__paragraph'}>{t('pages.about.text1')}</p>
          <p className={'about__paragraph'}>{t('pages.about.text2')}</p>
          <p className={'about__paragraph'}>{t('pages.about.text3')}</p>
          <br />
          {!isMobileApp && (
            <>
              <p>
                <strong>{t('pages.about.experimental-features')}:</strong>
                &nbsp; &nbsp;
                <FormControlLabel
                  control={
                    <Switch
                      checked={experimentalEnabled}
                      color={'primary'}
                      onChange={handleExperimentalToggle}
                    />
                  }
                />
              </p>
              <br />
            </>
          )}
          <p>
            <strong>{t('pages.about.version')}:</strong>
            &nbsp;
            {packageJson.version}
          </p>
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
          <br />
          {mobileAppUrl ? (
            <p>
              <strong>{t('menu.mobile-app')}:</strong>
              <br />
              <a href={mobileAppUrl}>Google Play</a>
              <center>
                <QRCode
                  bgColor={'#FFFFFF'}
                  errorLevel={'H'}
                  icon={'/logo.png'}
                  value={mobileAppUrl}
                />
              </center>
            </p>
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
        </div>
      </div>
    </div>
  );
}

export default About;
