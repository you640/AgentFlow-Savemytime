
# ProductGallery

Primary product image with a selectable thumbnail row, for the PDP. The active image cross-fades on change; the thumbnail row is hidden for a single image.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `GalleryImage[]` | — | `{ url, altText? }[]`. First image is active by default. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { ProductGallery } from 'components/ProductGallery'

<ProductGallery images={product.images} />
```
