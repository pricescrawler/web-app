import "./index.css";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <>
            <br /> <br />
            <center>
                <div className="nav-footer">
                    <Link className="nav-footer-link me-3" to="/about">{t('menu.about')}</Link>
                    <Link className="nav-footer-link" to="/privacy-terms">{t('menu.privacy-terms')}</Link>
                </div>
            </center>
        </>
    );
};

export default Footer;