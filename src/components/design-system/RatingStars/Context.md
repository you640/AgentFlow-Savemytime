
# RatingStars

Read-only star average with optional review count. Supports half-star precision via clip-path.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rating` | `number` | — | Average, rounded to nearest half. |
| `max` | `number` | `5` | Total stars. |
| `reviewCount` | `number` | — | Shows `(n)` when provided. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size. |

## Usage

```tsx
import { RatingStars } from 'components/RatingStars'

<RatingStars rating={4.5} reviewCount={128} />
```
