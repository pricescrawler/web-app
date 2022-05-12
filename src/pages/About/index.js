import { useTranslation } from "react-i18next";

const About = () => {
    const { t } = useTranslation();
    const email = "mailto:" + process.env.REACT_APP_EMAIL;

    return (
        <>
            <center>
                <h2>
                    <strong>{t("menu.about")}</strong>
                </h2>
                <br />
                <p>{t("pages.about.text1")}</p>
                <p>{t("pages.about.text2")}</p>
                <p>{t("pages.about.text3")}</p>
                <br />
                <p>
                    <strong>{t("pages.about.contact")}:</strong>&nbsp;
                    <a className="u-email" href={email}>E-mail</a>
                </p>
            </center>
        </>
    );
}

export default About;