import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";

import logo from '../../logo.svg';
import { Badge, Container, Nav, Navbar, NavDropdown, FormCheck } from "react-bootstrap";

const NavigationBar = () => {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { productList } = useSelector(state => state.productList);

    useEffect(() => {
        const json = localStorage.getItem("site-dark-mode");
        const currentMode = JSON.parse(json);
        currentMode ? setIsDarkMode(true) : setIsDarkMode(false);
    }, []);

    useEffect(() => {
        isDarkMode ? document.body.classList.add("dark") : document.body.classList.remove("dark");
        const json = JSON.stringify(isDarkMode);
        localStorage.setItem("site-dark-mode", json);
    }, [isDarkMode]);

    const changeLanguage = (lng) => {
        setLang(lng);
        i18n.changeLanguage(lng);
    };

    const numberOfProducts = () => {
        return productList.reduce((acc, prod) => acc + prod.quantity, 0);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid>
                <Navbar.Brand>
                    {/*<img alt="" src={logo} width="40" height="40" className="d-inline-block" />*/}
                    {t('title.base')}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" />
                    <Nav>
                        <Navbar.Text className="me-3">
                            <Link to="/">{t('menu.home')}</Link>
                        </Navbar.Text>
                        <Navbar.Text className="me-3">
                            <Link to="/product/list">
                                {t('menu.product-list')} &nbsp;
                                <Badge bg="secondary">{numberOfProducts()}</Badge>
                            </Link>
                        </Navbar.Text>
                        <NavDropdown className="me-3" title={t('menu.language')} id="basic-nav-dropdown">
                            <select name="language" id="language" onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
                                <option value="en-GB">🇬🇧 -English</option>
                                <option value="pt-PT">🇵🇹 - Português</option>
                            </select>
                        </NavDropdown>
                        <Navbar.Text className="me-2 text-white">
                            {t('menu.dark-mode')}:
                        </Navbar.Text>
                    </Nav>
                    <FormCheck checked={isDarkMode} type="switch" onChange={() => setIsDarkMode(!isDarkMode)} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;