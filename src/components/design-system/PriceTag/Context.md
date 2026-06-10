
# PriceTag

Current price with optional compare-at strikethrough and a savings percentage. Formats with `Intl.NumberFormat` (Slovak locale + EUR by default).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `amount` | `number` | — | Current price. |
| `compareAt` | `number` | — | Original price; shown struck-through when higher than `amount`. |
| `currency` | `string` | `'EUR'` | ISO currency code. |
| `locale` | `string` | `'sk-SK'` | Formatting locale. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Type scale. |

## Usage

```tsx
import { PriceTag } from 'components/PriceTag'

<PriceTag amount={19.9} compareAt={24.9} size="lg" />
```
