/**
 * Module dependencies.
 */

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import SearchContainer from './index';
import { barcode } from '@components/Scanner';

vi.mock('@components/Scanner', () => ({ barcode: vi.fn(), stop: vi.fn() }));
vi.mock('@services/api', () => ({ default: { get: vi.fn(() => new Promise(() => {})) } }));
vi.mock('react-redux', () => ({ useDispatch: () => vi.fn() }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

/**
 * Tests for the `SearchContainer` component.
 */

describe('SearchContainer', () => {
  it('starts the barcode scanner on the rendered video element', async () => {
    const { container } = render(<SearchContainer />);
    const scannerButton = [...container.querySelectorAll('button[type="button"]')].at(-1);

    fireEvent.click(scannerButton);

    await vi.waitFor(() => expect(barcode).toHaveBeenCalled());
    expect(barcode.mock.calls[0][0]).toBeInstanceOf(HTMLVideoElement);
  });
});
