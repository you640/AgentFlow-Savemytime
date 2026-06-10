
# ReviewCard

Customer review: star rating, optional title, body, and reviewer line with optional verified badge and date.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rating` | `number` | — | Star rating. |
| `title` | `string` | — | Optional headline. |
| `body` | `string` | — | Review text. |
| `author` | `string` | — | Reviewer name. |
| `date` | `string` | — | Optional date label. |
| `verified` | `boolean` | `false` | Show "Overený nákup". |

## Usage

```tsx
import { ReviewCard } from 'components/ReviewCard'

<ReviewCard rating={5} title="Skvelé" body="…" author="Mária K." verified />
```
