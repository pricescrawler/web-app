import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";

const PrivacyTerms = () => {
    const { t } = useTranslation();

    return (
        <>
            <center>
                <h2>
                    <strong>{t("menu.privacy-terms")}</strong>
                </h2>
                <br />
                <p>{t("pages.privacy-terms.text1")}</p>
                <p>{t("pages.privacy-terms.text2")}</p>
                <br /> <br />
                <p>
                    <strong>{t("pages.privacy-terms.delete-local-data-text")}</strong>
                </p>
                <br />
                <Button variant="danger"
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    {t("pages.privacy-terms.delete-local-data-button")}
                </Button>
            </center>
        </>
    );
}

export default PrivacyTerms;