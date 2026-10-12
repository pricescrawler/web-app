import { RotateCcw, Search } from 'lucide-react';
import React, { useState } from 'react';

const query = 'extra virgin olive oil 750 ml';

const results = [
  { price: 7.49, store: 'Store A' },
  { price: 6.99, store: 'Store B' },
  { price: 7.29, store: 'Store C' },
  { price: 7.89, store: 'Store D' }
];

const cheapestPrice = Math.min(...results.map(({ price }) => price));
const litres = 0.75;

const formatEuro = (value) => `€${value.toFixed(2)}`;

function SearchDemo() {
  const [run, setRun] = useState(0);

  return (
    <div
      className={'flex flex-col gap-3'}
      key={run}
    >
      <div
        className={
          'flex items-center gap-3 rounded-lg border-2 border-foreground bg-card px-4 py-3 font-mono text-sm'
        }
      >
        <Search size={16} />
        <span className={'truncate'}>{query}</span>
      </div>
      <div className={'flex items-center justify-between text-xs text-muted-foreground font-mono'}>
        <span>4 of 4 catalogs searched</span>
        <button
          aria-label={'Replay demo'}
          className={'flex items-center gap-1 hover:text-foreground cursor-pointer'}
          onClick={() => setRun(run + 1)}
        >
          <RotateCcw size={12} />
          Replay
        </button>
      </div>
      <ul className={'flex flex-col gap-2'}>
        {results.map(({ price, store }, index) => (
          <li
            className={`search-demo-row relative flex items-center justify-between overflow-hidden rounded-lg border px-4 py-3 ${
              price === cheapestPrice ? 'border-foreground bg-card' : 'border-border bg-muted/40'
            }`}
            key={store}
            style={{ '--i': index }}
          >
            <div className={'flex flex-col'}>
              <span className={'text-sm font-semibold'}>{store}</span>
              <span className={'text-xs text-muted-foreground font-mono'}>
                {formatEuro(price / litres)}/L
              </span>
            </div>
            <span className={'font-mono font-semibold tabular-nums'}>{formatEuro(price)}</span>
            {price === cheapestPrice && (
              <span
                className={
                  'search-demo-cheapest absolute right-0 top-0 rounded-bl-md bg-yellow-300 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-black'
                }
              >
                Cheapest
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchDemo;
