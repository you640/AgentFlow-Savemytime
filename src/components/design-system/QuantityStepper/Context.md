
# QuantityStepper

Increment/decrement quantity control, clamped between `min` and `max`. Controlled via `value` + `onChange`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Current quantity. |
| `onChange` | `(value: number) => void` | — | Fired with the clamped next value. |
| `min` | `number` | `1` | Lower bound. |
| `max` | `number` | `99` | Upper bound. |
| `disabled` | `boolean` | `false` | Disable both buttons. |

## Usage

```tsx
import { QuantityStepper } from 'components/QuantityStepper'

<QuantityStepper value={qty} onChange={setQty} />
```
