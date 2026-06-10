

# Pagination

Page navigation with previous/next arrows and ellipsis truncation for long ranges. Controlled via `page` + `onPageChange`. Renders nothing when there's a single page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | — | Current page (1-indexed). |
| `totalPages` | `number` | — | Total page count. |
| `onPageChange` | `(page: number) => void` | — | Page change handler. |
| `siblingCount` | `number` | `1` | Page numbers shown on each side of the current page. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { Pagination } from 'components/Pagination'

<Pagination page={page} totalPages={24} onPageChange={setPage} />
```

