# Project Context

## What This Is

This EDS platform is being built alongside an existing AEM as a Cloud Service project
(codenamed "Phoenix"). Phoenix uses Sling Models, HTL, and AEM Clientlibs. This EDS
platform is net-new — it does not migrate Phoenix content, it establishes a parallel
delivery channel using the same design system.

## Design System Background

The Phoenix project uses `@novonordiskit/phx-style-system` — a Figma-derived design
token system published as a private npm package on Azure DevOps Artifacts. It provides:

- Per-brand compiled CSS files with hundreds of CSS custom properties
- Semantic token naming: `--color-background-primary`, `--component-button-*`, etc.
- All brand tokens are scoped to `[data-brand="[name]"]` on `<body>`
- Light/dark theme variants are applied via `data-theme` on `<body>`
- Pre-compiled component CSS using `phx-*` class names (Accordion, Card, Tabs, Button, etc.)
- SCSS mixins for typography, breakpoints, and interactive component states

Phoenix compiles each brand's CSS via webpack + SCSS and commits the compiled output
to the repo as AEM clientlib CSS. EDS follows the same pattern:
- Brand CSS files are vendored into `tokens/vendor/` and committed
- Block SCSS files are compiled to CSS and committed alongside the `.scss` source
- Neither the brand CSS nor the block CSS requires authentication or a build step at serve time

Phoenix's Sling Models render `phx-*` class names directly in server-side HTML. In EDS,
there is no server-side rendering — block JS is responsible for adding `phx-*` class
names to the EDS-generated DOM so phx component CSS applies correctly.

## Theme Model

Phoenix has 13 brand themes (ozempic, wegovy, rybelsus, awiqli, novolog,
novonordisk-medical, novopricing — each with light/dark variants).
EDS replicates this using the same `data-brand` + `data-theme` attributes on `<body>`.

## Multi-Site Vision

The platform must support Novo Nordisk's portfolio of brand sites (patient-facing,
HCP-facing, and B2B). Each brand site:
- Has its own visual identity via phx-style-system brand tokens
- Shares all blocks with other sites
- Has its own content (SharePoint/Google Drive folders)
- Can override individual blocks if needed

## Adding a New Brand Site

Requires only:
1. `tokens/vendor/[brand].css` — vendored compiled brand CSS from phx-style-system
2. `tokens/[brand].css` — thin wrapper: `@import url('./vendor/[brand].css');`
3. `sites/[brand]/site.json` — brand, theme, locale, nav, footer config
4. SharePoint/Google Drive content mount in `fstab.yaml`

No changes to shared blocks.
