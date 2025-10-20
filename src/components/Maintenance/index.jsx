import React, { useCallback, useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
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

    return { days, hours, minutes, seconds };
  }, [maintenanceEndDate]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [getTimeRemaining]);

  return (
    <Stack
      alignItems={'center'}
      spacing={2}
    >
      <Typography variant={'h4'}>{t('title.maintenance')}</Typography>
      <Typography variant={'body1'}>{t('general.maintenance')}</Typography>

      <p>
        {timeRemaining.days > 0 && (
          <span>
            {timeRemaining.days} day{timeRemaining.days > 1 ? 's' : ''}
          </span>
        )}
        &nbsp; - &nbsp;
        <span>
          {timeRemaining.hours.toString().padStart(2, '0')}:
          {timeRemaining.minutes.toString().padStart(2, '0')}:
          {timeRemaining.seconds.toString().padStart(2, '0')}
          &nbsp; hours
        </span>
      </p>
    </Stack>
  );
};

export default Maintenance;
