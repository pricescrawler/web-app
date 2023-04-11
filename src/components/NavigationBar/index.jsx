/**
 * Module dependencies.
 */

import { Badge, Container, FormCheck, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

/**
 * Function `NavigationBar`.
 */

function NavigationBar() {
  const { i18n, t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [lang, setLang] = useState(i18n.language);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { productList } = useSelector((state) => state.productList);

  const numberOfProducts = () => productList.reduce((acc, prod) => acc + prod.quantity, 0);
  const [mobileAppUrl] = useState(import.meta.env.VITE_MOBILE_APP_URL);
  const logo = '/logo.png';

  /**
   * Change Language.
   */

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const json = localStorage.getItem('site-dark-mode');
    const currentMode = JSON.parse(json);

    currentMode ? setIsDarkMode(true) : setIsDarkMode(false);
  }, []);

  useEffect(() => {
    isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    const json = JSON.stringify(isDarkMode);

    localStorage.setItem('site-dark-mode', json);
  }, [isDarkMode]);

  return (
    <Navbar
      bg={'dark'}
      expand={'lg'}
      sticky={'top'}
      variant={'dark'}
    >
      <Container fluid>
        <Navbar.Brand>
          <img
            alt={''}
            className={'d-inline-block'}
            height={'30'}
            src={logo}
            width={'30'}
          />
          &nbsp;
          <Navbar.Text className={'navbar-text'}>
            <Link to={'/'}>{t('title.base')}</Link>
          </Navbar.Text>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={'basic-navbar-nav'} />
        <Navbar.Collapse id={'basic-navbar-nav'}>
          <Nav className={'me-auto'} />
          <Nav>
            <Navbar.Text className={'me-3'}>
              <Link to={'/'}>{t('menu.home')}</Link>
            </Navbar.Text>

            <Navbar.Text className={'me-3'}>
              <Link to={'/product/list'}>
                {t('menu.product-list')} &nbsp;
                <Badge bg={'secondary'}>{numberOfProducts()}</Badge>
              </Link>
            </Navbar.Text>

            {mobileAppUrl ? (
              <>
                <Navbar.Text className={'me-3'}>
                  <a
                    href={mobileAppUrl}
                    rel={'noopener noreferrer'}
                    target={'_blank'}
                  >
                    {t('menu.mobile-app')}
                  </a>
                </Navbar.Text>
              </>
            ) : (
              <> </>
            )}

            <NavDropdown
              className={'me-3'}
              id={'basic-nav-dropdown'}
              title={t('menu.language')}
            >
              <select
                id={'language'}
                name={'language'}
                onChange={(event) => changeLanguage(event.target.value)}
                value={i18n.language}
              >
                <option value={'en-GB'}>🇬🇧 -English</option>
                <option value={'pt-PT'}>🇵🇹 - Português</option>
              </select>
            </NavDropdown>
            <Navbar.Text className={'me-2 text-white'}>{t('menu.dark-mode')}:</Navbar.Text>
          </Nav>

          <FormCheck
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            type={'switch'}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

/**
 * Export `NavigationBar`.
 */

export default NavigationBar;
