import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchViaExtension, isExtensionInstalled } from '.';

vi.mock('i18next', () => ({ default: { t: (key) => key } }));

// Stands in for the extension's content script: answers each page request.
const installFakeExtension = (answer) => {
  document.documentElement.dataset.pricesCrawlerExtension = '0.1.0';

  const listener = (event) => {
    const message = event.data;
    if (message?.source !== 'prices-crawler-web-app' || message.type !== 'fetch') return;

    // jsdom's postMessage leaves `source` and `origin` empty, so dispatch the event a
    // real browser would deliver.
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          source: 'prices-crawler-extension',
          type: 'fetch-result',
          id: message.id,
          ...answer(message)
        },
        origin: window.location.origin,
        source: window
      })
    );
  };

  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
};

describe('browser extension bridge', () => {
  let uninstall = () => {};

  afterEach(() => {
    uninstall();
    delete document.documentElement.dataset.pricesCrawlerExtension;
  });

  it('detects whether the extension is installed', () => {
    expect(isExtensionInstalled()).toBe(false);

    uninstall = installFakeExtension(() => ({}));

    expect(isExtensionInstalled()).toBe(true);
  });

  it('resolves with the page the extension fetched', async () => {
    uninstall = installFakeExtension((message) => ({
      ok: true,
      status: 200,
      content: `<html>${message.url}</html>`
    }));

    await expect(fetchViaExtension('https://www.intermarche.pt/search/queijo')).resolves.toEqual({
      ok: true,
      status: 200,
      content: '<html>https://www.intermarche.pt/search/queijo</html>'
    });
  });

  it('rejects with the error the extension reported', async () => {
    uninstall = installFakeExtension(() => ({ error: 'Store not supported by the extension' }));

    await expect(fetchViaExtension('https://example.com/')).rejects.toThrow(
      'Store not supported by the extension'
    );
  });

  it('ignores answers to other requests', async () => {
    uninstall = installFakeExtension((message) => ({ id: `${message.id}-other`, ok: true }));

    await expect(fetchViaExtension('https://www.intermarche.pt/', 50)).rejects.toThrow(
      'components.extension.timeout'
    );
  });

  it('times out when nothing answers', async () => {
    await expect(fetchViaExtension('https://www.intermarche.pt/', 50)).rejects.toThrow(
      'components.extension.timeout'
    );
  });
});
