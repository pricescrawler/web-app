/**
 * Module dependencies.
 */

import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from '@pages/About';
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
    const json = localStorage.getItem('site-dark-mode');
    const savedDarkMode = JSON.parse(json);

    return savedDarkMode ?? false;
  });

  return (
    <Router>
      <NavigationBar theme={{ darkMode, setDarkMode }} />
      <div className={'pt-14'}>
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
            element={<About />}
            path={'/about'}
          />
          <Route
            element={<PrivacyTerms />}
            path={'/privacy-terms'}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

/**
 * Export `App`.
 */

export default App;
