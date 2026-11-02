/**
 * Talks to the Prices Crawler browser extension, which fetches store pages from the
 * user's own browser for catalogs that block the backend. The page and the
 * extension's content script exchange window messages tagged with these sources.
 */

import i18n from 'i18next';

const FROM_PAGE = 'prices-crawler-web-app';
const FROM_EXTENSION = 'prices-crawler-extension';
const DEFAULT_TIMEOUT_MS = 30000;

let nextRequestId = 0;

export const isExtensionInstalled = () =>
  Boolean(document.documentElement.dataset.pricesCrawlerExtension);

export const fetchViaExtension = (url, timeoutMs = DEFAULT_TIMEOUT_MS) =>
  new Promise((resolve, reject) => {
    nextRequestId += 1;
    const id = `${Date.now()}-${nextRequestId}`;

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    };

    const onMessage = (event) => {
      const message = event.data;

      if (event.source !== window || event.origin !== window.location.origin) return;
      if (message?.source !== FROM_EXTENSION || message.type !== 'fetch-result') return;
      if (message.id !== id) return;

      cleanup();

      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve({ ok: message.ok, status: message.status, content: message.content });
      }
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(i18n.t('components.extension.timeout')));
    }, timeoutMs);

    window.addEventListener('message', onMessage);
    window.postMessage({ source: FROM_PAGE, type: 'fetch', id, url }, window.location.origin);
  });
