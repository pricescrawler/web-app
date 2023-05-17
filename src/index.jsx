/**
 * Module dependencies.
 */

import './style.scss';
import '@services/i18n';
import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import Loader from '@components/Loader';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import store from '@services/store';

const app = createRoot(document.getElementById('app'));

function modifyAnalyticsEvent(event) {
  if (localStorage.getItem('va-disable')) {
    return null;
  }

  const url = new URL(event.url);

  url.searchParams.delete('id');

  if (url.pathname.includes('/product') && !url.pathname.includes('/list')) {
    const lastSlashIndex = url.pathname.lastIndexOf('/');

    url.pathname = url.pathname.slice(0, lastSlashIndex);
  }

  return {
    ...event,
    url: url.toString()
  };
}

app.render(
  <>
    <React.StrictMode>
      <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </Provider>
    </React.StrictMode>
    <Analytics beforeSend={modifyAnalyticsEvent} />
  </>
);
