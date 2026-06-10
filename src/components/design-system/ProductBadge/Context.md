
# ProductBadge

Positioned "New" / "Sale" / "Sold out" overlay for product imagery. Wraps `Badge` with absolute positioning and Slovak default labels.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` | `'new' \| 'sale' \| 'soldOut'` | — | Status, drives color and default label. |
| `label` | `string` | localized default | Override text (e.g. "−20 %"). |
| `position` | `'top-left' \| 'top-right'` | `'top-left'` | Corner placement. |
| `className` | `string` | — | Extra classes. |

Place inside a `relative` container (e.g. the product image wrapper).

## Usage

```tsx
import { ProductBadge } from 'components/ProductBadge'

<div className="relative …">
  <ProductBadge kind="sale" />
</div>
```
