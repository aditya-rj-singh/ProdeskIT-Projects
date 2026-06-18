# NextGen WashFlow™ — Service Selection Gateway

## Deliverable Summary

The **Service Selection Gateway** module has been architected and delivered as a high-fidelity proof-of-concept. It's a fully functional, premium-grade single-page application built with vanilla HTML, CSS, and JavaScript — no framework dependencies.

> [!TIP]
> **Live at**: https://washflow-gateway.netlify.app/


---


## Components Delivered

### `<WashFlowApp />` — Root Orchestrator
- Centralized state: `selectedPackageId`, `selectedUpsellIds` (Set), `packageData`, `upsellData`, `isLoading`, `error`
- Fetches from JSONPlaceholder APIs (`/posts?_limit=3`, `/comments?_limit=2`) and maps to domain models
- Reactive `setState()` triggers full declarative re-render

### `<ServicePackageCard />` — Package Selection
- 3 packages: **Express Wash** ($12.99), **Premium Shine** ($24.99), **Deluxe Detail** ($39.99)
- Single-select radio-group behavior
- Green border + "CURRENTLY SELECTED" badge on active card
- Feature bullet lists with checkmark icons
- Tier-specific icons (💧 / ✨ / 👑)

### `<AddOnOptionCard />` — Upsell Services
- 2 add-ons: **Tire Shine** (+$5.00), **Underbody Rinse** (+$9.99)
- Multi-select checkbox behavior with Add/Remove toggle
- Blue border glow when selected

### `<OrderSummaryPanel />` — Sticky Sidebar
- Real-time breakdown: selected package, add-ons, subtotal, tax (8.5%), total due
- Gradient-styled total amount
- Sticky positioning (sidebar on desktop, fixed bottom sheet on mobile)

### `<CheckoutButton />` + `<ResetSelectionsButton />`
- Checkout disabled until a package is selected; triggers alert with full order summary
- Reset clears all selections instantly

---

## Business Rules Implemented

### Rule 1: Package Inclusion (Deluxe → Tire Shine)
When **Deluxe Detail** is selected, **Tire Shine** is auto-selected, its card shows "Included" (disabled), and its price is **not** charged.

### Rule 2: Promotional Flag (Premium Shine)
**Premium Shine** displays an animated "LIMITED TIME OFFER!" badge with amber pulse glow.

### Rule 3: Upsell Dependency (Underbody Rinse → Premium/Deluxe)
**Underbody Rinse** is greyed out and non-interactive unless a **Premium** or **Deluxe** package is selected. Shows "⚠ Requires Premium or Deluxe Package" text.

### Rule 4: Dependency Cascade
When switching away from a qualifying package, dependent upsells are automatically deselected.

---

## Design System Highlights

- **Dark glassmorphism** with `backdrop-filter: blur(20px)` and semi-transparent surfaces
- **Animated background orbs** (blue, purple, cyan) with floating motion
- **Subtle grid overlay** with radial mask for depth
- **Inter + Outfit** Google Fonts for professional typography
- **CSS custom properties** for full theme control (50+ tokens)
- **Micro-animations**: card hover lift, badge entrance, promo pulse, loading spinner
- **Custom scrollbar** matching the dark theme
- **Responsive**: 3-column → 1-column grid, sidebar → bottom sheet

## Accessibility

- `role="radiogroup"` for packages, `role="checkbox"` for upsells
- `aria-checked`, `aria-disabled`, `aria-label` on all interactive elements
- `aria-live="polite"` on loading state, `aria-live="assertive"` on errors
- Keyboard navigation with `tabindex` and Enter/Space handlers
- `:focus-visible` ring indicators on all focusable elements

---

## Verification

- API data fetches correctly from JSONPlaceholder
- Package selection is exclusive (single-select)
- Upsell toggling is multi-select with proper dependency enforcement
- Pricing calculates correctly including tax
- All three business rules function as specified
- Error state displays gracefully on API failure
- Responsive layout adapts across all breakpoints
