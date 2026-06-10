

# Select

Styled native `<select>` with a chevron, optional label, hint, error, and placeholder. Forwards its ref.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | — | `{ value, label, disabled? }[]`. |
| `placeholder` | `string` | — | Disabled first option shown when empty. |
| `label` | `string` | — | Field label. |
| `hint` | `string` | — | Helper text. |
| `error` | `string` | — | Error message; invalid state. |
| `containerClassName` | `string` | — | Wrapper classes. |

Also accepts all native `<select>` attributes (`value`, `onChange`, etc.).

## Usage

```tsx
import { Select } from 'components/Select'

<Select label="Krajina" placeholder="Vyberte" options={options} value={v} onChange={onChange} />
```

