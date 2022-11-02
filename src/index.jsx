/**
 * Module dependencies.
 */

import './index.scss';
import '@services/i18n';
import React, { Suspense } from 'react';
import App from './App';
import Loader from '@components/Loader';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import store from '@services/store';

const app = createRoot(document.getElementById('app'));

app.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
