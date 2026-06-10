

# Tooltip

Lightweight hover/focus tooltip in the dark text color. Shows on mouse enter and keyboard focus for accessibility.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `React.ReactNode` | — | Tooltip text. |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Placement relative to the trigger. |
| `children` | `React.ReactNode` | — | Trigger element. |
| `className` | `string` | — | Extra classes on the bubble. |

## Usage

```tsx
import { Tooltip } from 'components/Tooltip'

<Tooltip content="Pridať do obľúbených"><Button>Obľúbené</Button></Tooltip>
```

