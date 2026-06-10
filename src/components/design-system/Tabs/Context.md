

# Tabs

Underlined tab navigation with panels. Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`). Panels cross-fade in.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | — | `{ id, label, content, disabled? }[]`. |
| `value` | `string` | — | Controlled active tab id. |
| `defaultValue` | `string` | first item | Uncontrolled initial tab. |
| `onChange` | `(id: string) => void` | — | Fired on tab change. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { Tabs } from 'components/Tabs'

<Tabs items={[{ id: 'desc', label: 'Popis', content: <p>…</p> }]} />
```

