import { beforeAll, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React from 'react';
import ProductImage from './index';
import en from '../../../public/locales/en-GB/translation.json';
import pt from '../../../public/locales/pt-PT/translation.json';

const i18n = createInstance();
const zumubPhoto =
  'https://www.zumub.com/images/new_normal/zumub_creatine_creapure_500g_unflavoured_front_NEW_NORM.jpg';

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en-GB',
    resources: { 'en-GB': { translation: en }, 'pt-PT': { translation: pt } }
  });
});

const photo = (src, props = {}) => (
  <I18nextProvider i18n={i18n}>
    <ProductImage
      alt={'Creatina 500g'}
      src={src}
      {...props}
    />
  </I18nextProvider>
);

describe('ProductImage', () => {
  it('serves the verified Zumub 500g photo locally instead of requesting the retailer', () => {
    render(photo(zumubPhoto));

    const image = screen.getByRole('img', { name: 'Creatina 500g' });

    expect(image.getAttribute('src')).toContain('/assets/product-images/zumub-creapure-500g.jpg');
    expect(image.getAttribute('src')).not.toContain('zumub.com');
    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument();
  });

  it('keeps a different pack photo unchanged', () => {
    const otherPack = zumubPhoto.replace('500g', '250g');
    render(photo(otherPack));

    expect(screen.getByRole('img')).toHaveAttribute('src', otherPack);
  });

  it('replaces a failed image with an accessible placeholder and visible label', () => {
    const { container } = render(photo('https://retailer.example/photo.jpg', { showLabel: true }));

    fireEvent.error(screen.getByRole('img'));

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Creatina 500g — Image unavailable' })).toBeVisible();
    expect(screen.getByText('Image unavailable')).toBeVisible();
  });

  it('shows a compact placeholder for an absent URL without a broken image request', () => {
    const { container } = render(photo(undefined, { className: 'w-8 h-8' }));

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveClass('w-8', 'h-8');
    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument();
  });

  it('tries a new URL after failure and retries the original URL if it returns', () => {
    const original = 'https://retailer.example/old.jpg';
    const updated = 'https://retailer.example/new.jpg';
    const { rerender } = render(photo(original));
    fireEvent.error(screen.getByRole('img'));

    rerender(photo(updated));
    expect(screen.getByRole('img')).toHaveAttribute('src', updated);

    rerender(photo(original));
    expect(screen.getByRole('img')).toHaveAttribute('src', original);
  });

  it('uses the selected language for unavailable photos', async () => {
    await i18n.changeLanguage('pt-PT');
    render(photo('', { showLabel: true }));

    expect(screen.getByText('Imagem indisponível')).toBeVisible();
    expect(screen.getByRole('img')).toHaveAccessibleName('Creatina 500g — Imagem indisponível');
    await i18n.changeLanguage('en-GB');
  });
});
