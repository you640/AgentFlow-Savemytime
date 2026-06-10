
# Button

Peach "liquid" CTA for the GrowMedica storefront. Lifts subtly on hover with a soft peach-tinted shadow. The signature primary action across the system.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual emphasis. |
| `fullWidth` | `boolean` | `false` | Stretch to container width. |
| `children` | `React.ReactNode` | — | Button label. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |

Also accepts all native `<button>` attributes (`onClick`, `disabled`, etc.).

## Usage

```tsx
import { Button } from 'components/Button'

<Button variant="primary" onClick={addToCart}>Do košíka</Button>
<Button variant="outline" fullWidth>Pokračovať v nákupe</Button>
```
