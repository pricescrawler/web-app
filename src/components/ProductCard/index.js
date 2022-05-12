import "./index.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as productsActions from "../../services/store/products/productsActions";

const ProductCard = ({ locale, catalog, productData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { productList } = useSelector((state) => state.productList);

    const renderText = (value) => {
        return value.length > 35 ? `${value.substring(0, 35)}...` : value;
    };

    const addToList = (e) => {
        e.preventDefault();
        const product = productList.find((prod) => prod.key === locale + catalog + productData.reference);

        if (product) {
            product.quantity = product.quantity + 1;
            dispatch(productsActions.addToProductList(product));
        } else {
            dispatch(productsActions.addToProductList({ key: locale + catalog + productData.reference, locale, catalog, productData, quantity: 1 }));
        }
    }

    return (
        <>
            <div className="product-card mb-2 mt-2 position-relative">
                <center>
                    <img className="product-card-image" src={productData.imageUrl ? productData.imageUrl : "-"} alt="" />
                </center>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.name")}</span>
                    <p className="product-card-text">{renderText(productData.name)}</p>
                </div>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.regular-price")}</span>
                    {productData.campaignPrice ? (<p className="product-card-text"><s>{productData.regularPrice}</s> &nbsp; {productData.campaignPrice}</p>) : (<p className="product-card-text">{productData.regularPrice}</p>)}
                </div>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.price-per-quantity")}</span>
                    <p className="product-card-text">{renderText(productData.pricePerQuantity ? productData.pricePerQuantity : "-")}</p>
                </div>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.quantity")}</span>
                    <p className="product-card-text">{renderText(productData.quantity ? productData.quantity : "-")}</p>
                </div>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.brand")}</span>
                    <p className="product-card-text">{renderText(productData.brand ? productData.brand : "-")}</p>
                </div>
                <div className="product-card-info">
                    <span className="product-card-span">{t("data.product-fields.description")}</span>
                    <p className="product-card-text">{renderText(productData.description ? productData.description : "-")}</p>
                </div>
                <center>
                    <a href={productData.productUrl} target="_blank" rel="noopener noreferrer">
                        <button className="product-card-button">
                            {t("data.product-fields.store-page")}
                        </button>
                    </a>
                    &nbsp;&nbsp;
                    <Link to={`/product/${locale}/${catalog}/${productData.reference}`} target="_self">
                        <button className="product-card-button">
                            {t("data.product-fields.details")}
                        </button>
                    </Link>
                    &nbsp;&nbsp;
                    <button className="product-card-button" onClick={addToList}>
                        {t("data.product-fields.add-to-list")}
                    </button>
                </center>
                {productData.campaignPrice ? (<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"><br /><br />%<br /><br /></span>) : (<></>)}
            </div>
        </>
    );
}

export default ProductCard;