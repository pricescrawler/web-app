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

/**
 * Function `PriceChart`.
 */

// eslint-disable-next-line react/prop-types
function PricesChart({ data }) {
  return (
    <ResponsiveContainer
      height={'100%'}
      width={'100%'}
    >
      <div className={'chart-container'}>
        <LineChart
          data={data}
          height={150}
          width={500}
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
