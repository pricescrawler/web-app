/**
 * Module dependencies.
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loader from './index';
import React from 'react';

/**
 * Tests for the `Loader` component.
 */

describe('Loader', () => {
  it('renders the loader element', () => {
    const { container } = render(<Loader />);

    expect(container.querySelector('.loader')).toBeInTheDocument();
  });
});
