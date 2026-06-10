

# Modal

Centered dialog with a blurred backdrop, animated with framer-motion. Closes on Escape, backdrop click, or the close button; locks body scroll while open.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Visibility. |
| `onClose` | `() => void` | — | Close handler. |
| `title` | `React.ReactNode` | — | Header title. |
| `description` | `React.ReactNode` | — | Sub-header line. |
| `children` | `React.ReactNode` | — | Body content. |
| `footer` | `React.ReactNode` | — | Footer actions (right-aligned). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Max width. |

## Usage

```tsx
import { Modal } from 'components/Modal'

<Modal open={open} onClose={close} title="Odstrániť?" footer={<Button onClick={confirm}>Odstrániť</Button>}>
  …
</Modal>
```

