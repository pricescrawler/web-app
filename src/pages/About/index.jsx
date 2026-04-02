import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ExternalLink, FlaskConical, Info, Mail, Smartphone, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
    const val = localStorage.getItem('experimentalEnabled');

    if (val !== null) setExperimentalEnabled(JSON.parse(val));
    if (isMobileApp) setExperimentalEnabled(false);
  }, [isMobileApp]);

  const handleExperimentalToggle = () => {
    const newValue = !experimentalEnabled;

    setExperimentalEnabled(newValue);
    localStorage.setItem('experimentalEnabled', JSON.stringify(newValue));
  };

  return (
    <div className={'max-w-2xl mx-auto px-4 py-10'}>
      <div className={'text-center mb-8'}>
        <div
          className={'inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mb-4'}
        >
          <Info
            className={'text-muted-foreground'}
            size={24}
          />
        </div>
        <h2 className={'text-2xl font-bold tracking-tight'}>{t('menu.about')}</h2>
      </div>

      <div className={'flex flex-col gap-4'}>
        {/* Description */}
        <Card>
          <CardContent
            className={'p-5 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground'}
          >
            <p>{t('pages.about.text1')}</p>
            <p>{t('pages.about.text2')}</p>
            <p className={'font-semibold text-foreground'}>{t('pages.about.text3')}</p>
          </CardContent>
        </Card>

        {/* Version */}
        <Card>
          <CardContent className={'p-5 flex items-center justify-between'}>
            <span className={'text-sm text-muted-foreground'}>{t('pages.about.version')}</span>
            <span className={'font-mono text-sm font-semibold bg-muted px-2 py-0.5 rounded'}>
              v{packageJson.version}
            </span>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className={'p-5 flex items-center justify-between'}>
            <div className={'flex items-center gap-2 text-sm'}>
              <Mail
                className={'text-muted-foreground'}
                size={16}
              />
              <span className={'text-muted-foreground'}>{t('pages.about.contact')}</span>
            </div>
            <a
              className={'text-sm font-medium hover:underline'}
              href={email}
            >
              E-mail
            </a>
          </CardContent>
        </Card>

        {/* Experimental features */}
        {!isMobileApp && (
          <Card>
            <CardContent className={'p-5 flex items-center justify-between'}>
              <div className={'flex items-center gap-2'}>
                <FlaskConical
                  className={'text-muted-foreground'}
                  size={16}
                />
                <Label
                  className={'text-sm cursor-pointer'}
                  htmlFor={'experimental-toggle'}
                >
                  {t('pages.about.experimental-features')}
                </Label>
              </div>
              <Switch
                checked={experimentalEnabled}
                id={'experimental-toggle'}
                onCheckedChange={handleExperimentalToggle}
              />
            </CardContent>
          </Card>
        )}

        {/* Mobile app */}
        {mobileAppUrl && (
          <Card>
            <CardContent className={'p-5 flex flex-col items-center gap-4'}>
              <div className={'flex items-center gap-2 self-start'}>
                <Smartphone
                  className={'text-muted-foreground'}
                  size={16}
                />
                <span className={'text-sm font-medium'}>{t('menu.mobile-app')}</span>
              </div>
              <a
                className={'text-sm font-medium hover:underline flex items-center gap-1'}
                href={mobileAppUrl}
              >
                Google Play
                <ExternalLink size={12} />
              </a>
              <QRCodeSVG
                bgColor={'transparent'}
                imageSettings={{ excavate: true, height: 24, src: '/logo.png', width: 24 }}
                level={'H'}
                size={140}
                value={mobileAppUrl}
              />
            </CardContent>
          </Card>
        )}

        {/* Donate */}
        {donateUrl && (
          <div className={'text-center'}>
            <a
              href={donateUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              <Button className={'gap-2'}>
                <Star size={14} />
                {t('general.donate')}
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
