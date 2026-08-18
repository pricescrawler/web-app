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

        const list = Array.isArray(data) ? data : [];

        setEntries(list);
        markChangelogAsSeen(list[0]?.date);
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
    <div className={'max-w-2xl mx-auto px-4 py-8'}>
      <h2 className={'text-2xl font-bold tracking-tight mb-6 text-center'}>
        {t('menu.whats-new')}
      </h2>

      {!loading && entries.length === 0 ? (
        <div className={'flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center'}>
          <Sparkles
            className={'text-muted-foreground/30'}
            size={48}
          />
          <p className={'text-muted-foreground font-medium'}>{t('pages.whats-new.empty.title')}</p>
          <p className={'text-muted-foreground/70 text-sm'}>
            {t('pages.whats-new.empty.subtitle')}
          </p>
        </div>
      ) : (
        <div className={'flex flex-col gap-4'}>
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
      )}
    </div>
  );
}

export default WhatsNew;
