

# Skeleton

Pulsing loading placeholder. Exports the base `Skeleton` plus a ready-made `ProductCardSkeleton`. Respects `prefers-reduced-motion`.

## Props — `Skeleton`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'rect' \| 'text' \| 'circle'` | `'rect'` | Shape preset (`text` sets a line height; `circle` is fully rounded). |
| `className` | `string` | — | Sizing / extra classes. |

`ProductCardSkeleton` takes an optional `className` and mirrors the `ProductCard` layout.

## Usage

```tsx
import { Skeleton, ProductCardSkeleton } from 'components/Skeleton'

<Skeleton variant="text" className="w-2/3" />
<ProductCardSkeleton />
```

