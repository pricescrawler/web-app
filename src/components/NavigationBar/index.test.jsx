import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './index.jsx';
import { Provider } from 'react-redux';
import React from 'react';
import configureStore from 'redux-mock-store';
import store from '../../services/store/index.js';

vitest.mock('react-router-dom', () => ({
  BrowserRouter: vitest.fn().mockImplementation(({ children, to }) => <a href={to}>{children}</a>),
  Link: vitest.fn().mockImplementation(({ children, to }) => <a href={to}>{children}</a>)
}));

const mockStore = configureStore([]);

describe('Navbar rendering', () => {
  render(
    <Provider store={store}>
      <NavigationBar />
    </Provider>,
    { wrapper: BrowserRouter }
  );

  it('logo is rendered', () => {
    const logo = screen.getByRole('img', { name: '' });

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('height', '30');
    expect(logo).toHaveAttribute('width', '30');
    expect(logo).toHaveClass('d-inline-block');
  });

  it('home link is rendered', () => {
    const homeLink = screen.getByLabelText('click to return to the homepage');

    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('product list is rendered', () => {
    const productListLink = screen.getByRole('link', { name: 'menu.product-list' });

    expect(productListLink).toBeInTheDocument();
    expect(productListLink).toHaveAttribute('href', '/product/list');
  });

  it('renders the mobile app link', () => {
    const mobileAppLink = screen.getByRole('link', { name: 'Mobile App' });

    expect(mobileAppLink).toBeInTheDocument();
    expect(mobileAppLink).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=io.github.pricescrawler.mobile'
    );
  });

  it('calculates the total number of products', () => {
    const productList = [
      { id: 1, quantity: 3 },
      { id: 2, quantity: 2 },
      { id: 3, quantity: 4 }
    ];

    const store = mockStore({ productList });

    const { container } = render(
      <Provider store={store}>
        <NavigationBar />
      </Provider>,
      { initialState: { productList } }
    );

    const badgeElement = container.getElementsByClassName('badge')[0];
    const actualText = badgeElement.textContent;
    const expectedText = '9';

    expect(actualText.trim()).toBe(expectedText);
  });
});
