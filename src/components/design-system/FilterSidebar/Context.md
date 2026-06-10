
# FilterSidebar

Faceted filters (category, price, color, size) for product listing pages. Each group is collapsible; options support counts and color swatches. Fully controlled.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` | `FilterGroup[]` | — | `{ id, label, options }`; options are `{ id, label, count?, color? }`. |
| `selected` | `Record<string, string[]>` | — | Map of groupId → selected option ids. |
| `onChange` | `(groupId, optionId, checked) => void` | — | Toggle handler. |
| `onClear` | `() => void` | — | Shown as "Vymazať" when any filter is active. |

## Usage

```tsx
import { FilterSidebar } from 'components/FilterSidebar'

<FilterSidebar groups={groups} selected={selected} onChange={toggle} onClear={clear} />
```
