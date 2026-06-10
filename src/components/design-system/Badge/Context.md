
# Badge

Frosted status pill for products (sale, new, sold out). Based on the storefront's `ProductBadge` — a translucent, blurred rounded pill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Pill text. |
| `status` | `'default' \| 'new' \| 'sale' \| 'soldOut'` | `'default'` | Color treatment. |
| `className` | `string` | — | Extra classes (e.g. positioning). |

## Usage

```tsx
import { Badge } from 'components/Badge'

<Badge label="Zľava" status="sale" />
```
