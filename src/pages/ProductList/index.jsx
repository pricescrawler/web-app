/**
 * Module dependencies.
 */

import './index.scss';
import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import { Add, Launch, Remove } from '@mui/icons-material';
import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Form, InputGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '@components/Loader';
import { QRCode } from 'antd';
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
  const [showFormControl, setShowFormControl] = useState(false);
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);

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
        cancelButtonColor: '#6c757d',
        cancelButtonText: t('general.no'),
        confirmButtonColor: '#6c757d',
        confirmButtonText: t('general.yes'),
        icon: 'warning',
        showCancelButton: true,
        text: t('general.product-list-replace'),
        title: `${id}`
      }).then((result) => {
        if (result.value) {
          dispatch(productsActions.retrieveProductList(id));
        }
      });
    }
  }, [dispatch, t]);

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

  /**
   *  `uploadList.
   */

  const uploadList = (event) => {
    event.preventDefault();
    dispatch(productsActions.saveProductList(productList));
    setShowFormControl(!showFormControl);
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
   *  `renderTable.
   */

  const renderTable = () => {
    if (productList) {
      return (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 1200, overflowX: 'scroll' }}
        >
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.image')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.catalog')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.reference')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.name')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.regular-price')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.price-per-quantity')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.quantity')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.history-page')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.store-page')}
                </TableCell>
                <TableCell
                  align={'center'}
                  style={{ color: 'white' }}
                >
                  {t('data.product-fields.remove-add')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((prod, index) => {
                const { catalog, historyEnabled, locale, product, quantity } = prod;
                const { campaignPrice, name, pricePerQuantity, reference, regularPrice } = product;

                return (
                  <TableRow key={index}>
                    <TableCell align={'center'}>
                      <img
                        alt={''}
                        className={'product-list-img'}
                        referrerPolicy={'no-referrer'}
                        src={product.imageUrl}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      {locale}.{catalog}
                    </TableCell>
                    <TableCell align={'center'}>{reference}</TableCell>
                    <TableCell align={'center'}>{name}</TableCell>
                    <TableCell align={'center'}>
                      {campaignPrice ? (
                        <div>
                          <s>{regularPrice}</s> &nbsp; {campaignPrice}
                        </div>
                      ) : (
                        regularPrice
                      )}
                    </TableCell>
                    <TableCell align={'center'}>{pricePerQuantity}</TableCell>
                    <TableCell align={'center'}>{quantity}</TableCell>
                    <TableCell align={'center'}>
                      {historyEnabled ? (
                        <Link
                          target={'_self'}
                          to={`/product/${locale}/${catalog}/${reference}`}
                        >
                          <IconButton
                            size={'small'}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#000000'
                              },
                              backgroundColor: '#495057'
                            }}
                            variant={'contained'}
                          >
                            <Launch
                              fontSize={'inherit'}
                              style={{ color: 'white' }}
                            />
                          </IconButton>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </TableCell>
                    <TableCell align={'center'}>
                      <a
                        href={product.productUrl}
                        rel={'noopener noreferrer'}
                        target={'_blank'}
                      >
                        <IconButton
                          size={'small'}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#000000'
                            },
                            backgroundColor: '#495057'
                          }}
                          variant={'contained'}
                        >
                          <Launch
                            fontSize={'inherit'}
                            style={{ color: 'white' }}
                          />
                        </IconButton>
                      </a>
                    </TableCell>
                    <TableCell align={'center'}>
                      <Stack
                        alignItems={'center'}
                        direction={'row'}
                        justifyContent={'center'}
                        spacing={1}
                      >
                        <IconButton
                          onClick={(event) => removeFromProductList(event, prod)}
                          size={'small'}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#000000'
                            },
                            backgroundColor: '#495057'
                          }}
                          variant={'contained'}
                        >
                          <Remove
                            fontSize={'inherit'}
                            style={{ color: 'white' }}
                          />
                        </IconButton>
                        <IconButton
                          onClick={(event) => addToProductList(event, prod)}
                          size={'small'}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#000000'
                            },
                            backgroundColor: '#495057'
                          }}
                          variant={'contained'}
                        >
                          <Add
                            fontSize={'inherit'}
                            style={{ color: 'white' }}
                          />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  const renderProductListUploadUrl = () => {
    if (productListUpload.data) {
      return `${window.location.origin}/product/list?id=${productListUpload.data.id}`;
    }
  };

  const renderProductListExpirationDate = () => {
    if (productListUpload.data) {
      return productListUpload.data.expirationDate;
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(renderProductListUploadUrl());
  };

  const renderListUpload = () => (
    <>
      <Button
        onClick={uploadList}
        size={'small'}
        sx={{
          '&:hover': {
            backgroundColor: '#000000'
          },
          backgroundColor: '#495057'
        }}
        variant={'contained'}
      >
        {t('general.list-upload')}
      </Button>
      {showFormControl && (
        <>
          <InputGroup>
            <Form.Control
              placeholder={'Link'}
              value={renderProductListUploadUrl()}
            />
            <Button
              onClick={copyToClipboard}
              size={'small'}
              sx={{
                '&:hover': {
                  backgroundColor: '#000000'
                },
                backgroundColor: '#495057'
              }}
              variant={'contained'}
            >
              {t('general.copy-to-clipboard')}
            </Button>
          </InputGroup>

          <center>
            <QRCode
              errorLevel={'H'}
              icon={'/logo.png'}
              value={renderProductListUploadUrl()}
            />
          </center>

          <Form.Text muted>
            <p>{t('general.expiration-text-1')}</p>
            <p>
              {t('general.expiration-text-2')} {renderProductListExpirationDate()}
            </p>
          </Form.Text>
        </>
      )}
    </>
  );

  return (
    <center>
      <div className={'h2'}>
        <strong>{t('title.products-list')}</strong>
      </div>
      <br />
      {!isLoadingData ? (
        <>
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
          <center>
            <div className={'product-list-upload d-grid gap-2'}>
              {isMaintenanceMode === 'true' ? (
                <></>
              ) : (
                <>
                  {!isListUpdated ? (
                    <>
                      <Button
                        onClick={updateList}
                        variant={'secondary'}
                      >
                        {t('general.refresh-prices')}
                      </Button>
                    </>
                  ) : (
                    <> </>
                  )}
                  {renderListUpload()}
                </>
              )}
            </div>
          </center>
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
