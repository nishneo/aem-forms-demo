# Project Context
## What This Replaces
This EDS platform is being built alongside an existing AEM as a Cloud Service project
(codenamed "Phoenix"). Phoenix uses Sling Models, HTL, and AEM Clientlibs. This EDS
platform is net-new — it does not migrate Phoenix content, it establishes a parallel
delivery channel with the same design system.
## Design System Background
The Phoenix project uses `@novonordiskit/phx-style-system` — a Figma-derived design
token system published as an npm package. It provides:
- Per-brand compiled CSS files with hundreds of CSS custom properties
- Semantic token naming: `--color-background-primary`, `--component-button-*`, etc.
- All tokens are scoped to `[data-brand="[name]"]` on `<body>`
- Light/dark theme variants are applied via `data-theme` on `<body>`
The Phoenix theme model (13 brand themes: ozempic, wegovy, rybelsus, awiqli,
novolog, novonordisk-medical, novopricing — each with light/dark variants) should
be replicated in EDS using the same `data-brand` + `data-theme` attribute pattern.
## Multi-Site Vision
The platform must support Novo Nordisk's portfolio of brand sites (patient-facing,
HCP-facing, and B2B). Each brand site:
- Has its own visual identity via phx-style-system brand tokens
- Shares all blocks with other sites
- Has its own content (SharePoint/Google Drive folders)
- Can override individual blocks if needed
## Adding a New Brand Site
Requires only:
1. `tokens/[brand].css` — imports phx-style-system brand CSS
2. `sites/[brand]/site.json` — brand, theme, locale, nav, footer config
3. SharePoint/Google Drive content mount in `fstab.yaml`
4. No changes to shared blocks.
