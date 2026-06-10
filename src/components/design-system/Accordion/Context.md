

# Accordion

Collapsible panels for FAQ, product details, shipping, etc. Smoothly animated with framer-motion. Single-open by default; set `multiple` to allow several open at once.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItemData[]` | — | `{ id, title, content }[]`. |
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously. |
| `defaultOpen` | `string[]` | `[]` | Item ids open initially. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { Accordion } from 'components/Accordion'

<Accordion items={faqItems} defaultOpen={['shipping']} />
```

