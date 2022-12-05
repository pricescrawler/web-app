/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@components/Loader';
import PricesChart from '@components/PricesChart';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductDetails`.
 */

function ProductDetails() {
  const { t } = useTranslation();
  const { catalog, locale, reference } = useParams();
  const { isLoadingData, product } = useSelector((state) => state.product);
  const { products } = useSelector((state) => state.products);
  const { productList } = useSelector((state) => state.productList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsActions.getProduct({ catalog, locale, reference }));
  }, [dispatch, locale, catalog, reference]);

  const isProductLoaded = () => !!product.prices;

  /**
   * Get Avarage Price.
   */

  const getAveragePrice = (prices) => {
    let sum = 0;

    // eslint-disable-next-line id-length, no-plusplus
    for (let i = 0; i < prices.length; i++) {
      const price = parseFloat(utils.getFormattedPrice(prices[i]));

      sum += price;
    }

    return (sum / prices.length).toFixed(2);
  };

  /**
   * Render Statistics.
   */

  const renderStatistics = () => {
    if (product.prices) {
      const maxPrice = Math.max(
        ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
      );
      const minPrice = Math.min(
        ...product.prices.map((price) => parseFloat(utils.getFormattedPrice(price)))
      );

      return (
        <p>
          <strong>{t('data.product-titles.price-min')}</strong>
          {minPrice}|<strong>{t('data.product-titles.price-max')}</strong>
          {maxPrice}|<strong>{t('data.product-titles.price-avg')}</strong>
          {getAveragePrice(product.prices)}|<strong>{t('data.product-titles.price-last')}</strong>
          {utils.getLastPrice(product)}
        </p>
      );
    }
  };

  /**
   * Render EanUpc.
   */

  const renderEanUpc = (eanUpc) => {
    if (eanUpc) {
      if (eanUpc.length === 1) {
        return eanUpc[0];
      }

      return eanUpc.map((eanUpc, index) => (
        <span key={index}>
          <br />
          {eanUpc}
        </span>
      ));
    }
  };

  /**
   * Render Price Indicator.
   */

  const renderPriceIndicator = (prices, currentPrice) => {
    const averagePrice = prices.reduce(
      (acc, curr) => acc + (parseFloat(utils.getFormattedPrice(curr)), 0) / prices.length
    );
    const productPrice = parseFloat(utils.convertTextToFloat(currentPrice));

    if (productPrice === averagePrice) {
      return (
        <OverlayTrigger
          overlay={
            <Tooltip id={'tooltip-disabled'}>
              {t('data.product-titles.price-indicator-info')}
            </Tooltip>
          }
        >
          <div>
            <strong>{t('data.product-titles.price-indicator')}:</strong>
            <span className={'badge-orange'}>{productPrice}€</span>
          </div>
        </OverlayTrigger>
      );
    }
    if (productPrice > averagePrice) {
      return (
        <OverlayTrigger
          overlay={
            <Tooltip id={'tooltip-disabled'}>
              {t('data.product-titles.price-indicator-info')}
            </Tooltip>
          }
        >
          <div>
            <strong>{t('data.product-titles.price-indicator')}:</strong>
            <span className={'badge-red'}>{productPrice}€</span>
          </div>
        </OverlayTrigger>
      );
    }

    return (
      <OverlayTrigger
        overlay={
          <Tooltip id={'tooltip-disabled'}>{t('data.product-titles.price-indicator-info')}</Tooltip>
        }
      >
        <div>
          <strong>{t('data.product-titles.price-indicator')}:</strong>
          <span className={'badge-green'}>{productPrice}€</span>
        </div>
      </OverlayTrigger>
    );
  };

  /**
   * Render Product Prices.
   */

  const renderProductPrices = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length > 0) {
      const prod = productFiltered[0];
      // eslint-disable-next-line id-length
      const p = prod.products.filter((prod) => prod.reference === reference);

      if (p.length > 0) {
        const { campaignPrice, pricePerQuantity, regularPrice } = p[0];
        const price = campaignPrice || regularPrice;

        return (
          <>
            {campaignPrice ? (
              <p>
                <strong>{t('data.product-fields.regular-price')}:</strong>
                <s>{regularPrice}</s>
                &nbsp;
                {campaignPrice}
              </p>
            ) : (
              <p>
                <strong>{t('data.product-fields.regular-price')}:</strong>

                {regularPrice}
              </p>
            )}
            <p>
              <strong>{t('data.product-fields.price-per-quantity')}:</strong>

              {pricePerQuantity}
            </p>
            <p>{renderPriceIndicator(product.prices, price)}</p>
          </>
        );
      }
    }
  };

  /**
   * Render Product Data.
   */

  const renderProductData = () => (
    <>
      <div className={'mb-3'}>
        <p>
          <strong>{t('data.product-fields.locale')}:</strong>
          {product.locale}|<strong>{t('data.product-fields.catalog')}:</strong>
          {product.catalog}|<strong>{t('data.product-fields.reference')}:</strong>
          {product.reference}
        </p>
      </div>
      <div className={'mb-3'}>
        <p>
          <strong>{t('data.product-fields.name')}:</strong>

          {product.name ? product.name : '-'}
        </p>
        <p>
          <strong>{t('data.product-fields.brand')}:</strong>

          {product.brand ? product.brand : '-'}
        </p>
        <p>
          <strong>{t('data.product-fields.quantity')}:</strong>

          {product.quantity ? product.quantity : '-'}
        </p>
        <p>
          <strong>{t('data.product-fields.description')}:</strong>

          {product.description ? product.description : '-'}
        </p>
      </div>
      <div className={'mb-3'}>
        <p>
          <strong>EAN/UPC:</strong>

          {product.eanUpc ? renderEanUpc(product.eanUpc) : '-'}
        </p>
      </div>
      <div className={'mb-3'}>{renderProductPrices()}</div>
    </>
  );

  /**
   * Render Table Data.
   */

  const renderTableData = (pricesData) => {
    const prices = Object.assign([], pricesData);

    if (prices) {
      // eslint-disable-next-line id-length
      prices.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB - dateA;
      });

      return prices.map((prod, index) => {
        const { campaignPrice, date, pricePerQuantity, quantity, regularPrice } = prod;
        const dateFormatted = date.split(' ')[0];

        return (
          <tr key={index}>
            <td>{regularPrice}</td>
            <td>{campaignPrice}</td>
            <td>{pricePerQuantity}</td>
            <td>{quantity}</td>
            <td>{dateFormatted}</td>
          </tr>
        );
      });
    }
  };

  /**
   * Render Table.
   */

  const renderTable = () => (
    <div className={'table-overflow'}>
      <table className={'BorderLine'}>
        <thead>
          <tr>
            <th>{t('data.product-fields.regular-price')}</th>
            <th>{t('data.product-fields.campaign-price')}</th>
            <th>{t('data.product-fields.price-per-quantity')}</th>
            <th>{t('data.product-fields.quantity')}</th>
            <th>{t('general.date')}</th>
          </tr>
        </thead>
        <tbody>{renderTableData(product.prices)}</tbody>
      </table>
    </div>
  );

  /**
   * Create Chart Data.
   */

  const createChartData = (prices) => {
    const chartData = [];

    if (prices) {
      prices.forEach((value) => {
        chartData.push({
          date: utils.getFormattedDate(value.date),
          price: utils.getFormattedPrice(value),
          pricePerQuantity: value.pricePerQuantity,
          quantity: value.quantity
        });
      });
    }

    return chartData;
  };

  /**
   * Render Add to List Button.
   */

  const renderAddToListButton = () => {
    const productFiltered = products.filter(
      (cat) => cat.locale === locale && cat.catalog === catalog
    );

    if (productFiltered.length > 0) {
      const prod = productFiltered[0];
      // eslint-disable-next-line id-length
      const p = prod.products.filter((prod) => prod.reference === reference);

      if (p.length > 0) {
        return (
          <Button
            onClick={() => {
              const productData = p[0];
              const prodInfo = productList.find(
                (prod) => prod.key === `${locale}.${catalog}.${productData.reference}`
              );

              if (prodInfo) {
                prodInfo.quantity += 1;
                dispatch(productsActions.addToProductList(prodInfo));
              } else {
                dispatch(
                  productsActions.addToProductList({
                    catalog,
                    historyEnabled: true,
                    key: `${locale}.${catalog}.${productData.reference}`,
                    locale,
                    product: productData,
                    quantity: 1
                  })
                );
              }
            }}
            variant={'secondary'}
          >
            {t('data.product-fields.add-to-list')}
          </Button>
        );
      }
    }
  };

  return (
    <>
      {!isLoadingData && !isProductLoaded() ? (
        <center>
          <h2 style={{ color: 'red' }}>{t('general.no-data')}</h2>
        </center>
      ) : (
        <></>
      )}
      {!isLoadingData && isProductLoaded() ? (
        <Container>
          <Row>
            <center>
              <div className={'h2'}>
                <strong>{t('title.product-details')}</strong>
              </div>
            </center>
          </Row>

          <Row className={'justify-content-md-center'}>
            <Col md={'auto'}>
              <center>
                <img
                  alt={''}
                  className={'product-img'}
                  referrerPolicy={'no-referrer'}
                  src={product.imageUrl}
                />
              </center>
            </Col>
            <Col md={'auto'}>
              <center>{renderProductData()}</center>
            </Col>
          </Row>

          <Row className={'justify-content-md-center'}>
            <center>
              <a
                href={product.productUrl}
                rel={'noopener noreferrer'}
                target={'_blank'}
              >
                <Button variant={'secondary'}>{t('data.product-fields.store-page')}</Button>
              </a>
              &nbsp;
              {renderAddToListButton()}
            </center>
          </Row>
          <br />
          <Row className={'justify-content-md-center'}>
            <Col md={'auto'}>
              <center>
                <div className={'h4'}>
                  <strong>{t('general.price-evolution')}</strong>
                </div>
                {renderStatistics()}
                <PricesChart data={createChartData(product.prices)} />
              </center>
            </Col>
          </Row>
          <br />
          <Row className={'justify-content-md-center'}>
            <Col md={'auto'}>
              <center>
                <div className={'h4'}>
                  <strong>{t('general.prices-history')}</strong>
                </div>
                {renderTable()}
              </center>
            </Col>
          </Row>
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default ProductDetails;
