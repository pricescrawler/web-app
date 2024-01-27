/* eslint-disable id-length */
/* eslint-disable no-unused-vars */
/**
 * Module dependencies.
 */

import * as utils from '@services/utils';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Function `PriceChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  const { t } = useTranslation();

  const createChartData = (prices) => {
    const chartData = [];
    const uniqueDates = new Set();
    const average = parseFloat(utils.getAveragePrice(prices));

    if (prices) {
      prices.forEach((value) => {
        const date = new Date(value.date);

        if (!uniqueDates.has(date.toISOString())) {
          uniqueDates.add(date.toISOString());

          chartData.push([date, parseFloat(utils.getFormattedPrice(value)), average]);
        }
      });

      // Sort chartData based on dates
      chartData.sort((a, b) => a[0] - b[0]);
    }

    return chartData;
  };

  const chartData = createChartData(data);

  return (
    <LineChart
      height={300}
      series={[
        {
          color: 'red',
          connectNulls: true,
          data: chartData.map((point) => point[2]),
          label: t('data.product-titles.price-avg'),
          showMark: false
        },
        {
          connectNulls: true,
          data: chartData.map((point) => point[1]),
          label: t('data.product-fields.regular-price'),
          showMark: false
        }
      ]}
      xAxis={[
        {
          data: chartData.map((point) => point[0]),
          scaleType: 'time'
        }
      ]}
    />
  );
}

/**
 * Export `PricesChart`.
 */

export default PricesChart;
