/**
 * Module dependencies.
 */

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-GB',
    interpolation: {
      escapeValue: false
    },
    whitelist: ['en-GB', 'pt-PT']
  });

/**
 * Export `i18n`.
 */

export default i18n;
