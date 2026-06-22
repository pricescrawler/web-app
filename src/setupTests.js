/**
 * Module dependencies.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Cleanup the DOM and local storage after each test.
 */

afterEach(() => {
  cleanup();
  localStorage.clear();
});
