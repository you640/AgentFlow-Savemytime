
# GlassPanel

Frosted translucent surface with backdrop blur — the signature container of the GrowMedica system. Use it over warm backgrounds or imagery for the soft-luxury glassmorphism look.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `intensity` | `'light' \| 'medium' \| 'heavy'` | `'medium'` | Blur + opacity strength. |
| `className` | `string` | — | Extra classes (radius, padding, etc.). |
| `children` | `React.ReactNode` | — | Panel contents. |

## Usage

```tsx
import { GlassPanel } from 'components/GlassPanel'

<GlassPanel intensity="medium" className="rounded-gm-lg p-8">
  …
</GlassPanel>
```
