

# Checkbox

Custom-styled checkbox with optional label and description. Forwards its ref and accepts native `<input>` attributes (minus `type`).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | — | Main label. |
| `description` | `React.ReactNode` | — | Secondary helper line. |
| `containerClassName` | `string` | — | Wrapper classes. |

Also accepts `checked`, `defaultChecked`, `onChange`, `disabled`, etc.

## Usage

```tsx
import { Checkbox } from 'components/Checkbox'

<Checkbox label="Súhlasím s podmienkami" checked={v} onChange={onChange} />
```

