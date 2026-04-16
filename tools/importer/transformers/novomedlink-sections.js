/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: novomedlink sections.
 * Adds section breaks and section-metadata blocks from template sections.
 * Runs in afterTransform only.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
