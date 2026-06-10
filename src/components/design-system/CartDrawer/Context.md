
# CartDrawer

Slide-out cart built on `Drawer`. Lists `CartLineItem`s, shows an `OrderSummary` + checkout CTA in the footer, and renders an empty state when there are no items.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Visibility. |
| `onClose` | `() => void` | — | Close handler. |
| `items` | `CartLineItemData[]` | — | Cart line items. |
| `onQuantityChange` | `(id, quantity) => void` | — | Quantity handler. |
| `onRemove` | `(id) => void` | — | Remove handler. |
| `onCheckout` | `() => void` | — | Checkout CTA handler. |
| `shipping` | `number` | `0` | Passed to the summary. |
| `currency` | `string` | `'EUR'` | Currency code. |

Subtotal is derived from the items.

## Usage

```tsx
import { CartDrawer } from 'components/CartDrawer'

<CartDrawer open={open} onClose={close} items={items} onQuantityChange={update} onRemove={remove} onCheckout={checkout} />
```
