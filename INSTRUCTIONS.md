# Project Instructions

## Platform Goal

This is a multi-site EDS platform. A single codebase hosts multiple brand websites.
New brand sites are added by creating a site config and token entry point — no changes
to shared blocks are ever required.

## Repository Structure

- `blocks/` — shared blocks used by all sites. Never put brand-specific logic here.
- `sites/[site-name]/` — site-specific overrides (blocks, styles, site.json)
- `tokens/` — brand token entry points, vendored brand CSS, and bridge files
- `tokens/vendor/` — vendored compiled CSS from phx-style-system (committed to repo)
- `scripts/scripts.js` — reads site config, applies data-brand to body, loads tokens

## Site Configuration

Each site has `sites/[site-name]/site.json`:

```json
{
  "brand": "novomedlink",
  "theme": "light",
  "locale": "en-US",
  "nav": "/novomedlink/nav",
  "footer": "/novomedlink/footer"
}
```

## Token Rules (MANDATORY)

**Never hardcode colors, spacing, or font weights in block CSS.**
All values must come from CSS custom properties:

| Category | Source | Example token |
|----------|--------|---------------|
| Color | phx-style-system brand CSS | `var(--color-background-primary)` |
| Component values | phx-style-system brand CSS | `var(--component-button-padding-vertical-medium)` |
| Spacing | `tokens/spacing.css` bridge | `var(--spacing-32)` |
| Font weight | `tokens/typography.css` bridge | `var(--font-weight-bold)` |

phx-style-system's spacing and font-weight are SCSS variables, not CSS custom properties.
The `tokens/spacing.css` and `tokens/typography.css` files bridge this gap.

## Block Authoring

Each block has three files:

- `[block].js` — adds `phx-*` class names to the EDS-rendered DOM so phx component CSS applies
- `[block].scss` — SCSS source: `@forward` phx component CSS + EDS-specific extensions on top
- `[block].css` — compiled output, committed to repo. EDS serves this at runtime — there is no build step at serve time.

**For components that have a phx equivalent** (accordion, card, tabs, button, hero, etc.):
1. JS maps EDS DOM structure to `phx-*` class names
2. SCSS forwards the phx component CSS unchanged, then adds any site-specific rules on top

Example — accordion:
```scss
// blocks/accordion/accordion.scss
@forward "@novonordiskit/phx-style-system/components/css/Accordion";
@forward "@novonordiskit/phx-style-system/components/css/Divider";

// EDS-specific extensions (same pattern as Phoenix)
.accordion {
  // block-level overrides if needed
}
```

**For layout or custom blocks without a phx equivalent:**
- Write SCSS using CSS custom properties directly: `var(--component-*)`, `var(--color-*)`
- Use phx typography mixins for type styles:
  `@use "@novonordiskit/phx-style-system/mixins/mix-typography" as typography;`

**Available phx component CSS files** (in `@novonordiskit/phx-style-system/components/css/`):
Accordion, Breadcrumbs, Button, Card, Carousel, Checkbox, CheckboxGroup,
DisclaimerBadge, Divider, Dropdown, FloatingCta, Hero, Icon, Image, List,
MessageBanner, Modal, Pagination, RadioGroup, SocialShare, Tabs, TextField

**Available phx mixins** (in `@novonordiskit/phx-style-system/mixins/`):
- `mix-typography` — heading-xl/lg/md/sm/xs/xxs, body-lg/md/sm/xs, label-lg/md/sm, text color helpers
- `mix-breakpoint` — responsive breakpoint helpers
- `mix-colors` — color utility mixins
- `mix-component-Button` — button variant mixins (tertiary, inline, etc.)

## Block Rules

- Blocks must work with ANY brand — no `data-brand`-specific code inside block JS/CSS
- Brand switching is entirely controlled by `data-brand` / `data-theme` on `<body>`
- Block JS adds `phx-*` class names; it does not apply brand logic
- Site-specific overrides live in `sites/[site]/blocks/[block-name]/` and extend (not replace) the shared block

## Design System

Source: `@novonordiskit/phx-style-system@2026.3.25-1` (private npm, Azure DevOps Artifacts)

Brand CSS files are **vendored into the repo** at `tokens/vendor/[brand].css` — do not
reference `node_modules` at runtime. Vendored files are updated by running `npm run sync-tokens`.

Each site has a thin token entry point that imports its vendored brand CSS:
- `tokens/ozempic.css` → `@import url('./vendor/ozempic.css');`
- `tokens/wegovy.css`  → `@import url('./vendor/wegovy.css');`

Applied via `[data-brand="[brand]"]` selector on `<body>` — set by `scripts.js` at runtime.

Available brands (vendored): ozempic, wegovy, rybelsus
(novomedlink tokens will be added to `tokens/vendor/` when brand CSS is available)

## Pilot Site

Site: novomedlink
Pilot pages:
- https://www.novomedlink.com/semaglutide/patient-safety.html
- https://www.novomedlink.com/semaglutide/medicines.html
