/**
 * Module dependencies.
 */

import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from '@pages/About';
import ErrorBoundary from '@components/ErrorBoundary';
import Favorites from '@pages/Favorites';
import Footer from '@components/Footer';
import NavigationBar from '@components/NavigationBar';
import PrivacyTerms from '@pages/PrivacyTerms';
import ProductDetails from '@pages/ProductDetails';
import ProductList from '@pages/ProductList';
import ProductSearch from '@pages/ProductSearch';

/**
 * `App`.
 */

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const json = localStorage.getItem('site-dark-mode');

      return JSON.parse(json) ?? false;
    } catch {
      return false;
    }
  });

  return (
    <Router>
      <NavigationBar theme={{ darkMode, setDarkMode }} />
      <div className={'pt-14'}>
        <ErrorBoundary>
          <Routes>
            <Route
              element={<ProductSearch />}
              path={'/'}
            />
            <Route
              element={<ProductList />}
              path={'/product/list'}
            />
            <Route
              element={<ProductDetails />}
              path={'/product/:locale/:catalog/:reference'}
            />
            <Route
              element={<Favorites />}
              path={'/favorites'}
            />
            <Route
              element={<About />}
              path={'/about'}
            />
            <Route
              element={<PrivacyTerms />}
              path={'/privacy-terms'}
            />
          </Routes>
        </ErrorBoundary>
      </div>
      <Footer />
    </Router>
  );
}

/**
 * Export `App`.
 */

export default App;
