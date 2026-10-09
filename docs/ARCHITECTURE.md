# Architecture

React 19 SPA built with Vite. Consumes the content API configured via `VITE_API_URL`.

```
src/
├── App.jsx                     # Routes (react-router-dom)
├── pages/
│   ├── ProductSearch/          # "/" — multi-catalog search
│   ├── ProductDetails/         # "/product/:locale/:catalog/:reference"
│   ├── ProductList/            # "/product/list" — shopping lists
│   ├── Favorites/              # "/favorites"
│   ├── About/                  # "/about"
│   └── PrivacyTerms/           # "/privacy-terms"
├── components/
│   ├── SearchContainer/        # search form + catalog picker
│   ├── ProductCard/            # result card
│   ├── ComparisonBar/ + ComparisonModal/   # side-by-side product comparison
│   ├── Scanner/                # barcode scanning (@zxing/library)
│   ├── PricesChart/            # price history chart (recharts)
│   ├── NavigationBar/ Footer/ Loader/ Maintenance/ ErrorBoundary/
│   └── ui/                     # Radix-based primitives (shadcn-style)
├── services/
│   ├── api/                    # axios instance (VITE_API_URL, VITE_API_TIMEOUT)
│   ├── store/                  # Redux Toolkit
│   │   ├── products/           # actions, reducer, selectors, initial state
│   │   └── favorites/          # favoritesReducer
│   ├── i18n/                   # i18next + browser language detector
│   └── utils/                  # price parsing/format helpers (+ tests)
└── styles/
```

## Content API endpoints consumed

| Call                                                          | Used by                                                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `POST /api/v1/products/search`                                | ProductSearch (query + selected catalogs)                                                                  |
| `GET /api/v1/products/history/{locale}/{catalog}/{reference}` | ProductDetails (product + price history)                                                                   |
| `GET /api/v1/products/history?eanUpc=`                        | ProductDetails — "available in other stores" section (EAN cross-catalog match, up to 3 EANs, deduplicated) |
| `POST /api/v1/products/list/update`                           | ProductList — refresh prices                                                                               |
| `POST /api/v1/products/list/store`                            | ProductList — share list (returns id)                                                                      |
| `GET /api/v1/products/list?id=`                               | ProductList — import shared list                                                                           |

## State

Redux Toolkit with two slices, persisted client-side (no user accounts yet):

- **products** — search results, current product, product lists (multiple named
  lists with active-list selection; see `productsSelectors.selectActiveListItems`).
- **favorites** — favorite products.

## i18n

i18next with `i18next-http-backend`; translations in
`public/locales/{pt-PT,en-GB}/translation.json`. Language auto-detected in the
browser.

## Testing & tooling

- **Vitest** (`npm test`, jsdom) with Testing Library; coverage via
  `npm run test:coverage`.
- ESLint (flat config with `eslint-plugin-react`, `npm run lint:check`) and Prettier
  (`npm run format:check`); husky + lint-staged on commit; commitlint (conventional
  commits, `npm run commit`).
- **PWA** via `vite-plugin-pwa` (service worker generated at build).
- Deploys on Vercel (`vercel.json`); Docker image builds the app and serves `dist/`
  with nginx on port 3000 (`VITE_*` values are build args).

> Package manager: **npm** with the committed `package-lock.json` (CI and Docker use
> `npm ci`). `.npmrc` sets `legacy-peer-deps` because `eslint-plugin-react` 7 still
> declares eslint <= 9 as a peer.
