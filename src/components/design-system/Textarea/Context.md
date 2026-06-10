

# Textarea

Multiline text field with optional label, hint, and error message. Forwards its ref and accepts all native `<textarea>` attributes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label. |
| `hint` | `string` | — | Helper text. |
| `error` | `string` | — | Error message; switches to the invalid state. |
| `rows` | `number` | `4` | Visible rows. |
| `containerClassName` | `string` | — | Wrapper classes. |

Also accepts all native `<textarea>` attributes.

## Usage

```tsx
import { Textarea } from 'components/Textarea'

<Textarea label="Vaša správa" placeholder="Napíšte nám…" />
```

