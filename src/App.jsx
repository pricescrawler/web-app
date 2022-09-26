/**
 * Module dependencies.
 */

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from '@pages/About';
import Footer from '@components/Footer';
import NavigationBar from '@components/NavigationBar';
import PrivacyTerms from '@pages/PrivacyTerms';
import ProductDetails from '@pages/ProductDetails';
import ProductList from '@pages/ProductList';
import ProductSearch from '@pages/ProductSearch';
import React from 'react';

/**
 * `App`.
 */

function App() {
  return (
    <Router>
      <NavigationBar />

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

      <Footer />
    </Router>
  );
}

/**
 * Export `App`.
 */

export default App;
