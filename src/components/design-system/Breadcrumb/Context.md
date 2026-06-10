
# Breadcrumb

Category → subcategory → product navigation trail. The last item is rendered as the current page (no link).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | Ordered trail; each `{ label, href? }`. The last item is treated as current. |
| `className` | `string` | — | Extra classes. |

## Usage

```tsx
import { Breadcrumb } from 'components/Breadcrumb'

<Breadcrumb items={[{ label: 'Domov', href: '/' }, { label: 'Oleje' }]} />
```
