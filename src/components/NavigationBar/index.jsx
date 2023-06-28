/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  AppBar,
  Badge,
  Box,
  Container,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function NavigationBar({ theme }) {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const { productList } = useSelector((state) => state.productList);
  const numberOfProducts = () => productList.reduce((acc, prod) => acc + prod.quantity, 0);
  const [mobileAppUrl] = useState(import.meta.env.VITE_MOBILE_APP_URL);
  const logo = '/logo.png';

  const { darkMode, setDarkMode } = theme;

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    darkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    localStorage.setItem('site-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position={'static'}
        sx={{ backgroundColor: '#212529' }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: '100%' }}
        >
          <Toolbar
            disableGutters
            sx={{ marginLeft: 'auto' }}
          >
            <img
              alt={''}
              className={'d-inline-block'}
              height={40}
              src={logo}
              width={40}
            />
            <Typography
              component={Link}
              noWrap
              sx={{
                color: 'inherit',
                display: { md: 'flex' },
                fontWeight: 700,
                ml: 1
              }}
              to={'/'}
              variant={'h6'}
            >
              {t('title.base')}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Hidden mdDown>
              <Typography
                component={Link}
                noWrap
                sx={{
                  color: 'inherit',
                  mr: 3
                }}
                to={'/'}
              >
                {t('menu.home')}
              </Typography>
              <Typography
                component={Link}
                sx={{
                  color: 'inherit',
                  mr: 3
                }}
                to={'/product/list'}
              >
                {t('menu.product-list')} &nbsp;&nbsp;
                <Badge
                  badgeContent={numberOfProducts()}
                  color={'error'}
                />
              </Typography>
              {mobileAppUrl && (
                <Typography
                  component={'a'}
                  href={mobileAppUrl}
                  noWrap
                  sx={{
                    color: 'inherit',
                    mr: 1
                  }}
                >
                  {t('menu.mobile-app')}
                </Typography>
              )}
              <Select
                id={'language'}
                onChange={(event) => changeLanguage(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiSelect-icon': {
                    color: 'common.white'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  color: 'common.white'
                }}
                value={i18n.language}
              >
                <MenuItem value={'pt-PT'}>🇵🇹 PT</MenuItem>
                <MenuItem value={'en-GB'}>🇬🇧 EN</MenuItem>
              </Select>

              <IconButton
                color={'inherit'}
                onClick={toggleDarkMode}
                size={'small'}
                sx={{ '&:hover': { backgroundColor: '#000000' }, backgroundColor: '#495057' }}
              >
                {darkMode ? (
                  <Brightness7
                    fontSize={'inherit'}
                    sx={{ color: 'common.white' }}
                  />
                ) : (
                  <Brightness4
                    fontSize={'inherit'}
                    sx={{ color: 'common.white' }}
                  />
                )}
              </IconButton>
            </Hidden>

            <Hidden mdUp>
              <IconButton
                aria-label={'menu'}
                color={'inherit'}
                edge={'end'}
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor={'right'}
        onClose={handleDrawerClose}
        open={drawerOpen}
      >
        <List sx={{ width: 250 }}>
          <ListItem
            button
            component={Link}
            to={'/'}
          >
            <ListItemText primary={t('menu.home')} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={'/product/list'}
          >
            <ListItemText
              primary={t('menu.product-list')}
              secondary={
                <Badge
                  badgeContent={numberOfProducts()}
                  color={'error'}
                />
              }
            />
          </ListItem>
          {mobileAppUrl && (
            <ListItem
              button
              component={'a'}
              href={mobileAppUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              <ListItemText primary={t('menu.mobile-app')} />
            </ListItem>
          )}
          <Divider />
          <ListItem disableGutters>
            <ListItemText primary={t('menu.language')} />
            <Select
              id={'language'}
              onChange={(event) => changeLanguage(event.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiSelect-icon': {
                  color: 'common.white'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                color: 'common.white'
              }}
              value={i18n.language}
            >
              <MenuItem value={'pt-PT'}>🇵🇹 PT</MenuItem>
              <MenuItem value={'en-GB'}>🇬🇧 EN</MenuItem>
            </Select>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={t('menu.dark-mode')} />
            <IconButton
              color={'inherit'}
              onClick={toggleDarkMode}
              size={'small'}
              sx={{ '&:hover': { backgroundColor: '#000000' }, backgroundColor: '#495057' }}
            >
              {darkMode ? (
                <Brightness7
                  fontSize={'inherit'}
                  sx={{ color: 'common.white' }}
                />
              ) : (
                <Brightness4
                  fontSize={'inherit'}
                  sx={{ color: 'common.white' }}
                />
              )}
            </IconButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default NavigationBar;
