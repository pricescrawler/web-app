import { ImageOff } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cachedImages from './cachedImages';

function ProductImageContent({ alt, className, showLabel, src }) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const label = t('general.image-unavailable');

    return (
      <span
        aria-label={alt ? `${alt} — ${label}` : label}
        className={`inline-flex flex-col items-center justify-center gap-2 text-muted-foreground ${className || ''}`}
        role={'img'}
        title={label}
      >
        <ImageOff
          aria-hidden={'true'}
          className={'w-6 h-6 max-w-full max-h-full flex-shrink-0'}
        />
        {showLabel && <span className={'text-xs text-center'}>{label}</span>}
      </span>
    );
  }

  return (
    <img
      alt={alt || ''}
      className={className}
      loading={'lazy'}
      referrerPolicy={'no-referrer'}
      src={cachedImages.get(src) || src}
      onError={() => setFailed(true)}
    />
  );
}

const imagePropTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  showLabel: PropTypes.bool,
  src: PropTypes.string
};

ProductImageContent.propTypes = imagePropTypes;

function ProductImage(props) {
  // Remount for a new URL so a previous retailer failure cannot hide a new photo.
  return (
    <ProductImageContent
      {...props}
      key={props.src || ''}
    />
  );
}

ProductImage.propTypes = imagePropTypes;

export default ProductImage;
