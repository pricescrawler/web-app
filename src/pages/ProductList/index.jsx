/**
 * Module dependencies.
 */

import * as productsActions from '@services/store/products/productsActions';
import * as utils from '@services/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ClipboardCopy,
  Download,
  ExternalLink,
  History,
  Minus,
  Plus,
  RefreshCw,
  Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '@components/Loader';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

/**
 * Function `ProductList`.
 */

function ProductList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoadingData = useSelector((state) => state.isLoadingData);
  const productList = useSelector((state) => state.productList);
  const productListUpload = useSelector((state) => state.productListUpload);
  const [isListUpdated, setIsListUpdated] = useState(true);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [showReorderControl, setShowReorderControl] = useState(false);
  const [isMaintenanceMode] = useState(import.meta.env.VITE_MAINTENANCE_MODE);
  const [pendingListId, setPendingListId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (productList?.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isAnyOutdated = productList.some((prod) => {
        const d = new Date(prod.product.date);

        return new Date(d.getFullYear(), d.getMonth(), d.getDate()) < today;
      });

      setIsListUpdated(!isAnyOutdated);
    }
  }, [productList]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.has('id')) {
      setPendingListId(queryParams.get('id'));
      setConfirmOpen(true);
    }
  }, []);

  const handleConfirmReplace = () => {
    if (pendingListId) dispatch(productsActions.retrieveProductList(pendingListId));
    setConfirmOpen(false);
  };

  const removeFromProductList = (event, prod) => {
    event.preventDefault();
    dispatch(productsActions.removeFromProductList({ ...prod, quantity: prod.quantity - 1 }));
  };

  const addToProductList = (event, prod) => {
    event.preventDefault();
    dispatch(productsActions.addToProductList({ ...prod, quantity: prod.quantity + 1 }));
  };

  const updateList = (event) => {
    event.preventDefault();
    dispatch(productsActions.getUpdatedProductList(productList));
  };

  const uploadList = (event) => {
    event.preventDefault();
    dispatch(productsActions.saveProductList(productList));
    setShowSharePanel(true);
  };

  const moveItemUp = (index) => {
    if (index > 0) {
      const list = [...productList];

      [list[index - 1], list[index]] = [list[index], list[index - 1]];
      dispatch(productsActions.updateProductList(list));
    }
  };

  const moveItemDown = (index) => {
    if (index < productList.length - 1) {
      const list = [...productList];

      [list[index], list[index + 1]] = [list[index + 1], list[index]];
      dispatch(productsActions.updateProductList(list));
    }
  };

  const renderTotalPrice = () =>
    productList
      ?.reduce((acc, prod) => acc + utils.getFormattedPrice(prod.product) * prod.quantity, 0)
      .toFixed(2) ?? '0.00';

  const renderTotalPriceByCatalog = () => {
    if (!productList) return [];
    const catalogMap = {};

    productList.forEach((prod) => {
      if (!catalogMap[prod.catalog]) catalogMap[prod.catalog] = 0;
      catalogMap[prod.catalog] += utils.getFormattedPrice(prod.product) * prod.quantity;
    });

    return Object.entries(catalogMap).map(([cat, total]) => ({
      catalog: cat,
      total: total.toFixed(2)
    }));
  };

  const exportToPDF = () => {
    if (!productList?.length) return;

    const title = t('title.products-list');
    const totalPrice = renderTotalPrice();
    const catalogTotals = renderTotalPriceByCatalog();

    const rows = productList
      .map(({ catalog, locale, product, quantity }) => {
        const price = product.campaignPrice ?? product.regularPrice ?? '';
        const lineTotal = (parseFloat(utils.getFormattedPrice(product)) * quantity).toFixed(2);

        return `
          <tr>
            <td>${locale}.${catalog}</td>
            <td>${product.name ?? ''}</td>
            <td style="text-align:center">${price}</td>
            <td style="text-align:center">${quantity}</td>
            <td style="text-align:right;font-weight:600">${lineTotal}€</td>
          </tr>`;
      })
      .join('');

    const catalogTotalRows = catalogTotals
      .map(
        ({ catalog, total }) =>
          `<tr><td colspan="4" style="text-align:right;color:#666">${catalog}</td><td style="text-align:right;font-weight:600">${total}€</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; font-size: 12px; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f4f4f4; text-align: left; padding: 6px 8px; border-bottom: 2px solid #ddd; font-size: 11px; }
    td { padding: 5px 8px; border-bottom: 1px solid #eee; }
    .total-row td { border-top: 2px solid #ddd; font-size: 13px; font-weight: 700; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        <th>${t('data.product-fields.catalog')}</th>
        <th>${t('data.product-fields.name')}</th>
        <th style="text-align:center">${t('data.product-fields.regular-price')}</th>
        <th style="text-align:center">${t('data.product-fields.quantity')}</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      ${catalogTotalRows}
      <tr class="total-row">
        <td colspan="4" style="text-align:right">${t('general.total-price')}</td>
        <td style="text-align:right">${totalPrice}€</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  const exportToXLSX = () => {
    if (!productList) return;
    const headers = [
      t('data.product-fields.catalog'),
      t('data.product-fields.reference'),
      t('data.product-fields.name'),
      t('data.product-fields.regular-price'),
      t('data.product-fields.price-per-quantity'),
      t('data.product-fields.quantity'),
      'URL'
    ];
    const dataRows = productList.map(({ catalog, locale, product, quantity }) => [
      `${locale}.${catalog}`,
      product.reference ?? '',
      product.name ?? '',
      product.campaignPrice ?? product.regularPrice ?? '',
      product.pricePerQuantity ?? '',
      quantity ?? '',
      product.productUrl ?? ''
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lista');
    const ts = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
    XLSX.writeFile(wb, `${t('pages.product-list.csv.prefix')}${ts}.xlsx`);
  };

  const copyListAsText = () => {
    if (!productList) return;
    const catalogMap = {};

    productList.forEach((prod) => {
      const key = `${prod.locale}.${prod.catalog}`;
      if (!catalogMap[key]) catalogMap[key] = [];
      catalogMap[key].push(prod);
    });

    const lines = [t('pages.product-list.copy.header'), ''];

    Object.entries(catalogMap).forEach(([catalogKey, items]) => {
      lines.push(`*${catalogKey}*`);
      let catalogTotal = 0;
      items.forEach((item) => {
        const price = parseFloat(utils.getFormattedPrice(item.product));
        const lineTotal = (price * item.quantity).toFixed(2);
        catalogTotal += parseFloat(lineTotal);
        lines.push(`• ${item.product.name} x${item.quantity} — ${lineTotal}€`);
      });
      lines.push(`_${t('pages.product-list.copy.catalog-total')}: ${catalogTotal.toFixed(2)}€_`);
      lines.push('');
    });

    const grandTotal = productList
      .reduce((acc, prod) => acc + utils.getFormattedPrice(prod.product) * prod.quantity, 0)
      .toFixed(2);
    lines.push(`*${t('pages.product-list.copy.grand-total')}: ${grandTotal}€*`);

    navigator.clipboard.writeText(lines.join('\n'));
  };

  const shareUrl = productListUpload.data
    ? `${window.location.origin}/product/list?id=${productListUpload.data.id}`
    : '';

  const iconBtn = (onClick, icon, disabled = false) => (
    <button
      className={
        'w-7 h-7 inline-flex items-center justify-center rounded bg-muted hover:bg-accent transition-colors disabled:opacity-40'
      }
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );

  return (
    <div className={'max-w-7xl mx-auto px-4 py-8'}>
      <h2 className={'text-2xl font-bold tracking-tight mb-6 text-center'}>
        {t('title.products-list')}
      </h2>

      {isLoadingData ? (
        <Loader />
      ) : (
        <div className={'flex flex-col gap-6'}>
          {/* Toolbar */}
          <div className={'flex items-center justify-end gap-2'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={'sm'}
                  variant={'outline'}
                >
                  {t('pages.product-list.options.tooltip')}
                  <ChevronDown
                    className={'ml-1.5'}
                    size={14}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={'end'}>
                <DropdownMenuItem onClick={() => setShowReorderControl(!showReorderControl)}>
                  <ArrowUp
                    className={'mr-2'}
                    size={14}
                  />
                  {t('pages.product-list.options.redorder')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyListAsText}>
                  <ClipboardCopy
                    className={'mr-2'}
                    size={14}
                  />
                  {t('pages.product-list.options.copy-whatsapp')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToXLSX}>
                  <Download
                    className={'mr-2'}
                    size={14}
                  />
                  {t('pages.product-list.options.export-xlsx')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>
                  <Download
                    className={'mr-2'}
                    size={14}
                  />
                  {t('pages.product-list.options.export-pdf')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          {productList?.length > 0 ? (
            <Card>
              <CardContent className={'p-0'}>
                <div className={'overflow-x-auto'}>
                  <Table style={{ minWidth: '550px' }}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={'text-center w-[50px] sm:w-[70px]'}>
                          {t('data.product-fields.image')}
                        </TableHead>
                        <TableHead className={'hidden md:table-cell'}>
                          {t('data.product-fields.catalog')}
                        </TableHead>
                        <TableHead>{t('data.product-fields.name')}</TableHead>
                        <TableHead className={'text-center'}>
                          {t('data.product-fields.regular-price')}
                        </TableHead>
                        <TableHead className={'text-center hidden lg:table-cell'}>
                          {t('data.product-fields.price-per-quantity')}
                        </TableHead>
                        <TableHead className={'text-center w-[60px] sm:w-[80px]'}>
                          {t('data.product-fields.quantity')}
                        </TableHead>
                        <TableHead className={'text-center w-[80px] sm:w-[100px]'}>
                          {t('data.product-fields.remove-add')}
                        </TableHead>
                        <TableHead className={'text-center w-[60px] sm:w-[80px]'}>Links</TableHead>
                        {showReorderControl && (
                          <TableHead className={'text-center w-[80px]'}>
                            {t('data.product-fields.move')}
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productList.map((prod, index) => {
                        const { catalog, historyEnabled, locale, product, quantity } = prod;
                        const { campaignPrice, name, pricePerQuantity, reference, regularPrice } =
                          product;

                        return (
                          <TableRow key={index}>
                            <TableCell className={'text-center'}>
                              <img
                                alt={name}
                                className={'h-8 w-8 sm:h-10 sm:w-10 object-contain mx-auto'}
                                referrerPolicy={'no-referrer'}
                                src={product.imageUrl}
                              />
                            </TableCell>
                            <TableCell
                              className={
                                'hidden md:table-cell text-xs text-muted-foreground font-mono'
                              }
                            >
                              {locale}.{catalog}
                            </TableCell>
                            <TableCell
                              className={
                                'font-medium text-xs sm:text-sm max-w-[120px] sm:max-w-[200px] truncate'
                              }
                            >
                              {name}
                            </TableCell>
                            <TableCell className={'text-center'}>
                              {campaignPrice ? (
                                <div className={'flex flex-col items-center'}>
                                  <span
                                    className={
                                      'font-bold text-green-600 dark:text-green-400 text-sm'
                                    }
                                  >
                                    {campaignPrice}
                                  </span>
                                  <span className={'text-xs text-muted-foreground line-through'}>
                                    {regularPrice}
                                  </span>
                                </div>
                              ) : (
                                <span className={'font-semibold text-sm'}>{regularPrice}</span>
                              )}
                            </TableCell>
                            <TableCell
                              className={
                                'text-center text-xs text-muted-foreground hidden lg:table-cell'
                              }
                            >
                              {pricePerQuantity}
                            </TableCell>
                            <TableCell className={'text-center font-semibold'}>
                              {quantity}
                            </TableCell>
                            <TableCell>
                              <div className={'flex items-center justify-center gap-1'}>
                                {iconBtn(
                                  (e) => removeFromProductList(e, prod),
                                  <Minus size={12} />
                                )}
                                {iconBtn((e) => addToProductList(e, prod), <Plus size={12} />)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={'flex items-center justify-center gap-1'}>
                                {historyEnabled && (
                                  <Link to={`/product/${locale}/${catalog}/${reference}`}>
                                    {iconBtn(null, <History size={12} />)}
                                  </Link>
                                )}
                                <a
                                  href={product.productUrl}
                                  rel={'noopener noreferrer'}
                                  target={'_blank'}
                                >
                                  {iconBtn(null, <ExternalLink size={12} />)}
                                </a>
                              </div>
                            </TableCell>
                            {showReorderControl && (
                              <TableCell>
                                <div className={'flex items-center justify-center gap-1'}>
                                  {iconBtn(
                                    () => moveItemUp(index),
                                    <ArrowUp size={12} />,
                                    index === 0
                                  )}
                                  {iconBtn(
                                    () => moveItemDown(index),
                                    <ArrowDown size={12} />,
                                    index === productList.length - 1
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={'text-center py-16 text-muted-foreground'}>
              <p className={'text-lg font-medium mb-1'}>{t('title.products-list')}</p>
              <p className={'text-sm'}>Adiciona produtos através da pesquisa.</p>
            </div>
          )}

          {/* Totals + actions */}
          {productList?.length > 0 && (
            <div
              className={'flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between'}
            >
              {/* Totals */}
              <Card className={'w-full sm:w-auto min-w-[220px]'}>
                <CardHeader className={'pb-2 pt-4 px-4'}>
                  <CardTitle className={'text-sm font-semibold'}>
                    {t('general.total-price')}
                  </CardTitle>
                </CardHeader>
                <CardContent className={'px-4 pb-4'}>
                  <p className={'text-2xl font-bold mb-2'}>{renderTotalPrice()}€</p>
                  <Separator className={'mb-2'} />
                  <div className={'flex flex-col gap-1'}>
                    {renderTotalPriceByCatalog().map(({ catalog, total }) => (
                      <div
                        className={'flex justify-between text-xs text-muted-foreground'}
                        key={catalog}
                      >
                        <span className={'font-mono'}>{catalog}</span>
                        <span className={'font-semibold text-foreground'}>{total}€</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {isMaintenanceMode !== 'true' && (
                <div className={'flex flex-col gap-2'}>
                  {!isListUpdated && (
                    <Button
                      onClick={updateList}
                      variant={'outline'}
                    >
                      <RefreshCw
                        className={'mr-2'}
                        size={14}
                      />
                      {t('general.refresh-prices')}
                    </Button>
                  )}
                  <Button onClick={uploadList}>
                    <Upload
                      className={'mr-2'}
                      size={14}
                    />
                    {t('general.list-upload')}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Share panel */}
          {showSharePanel && shareUrl && (
            <Card className={'border-dashed'}>
              <CardContent className={'p-5 flex flex-col items-center gap-4'}>
                <div className={'flex gap-2 w-full max-w-md'}>
                  <Input
                    className={'font-mono text-xs'}
                    readOnly
                    value={shareUrl}
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    size={'icon'}
                    variant={'outline'}
                  >
                    <ClipboardCopy size={16} />
                  </Button>
                </div>
                <QRCodeSVG
                  imageSettings={{ excavate: true, height: 24, src: '/logo.png', width: 24 }}
                  level={'H'}
                  size={160}
                  value={shareUrl}
                />
                {productListUpload.data?.expirationDate && (
                  <p className={'text-xs text-muted-foreground text-center'}>
                    {t('general.expiration-text-2')} {productListUpload.data.expirationDate}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <AlertDialog
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingListId}</AlertDialogTitle>
            <AlertDialogDescription>{t('general.product-list-replace')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('general.no')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>{t('general.yes')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProductList;
