

# Toast

Frosted-glass notification system. Wrap the app in `ToastProvider`, then call `toast(...)` from the `useToast` hook. Toasts auto-dismiss, stack bottom-right, and animate with framer-motion. Self-contained — no external toast library.

## API

```tsx
const { toast } = useToast()

toast({
  title: 'Pridané do košíka',
  description: 'Levanduľový olej · 1 ks', // optional
  variant: 'success',  // 'success' | 'error' | 'info' (default 'success')
  duration: 4000,      // ms; 0 disables auto-dismiss
})
```

## Setup

| Export | Description |
| --- | --- |
| `ToastProvider` | Context + portal host. Mount once near the app root. |
| `useToast()` | Returns `{ toast }`. Must be used inside the provider. |

## Usage

```tsx
import { ToastProvider, useToast } from 'components/Toast'

function App() {
  return (
    <ToastProvider>
      <Storefront />
    </ToastProvider>
  )
}

function AddButton() {
  const { toast } = useToast()
  return <button onClick={() => toast({ title: 'Pridané do košíka' })}>Do košíka</button>
}
```

