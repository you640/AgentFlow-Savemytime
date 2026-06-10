
# SectionHeading

Playfair Display section title with an optional subtitle, for introducing storefront sections. Centered by default.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | — | The heading text. |
| `subtitle` | `React.ReactNode` | — | Optional supporting line. |
| `alignment` | `'left' \| 'center'` | `'center'` | Text alignment. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { SectionHeading } from 'components/SectionHeading'

<SectionHeading title="Naše kolekcie" subtitle="Prírodná starostlivosť." />
```
