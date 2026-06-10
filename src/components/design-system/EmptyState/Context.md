

# EmptyState

Centered placeholder for empty carts, searches, and lists. Optional icon, description, and action slot.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | — | Glyph shown in a soft circle. |
| `title` | `string` | — | Headline. |
| `description` | `string` | — | Supporting text. |
| `action` | `React.ReactNode` | — | CTA slot (e.g. a `Button`). |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { EmptyState } from 'components/EmptyState'

<EmptyState icon={<ShoppingBagIcon />} title="Košík je prázdny" action={<Button>Do obchodu</Button>} />
```

