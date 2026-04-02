/**
 * Module dependencies.
 */

import * as utils from '@services/utils';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useTranslation } from 'react-i18next';

/**
 * Function `PricesChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeLS = localStorage.getItem('site-dark-mode');

    if (darkModeLS !== null) {
      setIsDarkMode(JSON.parse(darkModeLS));
    }
  }, []);

  const createChartData = (prices) => {
    const chartData = [];
    const uniqueDates = new Set();
    const average = parseFloat(utils.getAveragePrice(prices));

    if (prices) {
      prices.forEach((value) => {
        const date = new Date(value.date);

        if (!uniqueDates.has(date.toISOString())) {
          uniqueDates.add(date.toISOString());

          chartData.push({
            avg: average,
            date: date.toLocaleDateString(),
            price: parseFloat(utils.getFormattedPrice(value))
          });
        }
      });

      chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return chartData;
  };

  const chartData = createChartData(data);
  const axisColor = isDarkMode ? '#ccc' : '#666';

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer
        height={250}
        width={'100%'}
      >
        <LineChart
          data={chartData}
          margin={{ bottom: 5, left: 0, right: 10, top: 5 }}
        >
          <CartesianGrid strokeDasharray={'3 3'} />
          <XAxis
            dataKey={'date'}
            stroke={axisColor}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke={axisColor}
            tick={{ fontSize: 11 }}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey={'avg'}
            dot={false}
            name={t('data.product-titles.price-avg')}
            stroke={'red'}
            type={'linear'}
          />
          <Line
            dataKey={'price'}
            dot={false}
            name={t('data.product-fields.regular-price')}
            stroke={isDarkMode ? 'white' : 'black'}
            type={'linear'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Export `PricesChart`.
 */

export default PricesChart;
