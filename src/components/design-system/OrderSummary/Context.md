
# OrderSummary

Subtotal, optional discount, shipping, tax, and total breakdown. Free shipping shows "Zdarma". Formats with `Intl.NumberFormat` (Slovak + EUR by default).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `subtotal` | `number` | — | Items subtotal. |
| `shipping` | `number` | `0` | Shipping cost; `0` renders "Zdarma". |
| `tax` | `number` | `0` | Tax; hidden when 0. |
| `discount` | `number` | `0` | Discount; hidden when 0. |
| `currency` | `string` | `'EUR'` | ISO currency. |
| `locale` | `string` | `'sk-SK'` | Formatting locale. |

Total = subtotal + shipping + tax − discount.

## Usage

```tsx
import { OrderSummary } from 'components/OrderSummary'

<OrderSummary subtotal={49.8} shipping={3.9} tax={9.96} />
```
