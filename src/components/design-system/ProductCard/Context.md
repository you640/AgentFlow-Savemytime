
# ProductCard

Product tile: image (with hover swap), optional badge overlay, title, price, and a hover-revealed quick-add button. The grid building block of the storefront.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `product` | `StorefrontProductCard` | — | Product data (id, handle, title, price, images, badge, availability). |
| `onAddToCart` | `(payload) => Promise \| void` | — | Passed through to the quick-add button. |
| `labels` | `AddToCartLabels` | — | Override add-to-cart copy. |

`StorefrontProductCard` includes `id`, `handle`, `title`, `availableForSale`, optional `badge`, `featuredImage`, `hoverImage`, and `priceRange.minVariantPrice { amount, currencyCode }`.

## Usage

```tsx
import { ProductCard } from 'components/ProductCard'

<ProductCard product={product} onAddToCart={addToCart} />
```
