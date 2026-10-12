import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';
import SearchDemo from './SearchDemo';

describe('SearchDemo', () => {
  it('labels only the cheapest store', () => {
    render(<SearchDemo />);

    const cheapestRow = screen.getByText('Cheapest').closest('li');

    expect(screen.getAllByText('Cheapest')).toHaveLength(1);
    expect(within(cheapestRow).getByText('Store B')).toBeInTheDocument();
  });
});
