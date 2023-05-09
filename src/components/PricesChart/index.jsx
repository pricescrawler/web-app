/**
 * Module dependencies.
 */

import './index.scss';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import React from 'react';
import { useMediaQuery } from '@material-ui/core';

/**
 * Function `PriceChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  const isWide = useMediaQuery('(max-width: 1000px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  let chartWidth = 1000;
  let chartHeight = 200;

  if (isMobile) {
    chartWidth = 350;
    chartHeight = 150;
  } else if (isWide) {
    chartWidth = 600;
  }

  return (
    <ResponsiveContainer
      height={'100%'}
      width={'100%'}
    >
      <div className={'chart-container'}>
        <LineChart
          data={data}
          height={chartHeight}
          width={chartWidth}
        >
          <CartesianGrid strokeDasharray={'3 3'} />
          <XAxis dataKey={'date'} />
          <YAxis />
          <Tooltip />
          <Line
            // eslint-disable-next-line id-length
            activeDot={{ r: 8 }}
            dataKey={'price'}
            stroke={'#2b2b2b'}
            strokeWidth={2}
            type={'monotone'}
          />
        </LineChart>
      </div>
    </ResponsiveContainer>
  );
}

/**
 * Export `PricesChart`.
 */

export default PricesChart;
