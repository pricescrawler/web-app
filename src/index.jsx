/**
 * Module dependencies.
 */

import './index.scss';
import '@services/i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense } from 'react';
import About from '@pages/About';
import Footer from '@components/Footer';
import Loader from '@components/Loader';
import NavigationBar from '@components/NavigationBar';
import PrivacyTerms from '@pages/PrivacyTerms';
import ProductDetails from '@pages/ProductDetails';
import ProductList from '@pages/ProductList';
import ProductSearch from '@pages/ProductSearch';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from '@services/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
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
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);
