import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './index.jsx';
import React from 'react';

vitest.mock('react-router-dom', () => ({
  Link: vitest.fn().mockImplementation(({ children, to }) => <a href={to}>{children}</a>)
}));

describe('Footer', () => {
  it('renders links', () => {
    render(<Footer />);
    const aboutLink = screen.getByRole('link', { name: 'menu.about' });
    const termsLink = screen.getByRole('link', { name: 'menu.privacy-terms' });

    expect(aboutLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
  });
});
