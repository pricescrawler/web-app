/* eslint-disable capitalized-comments */
/**
 * Module dependencies.
 */

import * as utils from '@services/utils';
import { Chart } from 'react-google-charts';
import React from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Function `PriceChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  const { t } = useTranslation();
  const isDarkMode = useTheme().palette.mode === 'dark';

  const [dimensions] = React.useState({
    width: Math.min(window.innerWidth, 1000)
  });

  const options = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    hAxis: {
      textStyle: { color: isDarkMode ? 'white' : 'black' }
    },
    legend: {
      position: 'bottom',
      textStyle: { color: isDarkMode ? 'white' : 'black' }
    },
    vAxis: {
      textStyle: { color: isDarkMode ? 'white' : 'black' }
    },
    width: dimensions.width
  };

  /**
   * Create Chart Data.
   */

  const createChartData = (prices) => {
    const chartData = [
      [
        t('data.product-fields.date'),
        t('data.product-fields.regular-price'),
        // t('data.product-fields.price-per-quantity'),
        t('data.product-titles.price-avg')
      ]
    ];
    const average = parseFloat(utils.getAveragePrice(prices));

    if (prices) {
      prices.forEach((value) => {
        const date = new Date(value.date);

        chartData.push([
          date,
          parseFloat(utils.getFormattedPrice(value)),
          // .parseFloat(utils.convertToFloat(value.pricePerQuantity)),
          average
        ]);
      });
    }

    return chartData;
  };

  return (
    <Chart
      chartType={'LineChart'}
      data={createChartData(data)}
      options={options}
    />
  );
}

/**
 * Export `PricesChart`.
 */

export default PricesChart;
