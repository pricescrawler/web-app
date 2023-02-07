/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '@components/Loader';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductList.
 */

function ProductList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isLoadingData, productList, productListUpload } = useSelector(
    (state) => state.productList
  );
  const [isListUpdated, setIsListUpdated] = useState(true);

  useEffect(() => {
    if (productList && productList.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      productList.forEach((prod) => {
        const productDate = new Date(prod.product.date);
        const productParseDate = new Date(
          productDate.getFullYear(),
          productDate.getMonth(),
          productDate.getDate()
        );

        return setIsListUpdated(today.getTime() === productParseDate.getTime());
      });
    }
  }, [productList]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.has('id')) {
      const id = queryParams.get('id');

      Swal.fire({
        cancelButtonText: 'No, cancel!',
        confirmButtonText: 'Yes, import it!',
        icon: 'warning',
        showCancelButton: true,
        text: 'Are you sure you want to import this product list?',
        title: `Import product list: ${id}`
      }).then((result) => {
        if (result.value) {
          dispatch(productsActions.retrieveProductList(id));
        }
      });
    }
  }, [dispatch]);

  /**
   *  `removeFromProductList.
   */

  const removeFromProductList = (event, prod) => {
    event.preventDefault();
    prod.quantity -= 1;
    dispatch(productsActions.removeFromProductList(prod));
  };

  /**
   *  `addToProductList.
   */

  const addToProductList = (event, prod) => {
    event.preventDefault();
    prod.quantity += 1;
    dispatch(productsActions.addToProductList(prod));
  };

  /**
   *  `updateList.
   */

  const updateList = (event) => {
    event.preventDefault();
    dispatch(productsActions.getUpdatedProductList(productList));
  };

  const uploadList = (event) => {
    event.preventDefault();
    dispatch(productsActions.saveProductList(productList));
  };

  /**
   *  `renderTotalPrice.
   */

  const renderTotalPrice = () => {
    if (productList) {
      return productList
        .reduce((acc, prod) => acc + utils.getFormattedPrice(prod.product) * prod.quantity, 0)
        .toFixed(2);
    }
  };

  /**
   *  `renderTotalPriceByCatalog.
   */

  const renderTotalPriceByCatalog = () => {
    if (productList) {
      const catalogs = productList.reduce((acc, prod) => {
        if (!acc.includes(prod.catalog)) {
          acc.push(prod.catalog);
        }

        return acc;
      }, []);

      return catalogs.map((catalog) => {
        const totalPrice = productList.reduce((acc, prod) => {
          if (prod.catalog === catalog) {
            return acc + utils.getFormattedPrice(prod.product) * prod.quantity;
          }

          return acc;
        }, 0);

        return `${catalog}: ${totalPrice.toFixed(2)}€; `;
      });
    }
  };

  /**
   *  `renderTableData.
   */

  const renderTableData = () => {
    if (productList) {
      return productList.map((prod, index) => {
        const { catalog, historyEnabled, locale, product, quantity } = prod;
        const { campaignPrice, name, pricePerQuantity, reference, regularPrice } = product;

        return (
          <tr key={index}>
            <td>
              <img
                alt={''}
                className={'product-list-img'}
                referrerPolicy={'no-referrer'}
                src={product.imageUrl}
              />
            </td>

            <td>
              {locale}.{catalog}
            </td>
            <td>{reference}</td>
            <td>{name}</td>
            {campaignPrice ? (
              <td>
                <s>{regularPrice}</s> &nbsp; {campaignPrice}
              </td>
            ) : (
              <td>{regularPrice}</td>
            )}
            <td>{pricePerQuantity}</td>
            <td>{quantity}</td>
            <td>
              {historyEnabled ? (
                <Link
                  target={'_self'}
                  to={`/product/${locale}/${catalog}/${reference}`}
                >
                  <Button variant={'secondary'}>{t('general.go')}</Button>
                </Link>
              ) : (
                <></>
              )}
            </td>

            <td>
              <a
                href={product.productUrl}
                rel={'noopener noreferrer'}
                target={'_blank'}
              >
                <Button variant={'secondary'}>{t('general.go')}</Button>
              </a>
            </td>

            <td>
              <Button
                onClick={(event) => removeFromProductList(event, prod)}
                variant={'secondary'}
              >
                -
              </Button>
              &nbsp;
              <Button
                onClick={(event) => addToProductList(event, prod)}
                variant={'secondary'}
              >
                +
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  /**
   *  `renderTable.
   */

  const renderTable = () => (
    <div className={'product-list-table'}>
      <table>
        <thead>
          <tr>
            <th>{t('data.product-fields.image')}</th>
            <th>{t('data.product-fields.catalog')}</th>
            <th>{t('data.product-fields.reference')}</th>
            <th>{t('data.product-fields.name')}</th>
            <th>{t('data.product-fields.regular-price')}</th>
            <th>{t('data.product-fields.price-per-quantity')}</th>
            <th>{t('data.product-fields.quantity')}</th>
            <th>{t('data.product-fields.history-page')}</th>
            <th>{t('data.product-fields.store-page')}</th>
            <th>{t('data.product-fields.remove-add')}</th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );

  const renderProductListUploadUrl = () => {
    if (productListUpload.data) {
      return `${window.location.origin}/product/list?id=${productListUpload.data.id}`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(renderProductListUploadUrl());
  };

  const renderListUpload = () => (
    <div>
      <input value={renderProductListUploadUrl()} />
      <Button
        onClick={copyToClipboard}
        variant={'secondary'}
      >
        {t('general.copy-to-clipboard')}
      </Button>
      <Button
        onClick={uploadList}
        variant={'secondary'}
      >
        {t('general.list-upload')}
      </Button>
    </div>
  );

  return (
    <center>
      <center>
        <div className={'h2'}>
          <strong>{t('title.products-list')}</strong>
        </div>
      </center>
      <br />
      {!isLoadingData ? (
        <>
          {renderListUpload()}
          {renderTable()}
          <br />
          <div>
            <div className={'h5'}>
              <strong>{t('general.total-price')}:</strong> {renderTotalPrice()}€
            </div>
            <br />
            <div className={'h6'}>
              <strong>{t('general.total-price-by-catalog')}:</strong>
            </div>
            <p>{renderTotalPriceByCatalog()}</p>
          </div>
          <br />
          {!isListUpdated ? (
            <Button
              onClick={updateList}
              variant={'secondary'}
            >
              {t('general.refresh-prices')}
            </Button>
          ) : (
            <> </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </center>
  );
}

/**
 *  Export `ProductList.
 */

export default ProductList;
