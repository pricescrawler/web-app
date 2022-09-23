/**
 * Module dependencies.
 */

import './index.scss';
import '@services/i18n';
import React, { Suspense } from 'react';
import App from './App';
import Loader from '@components/Loader';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from '@services/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);
