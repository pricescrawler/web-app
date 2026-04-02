/**
 * Module dependencies.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `PrivacyTerms`.
 */

function PrivacyTerms() {
  const { t } = useTranslation();

  return (
    <div className={'max-w-2xl mx-auto px-4 py-10'}>
      <div className={'text-center mb-8'}>
        <div
          className={'inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mb-4'}
        >
          <ShieldCheck
            className={'text-muted-foreground'}
            size={24}
          />
        </div>
        <h2 className={'text-2xl font-bold tracking-tight'}>{t('menu.privacy-terms')}</h2>
      </div>

      <div className={'flex flex-col gap-4'}>
        <Card>
          <CardContent
            className={'p-5 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground'}
          >
            <p>{t('pages.privacy-terms.text1')}</p>
            <p>{t('pages.privacy-terms.text2')}</p>
            <p>{t('pages.privacy-terms.delete-local-data-text')}</p>
          </CardContent>
        </Card>

        <div className={'flex justify-center'}>
          <Button
            className={'gap-2'}
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            variant={'destructive'}
          >
            <Trash2 size={14} />
            {t('pages.privacy-terms.delete-local-data-button')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyTerms;
