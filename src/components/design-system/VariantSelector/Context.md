
# VariantSelector

Color or size swatches with availability state. Renders color circles when options carry a `color`, otherwise text chips. Controlled via `value` + `onChange`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Group label (e.g. "Veľkosť"). |
| `options` | `VariantOption[]` | — | `{ id, label, color?, available? }`. |
| `value` | `string` | — | Selected option id. |
| `onChange` | `(id: string) => void` | — | Selection handler. |

Unavailable options (`available: false`) are dimmed and disabled.

## Usage

```tsx
import { VariantSelector } from 'components/VariantSelector'

<VariantSelector label="Farba" value={color} onChange={setColor} options={colors} />
```
