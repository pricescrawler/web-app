import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import "./services/i18n";
import store from './services/store';

import Footer from './components/Footer';
import Loader from './components/Loader';
import NavigationBar from './components/NavigationBar';

import About from './pages/About';
import PrivacyTerms from './pages/PrivacyTerms';
import ProductSearch from './pages/ProductSearch';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <NavigationBar /> <br />
          <Routes>
            <Route path="/" element={<ProductSearch />} />
            <Route path="/product/list" element={<ProductList />} />
            <Route path="/product/:locale/:catalog/:reference" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-terms" element={<PrivacyTerms />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//import reportWebVitals from './reportWebVitals';
//reportWebVitals();
