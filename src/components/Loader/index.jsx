/**
 * Module dependencies.
 */

import './index.scss';
import React from 'react';
import { Spin } from 'antd';

/**
 *  Function `Loader.
 */

function Loader() {
  return (
    <div className={'loader'}>
      <Spin
        size={'large'}
        tip={'Loading...'}
      />
    </div>
  );
}

/**
 *  Export `Loader`.
 */

export default Loader;
