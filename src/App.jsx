/**
 * Module dependencies.
 */

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from '@pages/About';
import { CssBaseline } from '@mui/material';
import Footer from '@components/Footer';
import NavigationBar from '@components/NavigationBar';
import PrivacyTerms from '@pages/PrivacyTerms';
import ProductDetails from '@pages/ProductDetails';
import ProductList from '@pages/ProductList';
import ProductSearch from '@pages/ProductSearch';

/**
 * `Theme
 */

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#343a40'
    },
    secondary: {
      main: '#343a40'
    }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#fff'
    }
  }
});

/**
 * `App`.
 */

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <NavigationBar theme={{ darkMode, setDarkMode }} />
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
    </MuiThemeProvider>
  );
}

/**
 * Export `App`.
 */

export default App;
