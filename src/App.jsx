/**
 * Module dependencies.
 */

import React, { useMemo, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import About from '@pages/About';
import { CssBaseline } from '@mui/material';
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
  const [mode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode
        }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

/**
 * Export `App`.
 */

export default App;
