

# Steps

Horizontal progress indicator for multi-step flows (checkout). Completed steps show a check, the current step is ringed, and the connector fills as you advance.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `StepItem[]` | — | `{ label, description? }[]`. |
| `current` | `number` | — | Zero-based index of the active step. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { Steps } from 'components/Steps'

<Steps steps={[{ label: 'Košík' }, { label: 'Platba' }]} current={1} />
```

