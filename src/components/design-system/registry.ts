// AUTO-GENERATED — do not edit manually.
// Re-run the design system builder to regenerate.

import type { ComponentPreviewModule } from './previewTypes';
import __AccordionPreviews from './Accordion/Accordion.previews';
import __AddToCartButtonPreviews from './AddToCartButton/AddToCartButton.previews';
import __BadgePreviews from './Badge/Badge.previews';
import __BreadcrumbPreviews from './Breadcrumb/Breadcrumb.previews';
import __ButtonPreviews from './Button/Button.previews';
import __CartDrawerPreviews from './CartDrawer/CartDrawer.previews';
import __CartLineItemPreviews from './CartLineItem/CartLineItem.previews';
import __CheckboxPreviews from './Checkbox/Checkbox.previews';
import __DrawerPreviews from './Drawer/Drawer.previews';
import __EmptyStatePreviews from './EmptyState/EmptyState.previews';
import __FilterSidebarPreviews from './FilterSidebar/FilterSidebar.previews';
import __GlassPanelPreviews from './GlassPanel/GlassPanel.previews';
import __InputPreviews from './Input/Input.previews';
import __LogoPreviews from './Logo/Logo.previews';
import __ModalPreviews from './Modal/Modal.previews';
import __OrderSummaryPreviews from './OrderSummary/OrderSummary.previews';
import __PaginationPreviews from './Pagination/Pagination.previews';
import __PriceTagPreviews from './PriceTag/PriceTag.previews';
import __ProductBadgePreviews from './ProductBadge/ProductBadge.previews';
import __ProductCardPreviews from './ProductCard/ProductCard.previews';
import __ProductGalleryPreviews from './ProductGallery/ProductGallery.previews';
import __QuantityStepperPreviews from './QuantityStepper/QuantityStepper.previews';
import __RadioGroupPreviews from './RadioGroup/RadioGroup.previews';
import __RatingStarsPreviews from './RatingStars/RatingStars.previews';
import __ReviewCardPreviews from './ReviewCard/ReviewCard.previews';
import __SearchDrawerPreviews from './SearchDrawer/SearchDrawer.previews';
import __SectionHeadingPreviews from './SectionHeading/SectionHeading.previews';
import __SelectPreviews from './Select/Select.previews';
import __SkeletonPreviews from './Skeleton/Skeleton.previews';
import __SpinnerPreviews from './Spinner/Spinner.previews';
import __StepsPreviews from './Steps/Steps.previews';
import __TabsPreviews from './Tabs/Tabs.previews';
import __TextareaPreviews from './Textarea/Textarea.previews';
import __ToastPreviews from './Toast/Toast.previews';
import __TooltipPreviews from './Tooltip/Tooltip.previews';
import __VariantSelectorPreviews from './VariantSelector/VariantSelector.previews';
const __contextMd: Record<string, string> = {
  "Accordion": `

# Accordion

Collapsible panels for FAQ, product details, shipping, etc. Smoothly animated with framer-motion. Single-open by default; set \`multiple\` to allow several open at once.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`AccordionItemData[]\` | — | \`{ id, title, content }[]\`. |
| \`multiple\` | \`boolean\` | \`false\` | Allow multiple panels open simultaneously. |
| \`defaultOpen\` | \`string[]\` | \`[]\` | Item ids open initially. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Accordion } from 'components/Accordion'

<Accordion items={faqItems} defaultOpen={['shipping']} />
\`\`\`

`,
  "AddToCartButton": `
# AddToCartButton

Primary buy CTA with built-in loading and sold-out states. Slovak labels by default ("Do košíka" / "Pridávam..." / "Vypredané"), overridable via \`labels\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`productId\` | \`string\` | — | Product identifier passed to \`onAddToCart\`. |
| \`availableForSale\` | \`boolean\` | — | When false, shows the sold-out label and disables. |
| \`variant\` | \`'default' \\| 'quick-add'\` | \`'default'\` | \`default\` is the full liquid CTA; \`quick-add\` is the frosted pill used in card hover. |
| \`quantity\` | \`number\` | \`1\` | Quantity to add. |
| \`onAddToCart\` | \`(payload) => Promise \\| void\` | — | Add handler. While awaiting, the button shows the \`adding\` label. |
| \`labels\` | \`AddToCartLabels\` | — | Override \`addToCart\` / \`adding\` / \`soldOut\`. |

## Usage

\`\`\`tsx
import { AddToCartButton } from 'components/AddToCartButton'

<AddToCartButton productId={p.id} availableForSale={p.availableForSale} onAddToCart={addToCart} />
\`\`\`
`,
  "Badge": `
# Badge

Frosted status pill for products (sale, new, sold out). Based on the storefront's \`ProductBadge\` — a translucent, blurred rounded pill.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Pill text. |
| \`status\` | \`'default' \\| 'new' \\| 'sale' \\| 'soldOut'\` | \`'default'\` | Color treatment. |
| \`className\` | \`string\` | — | Extra classes (e.g. positioning). |

## Usage

\`\`\`tsx
import { Badge } from 'components/Badge'

<Badge label="Zľava" status="sale" />
\`\`\`
`,
  "Breadcrumb": `
# Breadcrumb

Category → subcategory → product navigation trail. The last item is rendered as the current page (no link).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`BreadcrumbItem[]\` | — | Ordered trail; each \`{ label, href? }\`. The last item is treated as current. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Breadcrumb } from 'components/Breadcrumb'

<Breadcrumb items={[{ label: 'Domov', href: '/' }, { label: 'Oleje' }]} />
\`\`\`
`,
  "Button": `
# Button

Peach "liquid" CTA for the GrowMedica storefront. Lifts subtly on hover with a soft peach-tinted shadow. The signature primary action across the system.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'primary' \\| 'secondary' \\| 'outline' \\| 'ghost'\` | \`'primary'\` | Visual emphasis. |
| \`fullWidth\` | \`boolean\` | \`false\` | Stretch to container width. |
| \`children\` | \`React.ReactNode\` | — | Button label. |
| \`type\` | \`'button' \\| 'submit' \\| 'reset'\` | \`'button'\` | Native button type. |

Also accepts all native \`<button>\` attributes (\`onClick\`, \`disabled\`, etc.).

## Usage

\`\`\`tsx
import { Button } from 'components/Button'

<Button variant="primary" onClick={addToCart}>Do košíka</Button>
<Button variant="outline" fullWidth>Pokračovať v nákupe</Button>
\`\`\`
`,
  "CartDrawer": `
# CartDrawer

Slide-out cart built on \`Drawer\`. Lists \`CartLineItem\`s, shows an \`OrderSummary\` + checkout CTA in the footer, and renders an empty state when there are no items.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Visibility. |
| \`onClose\` | \`() => void\` | — | Close handler. |
| \`items\` | \`CartLineItemData[]\` | — | Cart line items. |
| \`onQuantityChange\` | \`(id, quantity) => void\` | — | Quantity handler. |
| \`onRemove\` | \`(id) => void\` | — | Remove handler. |
| \`onCheckout\` | \`() => void\` | — | Checkout CTA handler. |
| \`shipping\` | \`number\` | \`0\` | Passed to the summary. |
| \`currency\` | \`string\` | \`'EUR'\` | Currency code. |

Subtotal is derived from the items.

## Usage

\`\`\`tsx
import { CartDrawer } from 'components/CartDrawer'

<CartDrawer open={open} onClose={close} items={items} onQuantityChange={update} onRemove={remove} onCheckout={checkout} />
\`\`\`
`,
  "CartLineItem": `
# CartLineItem

A single cart row: image, title, variant, quantity stepper, line price, and remove button. Composes \`QuantityStepper\` and \`PriceTag\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`item\` | \`CartLineItemData\` | — | \`{ id, title, variant?, image?, price, quantity, currency? }\`. |
| \`onQuantityChange\` | \`(id, quantity) => void\` | — | Quantity change handler. |
| \`onRemove\` | \`(id) => void\` | — | Remove handler. |

Line price shown is \`price × quantity\`.

## Usage

\`\`\`tsx
import { CartLineItem } from 'components/CartLineItem'

<CartLineItem item={item} onQuantityChange={update} onRemove={remove} />
\`\`\`
`,
  "Checkbox": `

# Checkbox

Custom-styled checkbox with optional label and description. Forwards its ref and accepts native \`<input>\` attributes (minus \`type\`).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`React.ReactNode\` | — | Main label. |
| \`description\` | \`React.ReactNode\` | — | Secondary helper line. |
| \`containerClassName\` | \`string\` | — | Wrapper classes. |

Also accepts \`checked\`, \`defaultChecked\`, \`onChange\`, \`disabled\`, etc.

## Usage

\`\`\`tsx
import { Checkbox } from 'components/Checkbox'

<Checkbox label="Súhlasím s podmienkami" checked={v} onChange={onChange} />
\`\`\`

`,
  "Drawer": `
# Drawer

Slide-in overlay panel used for the cart and search. Renders into a portal with a blurred backdrop, animated with framer-motion, closes on Escape or backdrop click, and locks body scroll while open.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Controls visibility. |
| \`onClose\` | \`() => void\` | — | Called on backdrop click, Escape, or close button. |
| \`side\` | \`'right' \\| 'left'\` | \`'right'\` | Which edge it slides from. |
| \`title\` | \`React.ReactNode\` | — | Header title. |
| \`footer\` | \`React.ReactNode\` | — | Sticky footer (e.g. checkout CTA). |
| \`children\` | \`React.ReactNode\` | — | Scrollable body content. |

## Usage

\`\`\`tsx
import { Drawer } from 'components/Drawer'

<Drawer open={open} onClose={close} title="Košík" footer={<Button fullWidth>Pokladňa</Button>}>
  …
</Drawer>
\`\`\`
`,
  "EmptyState": `

# EmptyState

Centered placeholder for empty carts, searches, and lists. Optional icon, description, and action slot.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`icon\` | \`React.ReactNode\` | — | Glyph shown in a soft circle. |
| \`title\` | \`string\` | — | Headline. |
| \`description\` | \`string\` | — | Supporting text. |
| \`action\` | \`React.ReactNode\` | — | CTA slot (e.g. a \`Button\`). |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { EmptyState } from 'components/EmptyState'

<EmptyState icon={<ShoppingBagIcon />} title="Košík je prázdny" action={<Button>Do obchodu</Button>} />
\`\`\`

`,
  "FilterSidebar": `
# FilterSidebar

Faceted filters (category, price, color, size) for product listing pages. Each group is collapsible; options support counts and color swatches. Fully controlled.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`groups\` | \`FilterGroup[]\` | — | \`{ id, label, options }\`; options are \`{ id, label, count?, color? }\`. |
| \`selected\` | \`Record<string, string[]>\` | — | Map of groupId → selected option ids. |
| \`onChange\` | \`(groupId, optionId, checked) => void\` | — | Toggle handler. |
| \`onClear\` | \`() => void\` | — | Shown as "Vymazať" when any filter is active. |

## Usage

\`\`\`tsx
import { FilterSidebar } from 'components/FilterSidebar'

<FilterSidebar groups={groups} selected={selected} onChange={toggle} onClear={clear} />
\`\`\`
`,
  "GlassPanel": `
# GlassPanel

Frosted translucent surface with backdrop blur — the signature container of the GrowMedica system. Use it over warm backgrounds or imagery for the soft-luxury glassmorphism look.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`intensity\` | \`'light' \\| 'medium' \\| 'heavy'\` | \`'medium'\` | Blur + opacity strength. |
| \`className\` | \`string\` | — | Extra classes (radius, padding, etc.). |
| \`children\` | \`React.ReactNode\` | — | Panel contents. |

## Usage

\`\`\`tsx
import { GlassPanel } from 'components/GlassPanel'

<GlassPanel intensity="medium" className="rounded-gm-lg p-8">
  …
</GlassPanel>
\`\`\`
`,
  "Input": `

# Input

Text field with optional label, hint, error message, and leading/trailing icons. Forwards its ref and accepts all native \`<input>\` attributes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Field label. |
| \`hint\` | \`string\` | — | Helper text below the field. |
| \`error\` | \`string\` | — | Error message; switches the field to the invalid (peach) state. |
| \`leadingIcon\` | \`React.ReactNode\` | — | Icon on the left. |
| \`trailingIcon\` | \`React.ReactNode\` | — | Icon on the right. |
| \`containerClassName\` | \`string\` | — | Classes for the wrapper. |

Also accepts all native \`<input>\` attributes.

## Usage

\`\`\`tsx
import { Input } from 'components/Input'

<Input label="E-mail" type="email" placeholder="vas@email.sk" hint="Nikdy ho nezdieľame." />
\`\`\`

`,
  "Logo": `
# Logo

GrowMedica brandmark — Playfair Display wordmark with an optional peach leaf glyph. Links to home.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`showIcon\` | \`boolean\` | \`true\` | Toggle the leaf glyph. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Logo } from 'components/Logo'

<Logo />
\`\`\`
`,
  "Modal": `

# Modal

Centered dialog with a blurred backdrop, animated with framer-motion. Closes on Escape, backdrop click, or the close button; locks body scroll while open.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Visibility. |
| \`onClose\` | \`() => void\` | — | Close handler. |
| \`title\` | \`React.ReactNode\` | — | Header title. |
| \`description\` | \`React.ReactNode\` | — | Sub-header line. |
| \`children\` | \`React.ReactNode\` | — | Body content. |
| \`footer\` | \`React.ReactNode\` | — | Footer actions (right-aligned). |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Max width. |

## Usage

\`\`\`tsx
import { Modal } from 'components/Modal'

<Modal open={open} onClose={close} title="Odstrániť?" footer={<Button onClick={confirm}>Odstrániť</Button>}>
  …
</Modal>
\`\`\`

`,
  "OrderSummary": `
# OrderSummary

Subtotal, optional discount, shipping, tax, and total breakdown. Free shipping shows "Zdarma". Formats with \`Intl.NumberFormat\` (Slovak + EUR by default).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`subtotal\` | \`number\` | — | Items subtotal. |
| \`shipping\` | \`number\` | \`0\` | Shipping cost; \`0\` renders "Zdarma". |
| \`tax\` | \`number\` | \`0\` | Tax; hidden when 0. |
| \`discount\` | \`number\` | \`0\` | Discount; hidden when 0. |
| \`currency\` | \`string\` | \`'EUR'\` | ISO currency. |
| \`locale\` | \`string\` | \`'sk-SK'\` | Formatting locale. |

Total = subtotal + shipping + tax − discount.

## Usage

\`\`\`tsx
import { OrderSummary } from 'components/OrderSummary'

<OrderSummary subtotal={49.8} shipping={3.9} tax={9.96} />
\`\`\`
`,
  "Pagination": `

# Pagination

Page navigation with previous/next arrows and ellipsis truncation for long ranges. Controlled via \`page\` + \`onPageChange\`. Renders nothing when there's a single page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`page\` | \`number\` | — | Current page (1-indexed). |
| \`totalPages\` | \`number\` | — | Total page count. |
| \`onPageChange\` | \`(page: number) => void\` | — | Page change handler. |
| \`siblingCount\` | \`number\` | \`1\` | Page numbers shown on each side of the current page. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Pagination } from 'components/Pagination'

<Pagination page={page} totalPages={24} onPageChange={setPage} />
\`\`\`

`,
  "PriceTag": `
# PriceTag

Current price with optional compare-at strikethrough and a savings percentage. Formats with \`Intl.NumberFormat\` (Slovak locale + EUR by default).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`amount\` | \`number\` | — | Current price. |
| \`compareAt\` | \`number\` | — | Original price; shown struck-through when higher than \`amount\`. |
| \`currency\` | \`string\` | \`'EUR'\` | ISO currency code. |
| \`locale\` | \`string\` | \`'sk-SK'\` | Formatting locale. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Type scale. |

## Usage

\`\`\`tsx
import { PriceTag } from 'components/PriceTag'

<PriceTag amount={19.9} compareAt={24.9} size="lg" />
\`\`\`
`,
  "ProductBadge": `
# ProductBadge

Positioned "New" / "Sale" / "Sold out" overlay for product imagery. Wraps \`Badge\` with absolute positioning and Slovak default labels.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`kind\` | \`'new' \\| 'sale' \\| 'soldOut'\` | — | Status, drives color and default label. |
| \`label\` | \`string\` | localized default | Override text (e.g. "−20 %"). |
| \`position\` | \`'top-left' \\| 'top-right'\` | \`'top-left'\` | Corner placement. |
| \`className\` | \`string\` | — | Extra classes. |

Place inside a \`relative\` container (e.g. the product image wrapper).

## Usage

\`\`\`tsx
import { ProductBadge } from 'components/ProductBadge'

<div className="relative …">
  <ProductBadge kind="sale" />
</div>
\`\`\`
`,
  "ProductCard": `
# ProductCard

Product tile: image (with hover swap), optional badge overlay, title, price, and a hover-revealed quick-add button. The grid building block of the storefront.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`product\` | \`StorefrontProductCard\` | — | Product data (id, handle, title, price, images, badge, availability). |
| \`onAddToCart\` | \`(payload) => Promise \\| void\` | — | Passed through to the quick-add button. |
| \`labels\` | \`AddToCartLabels\` | — | Override add-to-cart copy. |

\`StorefrontProductCard\` includes \`id\`, \`handle\`, \`title\`, \`availableForSale\`, optional \`badge\`, \`featuredImage\`, \`hoverImage\`, and \`priceRange.minVariantPrice { amount, currencyCode }\`.

## Usage

\`\`\`tsx
import { ProductCard } from 'components/ProductCard'

<ProductCard product={product} onAddToCart={addToCart} />
\`\`\`
`,
  "ProductGallery": `
# ProductGallery

Primary product image with a selectable thumbnail row, for the PDP. The active image cross-fades on change; the thumbnail row is hidden for a single image.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`images\` | \`GalleryImage[]\` | — | \`{ url, altText? }[]\`. First image is active by default. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { ProductGallery } from 'components/ProductGallery'

<ProductGallery images={product.images} />
\`\`\`
`,
  "QuantityStepper": `
# QuantityStepper

Increment/decrement quantity control, clamped between \`min\` and \`max\`. Controlled via \`value\` + \`onChange\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`value\` | \`number\` | — | Current quantity. |
| \`onChange\` | \`(value: number) => void\` | — | Fired with the clamped next value. |
| \`min\` | \`number\` | \`1\` | Lower bound. |
| \`max\` | \`number\` | \`99\` | Upper bound. |
| \`disabled\` | \`boolean\` | \`false\` | Disable both buttons. |

## Usage

\`\`\`tsx
import { QuantityStepper } from 'components/QuantityStepper'

<QuantityStepper value={qty} onChange={setQty} />
\`\`\`
`,
  "RadioGroup": `

# RadioGroup

Card-style radio group with optional per-option descriptions. Fully controlled via \`value\` + \`onChange\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Group label. |
| \`name\` | \`string\` | auto | Shared input name. |
| \`options\` | \`RadioOption[]\` | — | \`{ value, label, description?, disabled? }\`. |
| \`value\` | \`string\` | — | Selected value. |
| \`onChange\` | \`(value: string) => void\` | — | Selection handler. |

## Usage

\`\`\`tsx
import { RadioGroup } from 'components/RadioGroup'

<RadioGroup label="Doručenie" value={v} onChange={setV} options={options} />
\`\`\`

`,
  "RatingStars": `
# RatingStars

Read-only star average with optional review count. Supports half-star precision via clip-path.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`rating\` | \`number\` | — | Average, rounded to nearest half. |
| \`max\` | \`number\` | \`5\` | Total stars. |
| \`reviewCount\` | \`number\` | — | Shows \`(n)\` when provided. |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Star size. |

## Usage

\`\`\`tsx
import { RatingStars } from 'components/RatingStars'

<RatingStars rating={4.5} reviewCount={128} />
\`\`\`
`,
  "ReviewCard": `
# ReviewCard

Customer review: star rating, optional title, body, and reviewer line with optional verified badge and date.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`rating\` | \`number\` | — | Star rating. |
| \`title\` | \`string\` | — | Optional headline. |
| \`body\` | \`string\` | — | Review text. |
| \`author\` | \`string\` | — | Reviewer name. |
| \`date\` | \`string\` | — | Optional date label. |
| \`verified\` | \`boolean\` | \`false\` | Show "Overený nákup". |

## Usage

\`\`\`tsx
import { ReviewCard } from 'components/ReviewCard'

<ReviewCard rating={5} title="Skvelé" body="…" author="Mária K." verified />
\`\`\`
`,
  "SearchDrawer": `

# SearchDrawer

Slide-in search panel built on \`Drawer\`, with an autofocused \`Input\` and a suggestion list. Fully controlled — you own the query and supply filtered \`suggestions\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`open\` | \`boolean\` | — | Visibility. |
| \`onClose\` | \`() => void\` | — | Close handler. |
| \`query\` | \`string\` | — | Current search text. |
| \`onQueryChange\` | \`(query: string) => void\` | — | Fired on input. |
| \`suggestions\` | \`SearchSuggestion[]\` | \`[]\` | \`{ id, label, href? }[]\`. |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading line. |
| \`onSelect\` | \`(suggestion) => void\` | — | Called on suggestion click (prevents navigation when provided). |
| \`placeholder\` | \`string\` | \`'Hľadať produkty…'\` | Input placeholder. |
| \`emptyLabel\` | \`string\` | localized | Shown when a non-empty query has no results. |

## Usage

\`\`\`tsx
import { SearchDrawer } from 'components/SearchDrawer'

<SearchDrawer open={open} onClose={close} query={q} onQueryChange={setQ} suggestions={results} />
\`\`\`

`,
  "SectionHeading": `
# SectionHeading

Playfair Display section title with an optional subtitle, for introducing storefront sections. Centered by default.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`title\` | \`React.ReactNode\` | — | The heading text. |
| \`subtitle\` | \`React.ReactNode\` | — | Optional supporting line. |
| \`alignment\` | \`'left' \\| 'center'\` | \`'center'\` | Text alignment. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { SectionHeading } from 'components/SectionHeading'

<SectionHeading title="Naše kolekcie" subtitle="Prírodná starostlivosť." />
\`\`\`
`,
  "Select": `

# Select

Styled native \`<select>\` with a chevron, optional label, hint, error, and placeholder. Forwards its ref.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`options\` | \`SelectOption[]\` | — | \`{ value, label, disabled? }[]\`. |
| \`placeholder\` | \`string\` | — | Disabled first option shown when empty. |
| \`label\` | \`string\` | — | Field label. |
| \`hint\` | \`string\` | — | Helper text. |
| \`error\` | \`string\` | — | Error message; invalid state. |
| \`containerClassName\` | \`string\` | — | Wrapper classes. |

Also accepts all native \`<select>\` attributes (\`value\`, \`onChange\`, etc.).

## Usage

\`\`\`tsx
import { Select } from 'components/Select'

<Select label="Krajina" placeholder="Vyberte" options={options} value={v} onChange={onChange} />
\`\`\`

`,
  "Skeleton": `

# Skeleton

Pulsing loading placeholder. Exports the base \`Skeleton\` plus a ready-made \`ProductCardSkeleton\`. Respects \`prefers-reduced-motion\`.

## Props — \`Skeleton\`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`'rect' \\| 'text' \\| 'circle'\` | \`'rect'\` | Shape preset (\`text\` sets a line height; \`circle\` is fully rounded). |
| \`className\` | \`string\` | — | Sizing / extra classes. |

\`ProductCardSkeleton\` takes an optional \`className\` and mirrors the \`ProductCard\` layout.

## Usage

\`\`\`tsx
import { Skeleton, ProductCardSkeleton } from 'components/Skeleton'

<Skeleton variant="text" className="w-2/3" />
<ProductCardSkeleton />
\`\`\`

`,
  "Spinner": `

# Spinner

Peach-tinted loading spinner. Respects \`prefers-reduced-motion\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`size\` | \`'sm' \\| 'md' \\| 'lg'\` | \`'md'\` | Spinner size. |
| \`label\` | \`string\` | \`'Načítava sa…'\` | Accessible label. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Spinner } from 'components/Spinner'

<Spinner size="lg" />
\`\`\`

`,
  "Steps": `

# Steps

Horizontal progress indicator for multi-step flows (checkout). Completed steps show a check, the current step is ringed, and the connector fills as you advance.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`steps\` | \`StepItem[]\` | — | \`{ label, description? }[]\`. |
| \`current\` | \`number\` | — | Zero-based index of the active step. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Steps } from 'components/Steps'

<Steps steps={[{ label: 'Košík' }, { label: 'Platba' }]} current={1} />
\`\`\`

`,
  "Tabs": `

# Tabs

Underlined tab navigation with panels. Works controlled (\`value\` + \`onChange\`) or uncontrolled (\`defaultValue\`). Panels cross-fade in.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`items\` | \`TabItem[]\` | — | \`{ id, label, content, disabled? }[]\`. |
| \`value\` | \`string\` | — | Controlled active tab id. |
| \`defaultValue\` | \`string\` | first item | Uncontrolled initial tab. |
| \`onChange\` | \`(id: string) => void\` | — | Fired on tab change. |
| \`className\` | \`string\` | — | Extra classes. |

## Usage

\`\`\`tsx
import { Tabs } from 'components/Tabs'

<Tabs items={[{ id: 'desc', label: 'Popis', content: <p>…</p> }]} />
\`\`\`

`,
  "Textarea": `

# Textarea

Multiline text field with optional label, hint, and error message. Forwards its ref and accepts all native \`<textarea>\` attributes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Field label. |
| \`hint\` | \`string\` | — | Helper text. |
| \`error\` | \`string\` | — | Error message; switches to the invalid state. |
| \`rows\` | \`number\` | \`4\` | Visible rows. |
| \`containerClassName\` | \`string\` | — | Wrapper classes. |

Also accepts all native \`<textarea>\` attributes.

## Usage

\`\`\`tsx
import { Textarea } from 'components/Textarea'

<Textarea label="Vaša správa" placeholder="Napíšte nám…" />
\`\`\`

`,
  "Toast": `

# Toast

Frosted-glass notification system. Wrap the app in \`ToastProvider\`, then call \`toast(...)\` from the \`useToast\` hook. Toasts auto-dismiss, stack bottom-right, and animate with framer-motion. Self-contained — no external toast library.

## API

\`\`\`tsx
const { toast } = useToast()

toast({
  title: 'Pridané do košíka',
  description: 'Levanduľový olej · 1 ks', // optional
  variant: 'success',  // 'success' | 'error' | 'info' (default 'success')
  duration: 4000,      // ms; 0 disables auto-dismiss
})
\`\`\`

## Setup

| Export | Description |
| --- | --- |
| \`ToastProvider\` | Context + portal host. Mount once near the app root. |
| \`useToast()\` | Returns \`{ toast }\`. Must be used inside the provider. |

## Usage

\`\`\`tsx
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
\`\`\`

`,
  "Tooltip": `

# Tooltip

Lightweight hover/focus tooltip in the dark text color. Shows on mouse enter and keyboard focus for accessibility.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`content\` | \`React.ReactNode\` | — | Tooltip text. |
| \`side\` | \`'top' \\| 'bottom' \\| 'left' \\| 'right'\` | \`'top'\` | Placement relative to the trigger. |
| \`children\` | \`React.ReactNode\` | — | Trigger element. |
| \`className\` | \`string\` | — | Extra classes on the bubble. |

## Usage

\`\`\`tsx
import { Tooltip } from 'components/Tooltip'

<Tooltip content="Pridať do obľúbených"><Button>Obľúbené</Button></Tooltip>
\`\`\`

`,
  "VariantSelector": `
# VariantSelector

Color or size swatches with availability state. Renders color circles when options carry a \`color\`, otherwise text chips. Controlled via \`value\` + \`onChange\`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`label\` | \`string\` | — | Group label (e.g. "Veľkosť"). |
| \`options\` | \`VariantOption[]\` | — | \`{ id, label, color?, available? }\`. |
| \`value\` | \`string\` | — | Selected option id. |
| \`onChange\` | \`(id: string) => void\` | — | Selection handler. |

Unavailable options (\`available: false\`) are dimmed and disabled.

## Usage

\`\`\`tsx
import { VariantSelector } from 'components/VariantSelector'

<VariantSelector label="Farba" value={color} onChange={setColor} options={colors} />
\`\`\`
`
};

export const componentRegistry: ComponentPreviewModule[] = [
__AccordionPreviews,
__AddToCartButtonPreviews,
__BadgePreviews,
__BreadcrumbPreviews,
__ButtonPreviews,
__CartDrawerPreviews,
__CartLineItemPreviews,
__CheckboxPreviews,
__DrawerPreviews,
__EmptyStatePreviews,
__FilterSidebarPreviews,
__GlassPanelPreviews,
__InputPreviews,
__LogoPreviews,
__ModalPreviews,
__OrderSummaryPreviews,
__PaginationPreviews,
__PriceTagPreviews,
__ProductBadgePreviews,
__ProductCardPreviews,
__ProductGalleryPreviews,
__QuantityStepperPreviews,
__RadioGroupPreviews,
__RatingStarsPreviews,
__ReviewCardPreviews,
__SearchDrawerPreviews,
__SectionHeadingPreviews,
__SelectPreviews,
__SkeletonPreviews,
__SpinnerPreviews,
__StepsPreviews,
__TabsPreviews,
__TextareaPreviews,
__ToastPreviews,
__TooltipPreviews,
__VariantSelectorPreviews].

filter((m) => m && m.componentName).
map((m) => ({ ...m, contextMd: __contextMd[m.componentName] ?? m.contextMd })).
sort((a, b) => a.componentName.localeCompare(b.componentName));