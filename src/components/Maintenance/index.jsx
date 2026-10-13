import React, { useCallback, useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Maintenance = () => {
  const { t } = useTranslation();
  const maintenanceEndDate = new Date(import.meta.env.VITE_MAINTENANCE_END_DATE).getTime();

  const getTimeRemaining = useCallback(() => {
    const timeDiff = Math.max(0, maintenanceEndDate - new Date().getTime());

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return { timeDiff, days, hours, minutes, seconds };
  }, [maintenanceEndDate]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getTimeRemaining]);

  const countdownUnits = [
    ...(timeRemaining.days > 0 ? [['days', timeRemaining.days]] : []),
    ['hours', timeRemaining.hours],
    ['minutes', timeRemaining.minutes],
    ['seconds', timeRemaining.seconds]
  ];

  return (
    <div
      className={
        'flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm animate-rise'
      }
    >
      <div className={'rounded-full bg-primary/10 p-4 text-primary'}>
        <Wrench className={'size-8 animate-wiggle'} />
      </div>
      <h2 className={'text-2xl font-bold'}>{t('title.maintenance')}</h2>
      <p className={'text-muted-foreground'}>{t('general.maintenance')}</p>

      {timeRemaining.timeDiff > 0 && (
        <div className={'flex flex-col items-center gap-3 pt-2'}>
          <p className={'text-sm font-medium text-muted-foreground'}>
            {t('general.maintenance-countdown.title')}
          </p>
          <div className={'flex gap-3'}>
            {countdownUnits.map(([unit, value]) => (
              <div
                key={unit}
                className={'w-16 rounded-lg bg-muted py-2 sm:w-20'}
              >
                <p className={'text-2xl font-semibold tabular-nums sm:text-3xl'}>
                  {value.toString().padStart(2, '0')}
                </p>
                <p className={'text-xs text-muted-foreground'}>
                  {t(`general.maintenance-countdown.${unit}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
