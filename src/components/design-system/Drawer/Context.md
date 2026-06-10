
# Drawer

Slide-in overlay panel used for the cart and search. Renders into a portal with a blurred backdrop, animated with framer-motion, closes on Escape or backdrop click, and locks body scroll while open.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controls visibility. |
| `onClose` | `() => void` | — | Called on backdrop click, Escape, or close button. |
| `side` | `'right' \| 'left'` | `'right'` | Which edge it slides from. |
| `title` | `React.ReactNode` | — | Header title. |
| `footer` | `React.ReactNode` | — | Sticky footer (e.g. checkout CTA). |
| `children` | `React.ReactNode` | — | Scrollable body content. |

## Usage

```tsx
import { Drawer } from 'components/Drawer'

<Drawer open={open} onClose={close} title="Košík" footer={<Button fullWidth>Pokladňa</Button>}>
  …
</Drawer>
```
