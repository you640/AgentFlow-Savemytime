

# Input

Text field with optional label, hint, error message, and leading/trailing icons. Forwards its ref and accepts all native `<input>` attributes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label. |
| `hint` | `string` | — | Helper text below the field. |
| `error` | `string` | — | Error message; switches the field to the invalid (peach) state. |
| `leadingIcon` | `React.ReactNode` | — | Icon on the left. |
| `trailingIcon` | `React.ReactNode` | — | Icon on the right. |
| `containerClassName` | `string` | — | Classes for the wrapper. |

Also accepts all native `<input>` attributes.

## Usage

```tsx
import { Input } from 'components/Input'

<Input label="E-mail" type="email" placeholder="vas@email.sk" hint="Nikdy ho nezdieľame." />
```

