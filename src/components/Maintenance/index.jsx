import { Container, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Maintenance = () => {
  const { t } = useTranslation();
  const [maintenanceEndDate] = useState(import.meta.env.VITE_MAINTENANCE_END_DATE);

  const getTimeRemaining = useCallback(() => {
    const targetDate = new Date(maintenanceEndDate).getTime();
    const now = new Date().getTime();
    const timeDiff = targetDate - now;

    if (timeDiff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }, [maintenanceEndDate]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 10);

    return () => clearInterval(intervalId);
  }, [getTimeRemaining]);

  return (
    <Container>
      <center>
        <Typography variant={'h1'}>{t('title.maintenance')}</Typography>
        <Typography variant={'body1'}>{t('general.maintenance')}</Typography>

        <div>
          {timeRemaining.days > 0 && (
            <span>
              {timeRemaining.days} day{timeRemaining.days > 1 ? 's' : ''}
            </span>
          )}
          <span>
            {timeRemaining.hours.toString().padStart(2, '0')}:
            {timeRemaining.minutes.toString().padStart(2, '0')}:
            {timeRemaining.seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </center>
    </Container>
  );
};

export default Maintenance;
