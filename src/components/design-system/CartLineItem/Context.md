
# CartLineItem

A single cart row: image, title, variant, quantity stepper, line price, and remove button. Composes `QuantityStepper` and `PriceTag`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `CartLineItemData` | — | `{ id, title, variant?, image?, price, quantity, currency? }`. |
| `onQuantityChange` | `(id, quantity) => void` | — | Quantity change handler. |
| `onRemove` | `(id) => void` | — | Remove handler. |

Line price shown is `price × quantity`.

## Usage

```tsx
import { CartLineItem } from 'components/CartLineItem'

<CartLineItem item={item} onQuantityChange={update} onRemove={remove} />
```
