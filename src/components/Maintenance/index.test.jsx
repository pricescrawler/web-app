/**
 * Module dependencies.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Maintenance from './index';
import React from 'react';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

/**
 * Tests for the `Maintenance` component.
 */

describe('Maintenance', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('hides the countdown when no end date is configured', () => {
    vi.stubEnv('VITE_MAINTENANCE_END_DATE', '');

    const { container } = render(<Maintenance />);

    expect(container).not.toHaveTextContent('NaN');
    expect(screen.queryByText('general.maintenance-countdown.title')).not.toBeInTheDocument();
  });

  it('shows the time left until the end date', () => {
    const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5000).toISOString();
    vi.stubEnv('VITE_MAINTENANCE_END_DATE', inTwoDays);

    render(<Maintenance />);

    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('general.maintenance-countdown.days')).toBeInTheDocument();
  });
});
