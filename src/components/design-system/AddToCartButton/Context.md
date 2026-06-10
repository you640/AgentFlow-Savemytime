
# AddToCartButton

Primary buy CTA with built-in loading and sold-out states. Slovak labels by default ("Do košíka" / "Pridávam..." / "Vypredané"), overridable via `labels`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `productId` | `string` | — | Product identifier passed to `onAddToCart`. |
| `availableForSale` | `boolean` | — | When false, shows the sold-out label and disables. |
| `variant` | `'default' \| 'quick-add'` | `'default'` | `default` is the full liquid CTA; `quick-add` is the frosted pill used in card hover. |
| `quantity` | `number` | `1` | Quantity to add. |
| `onAddToCart` | `(payload) => Promise \| void` | — | Add handler. While awaiting, the button shows the `adding` label. |
| `labels` | `AddToCartLabels` | — | Override `addToCart` / `adding` / `soldOut`. |

## Usage

```tsx
import { AddToCartButton } from 'components/AddToCartButton'

<AddToCartButton productId={p.id} availableForSale={p.availableForSale} onAddToCart={addToCart} />
```
