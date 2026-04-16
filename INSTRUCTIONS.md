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
