import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import api from '@services/api';
import { markChangelogAsSeen } from '@services/changelog';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

function WhatsNew() {
  const { i18n, t } = useTranslation();
  const locale = i18n.language === 'pt-PT' ? 'pt-PT' : 'en-GB';
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/api/v1/changelog')
      .then(({ data }) => {
        if (cancelled) return;

        setEntries(data);
        markChangelogAsSeen(data?.[0]?.date);
      })
      .catch((error) => {
        if (cancelled) return;

        toast.error(`${t('general.no-data')} - (${error?.message ?? error})`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className={'max-w-2xl mx-auto px-4 py-10'}>
      <div className={'text-center mb-8'}>
        <div
          className={'inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mb-4'}
        >
          <Sparkles
            className={'text-muted-foreground'}
            size={24}
          />
        </div>
        <h2 className={'text-2xl font-bold tracking-tight'}>{t('menu.whats-new')}</h2>
      </div>

      <div className={'flex flex-col gap-4'}>
        {!loading && entries.length === 0 && (
          <p className={'text-sm text-muted-foreground text-center'}>
            {t('pages.whats-new.empty')}
          </p>
        )}
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className={'p-5 flex flex-col gap-1'}>
              <div className={'flex items-center justify-between gap-2'}>
                <span className={'font-semibold text-sm'}>{entry.title?.[locale]}</span>
                <span className={'text-xs text-muted-foreground shrink-0'}>
                  {new Date(entry.date).toLocaleDateString(locale)}
                </span>
              </div>
              <p className={'text-sm text-muted-foreground leading-relaxed'}>
                {entry.description?.[locale]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default WhatsNew;
