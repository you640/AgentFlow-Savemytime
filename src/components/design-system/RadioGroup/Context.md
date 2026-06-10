

# RadioGroup

Card-style radio group with optional per-option descriptions. Fully controlled via `value` + `onChange`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Group label. |
| `name` | `string` | auto | Shared input name. |
| `options` | `RadioOption[]` | — | `{ value, label, description?, disabled? }`. |
| `value` | `string` | — | Selected value. |
| `onChange` | `(value: string) => void` | — | Selection handler. |

## Usage

```tsx
import { RadioGroup } from 'components/RadioGroup'

<RadioGroup label="Doručenie" value={v} onChange={setV} options={options} />
```

