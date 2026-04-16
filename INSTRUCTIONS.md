# Project Instructions

## Platform Goal

This is a multi-site EDS platform. A single codebase hosts multiple brand websites.
New brand sites are added by creating a site config and token entry point — no changes
to shared blocks are ever required.

## Repository Structure

- `blocks/` — shared blocks used by all sites. Never put brand-specific logic here.
- `sites/[site-name]/` — site-specific overrides (blocks, styles, site.json)
- `tokens/` — brand token CSS entry points + spacing/typography bridge files
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
## Block Authoring

Each block has three files:
- `[block].js` — adds phx-* class names to EDS DOM, enables phx component CSS to apply
- `[block].scss` — SCSS source: `@forward` phx component CSS + EDS extensions
- `[block].css` — compiled output (committed, EDS serves this at runtime)

For components with a phx equivalent (accordion, card, tabs, button):
1. JS maps EDS DOM structure → phx-* class names
2. SCSS forwards phx component CSS unchanged, adds site-specific rules on top

For layout/custom blocks without a phx equivalent:
- SCSS uses CSS custom properties directly: `var(--component-*)`, `var(--color-*)`
- Use phx typography mixins: `@use "@novonordiskit/phx-style-system/mixins/mix-typography"`

Never run webpack in production without committing the compiled .css — EDS has no build step at serve time.
