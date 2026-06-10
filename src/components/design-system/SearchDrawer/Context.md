

# SearchDrawer

Slide-in search panel built on `Drawer`, with an autofocused `Input` and a suggestion list. Fully controlled — you own the query and supply filtered `suggestions`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Visibility. |
| `onClose` | `() => void` | — | Close handler. |
| `query` | `string` | — | Current search text. |
| `onQueryChange` | `(query: string) => void` | — | Fired on input. |
| `suggestions` | `SearchSuggestion[]` | `[]` | `{ id, label, href? }[]`. |
| `loading` | `boolean` | `false` | Shows a loading line. |
| `onSelect` | `(suggestion) => void` | — | Called on suggestion click (prevents navigation when provided). |
| `placeholder` | `string` | `'Hľadať produkty…'` | Input placeholder. |
| `emptyLabel` | `string` | localized | Shown when a non-empty query has no results. |

## Usage

```tsx
import { SearchDrawer } from 'components/SearchDrawer'

<SearchDrawer open={open} onClose={close} query={q} onQueryChange={setQ} suggestions={results} />
```

