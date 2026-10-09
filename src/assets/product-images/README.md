# Cached product photos

`zumub-creapure-500g.jpg` is the original 320 × 370 JPEG displayed by Zumub for
Creatina (Creapure®) 500g, product reference `pt.zumub.24947`. It was verified and
saved from the loaded product page on 2026-10-09:

- Product: <https://www.zumub.com/PT/creatina-creatina-monohidratada-c-213_165_74/creatina-creapure-500g#24947>
- Image: <https://www.zumub.com/images/new_normal/zumub_creatine_creapure_500g_unflavoured_front_NEW_NORM.jpg>

The image loaded on Zumub but failed when embedded by the web app. `ProductImage`
serves this saved photo from the app's own assets, using an exact source URL match
in `cachedImages.js`. Other products and pack sizes retain their source images.
If the tracker saves a new image URL, it is used without substituting this photo.

To refresh a cached photo, verify its product and pack size on the retailer's page,
replace the asset, and update the URL mapping if it changed. Vite fingerprints the
asset so a new build invalidates previously cached copies. A retailer may also
change a photo without changing its URL; these saved assets require manual refresh.
