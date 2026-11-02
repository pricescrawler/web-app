import { afterEach, describe, expect, it, vi } from 'vitest';
import middleware, { config } from './middleware';

const request = (path = '/mcp') =>
  new Request(`https://prices-crawler.vercel.app${path}`, { method: 'POST' });

describe('MCP proxy middleware', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('only runs on the MCP endpoint', () => {
    expect(config.matcher).toBe('/mcp');
  });

  it('rewrites to the content API MCP endpoint', () => {
    vi.stubEnv('CONTENT_API_URL', 'https://content-api.example.com');

    const response = middleware(request());

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://content-api.example.com/mcp'
    );
  });

  it('keeps a base path and drops a trailing slash', () => {
    vi.stubEnv('CONTENT_API_URL', 'https://example.com/api/');

    const response = middleware(request());

    expect(response.headers.get('x-middleware-rewrite')).toBe('https://example.com/api/mcp');
  });

  it('forwards the query string', () => {
    vi.stubEnv('CONTENT_API_URL', 'https://content-api.example.com');

    const response = middleware(request('/mcp?debug=1'));

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://content-api.example.com/mcp?debug=1'
    );
  });

  it.each([undefined, '', 'not a url', 'ftp://example.com'])(
    'answers 503 when CONTENT_API_URL is %j',
    async (value) => {
      vi.stubEnv('CONTENT_API_URL', value);

      const response = middleware(request());

      expect(response.status).toBe(503);
      expect(response.headers.get('x-middleware-rewrite')).toBeNull();
      expect(await response.json()).toEqual({ error: 'MCP endpoint is not configured' });
    }
  );
});
