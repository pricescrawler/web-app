import { rewrite } from '@vercel/functions/middleware';

// Vercel Routing Middleware: proxies the MCP endpoint to the content API, so MCP clients
// (Claude, ChatGPT, Cursor, ...) keep using this site's URL even when the API moves.
// The API address comes from the server-side CONTENT_API_URL environment variable.
export const config = { matcher: '/mcp' };

export default function middleware(request) {
  let api;

  try {
    api = new URL(process.env.CONTENT_API_URL);
  } catch {
    api = null;
  }

  if (!api || !['http:', 'https:'].includes(api.protocol)) {
    return Response.json({ error: 'MCP endpoint is not configured' }, { status: 503 });
  }

  const destination = new URL(api);
  destination.pathname = `${api.pathname.replace(/\/+$/, '')}/mcp`;
  destination.search = new URL(request.url).search;

  return rewrite(destination);
}
