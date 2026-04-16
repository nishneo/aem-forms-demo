/* eslint-disable */
/* global WebImporter */

import heroSafetyParser from './parsers/hero-safety.js';
import columnsContentParser from './parsers/columns-content.js';
import cardsResourceParser from './parsers/cards-resource.js';

import cleanupTransformer from './transformers/novomedlink-cleanup.js';
import sectionsTransformer from './transformers/novomedlink-sections.js';

const PAGE_TEMPLATE = {
  name: 'semaglutide-content-page',
  description: 'Semaglutide informational content page with hero banner, text sections, and resource links about patient safety topics',
  urls: [
    'https://www.novomedlink.com/semaglutide/patient-safety.html',
  ],
  blocks: [
    { name: 'hero-safety', instances: ['.random-background'] },
    {
      name: 'columns-content',
      instances: [
        '.bracket-slab-offset .cmp-container.flex',
        '.bracket-article-description-left',
        '.bracket-video-description-right',
        '.bracket-video-description-left',
        '.bracket-article-description-right',
      ],
    },
    { name: 'cards-resource', instances: ['.semag-news-resource .resource'] },
  ],
  sections: [
    { id: 'section-1', name: 'Alert Banner', selector: '.cmp-experiencefragment--banner', style: 'light-gray', blocks: [], defaultContent: ['.cmp-experiencefragment--banner .cmp-image__image', '.cmp-experiencefragment--banner .cmp-text'] },
    { id: 'section-2', name: 'Hero', selector: '.random-background', style: null, blocks: ['hero-safety'], defaultContent: [] },
    { id: 'section-3', name: 'Our Promise', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_1161268920', style: null, blocks: ['columns-content'], defaultContent: [] },
    { id: 'section-4', name: 'Warning', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_996920350', style: null, blocks: ['columns-content'], defaultContent: [] },
    { id: 'section-5', name: 'Video PSA', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy_', style: null, blocks: ['columns-content'], defaultContent: [] },
    { id: 'section-6', name: 'Article', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__841141511', style: null, blocks: ['columns-content'], defaultContent: [] },
    { id: 'section-7', name: 'Video Dangers', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__501416395', style: null, blocks: ['columns-content'], defaultContent: [] },
    { id: 'section-8', name: 'Read Our Perspectives', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__2087236365', style: 'light-blue', blocks: ['cards-resource'], defaultContent: ['.bracket-article-description-right h2'] },
    { id: 'section-9', name: 'News Resources', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700', style: null, blocks: ['cards-resource'], defaultContent: [] },
    { id: 'section-10', name: 'CTA Banner', selector: '#node-content-novomedlink-en-semaglutide-patient-safety-jcr_content-root-slab_770053700_copy__1157007228', style: 'navy-blue', blocks: [], defaultContent: ['h2', 'a.button'] },
  ],
};

const parsers = {
  'hero-safety': heroSafetyParser,
  'columns-content': columnsContentParser,
  'cards-resource': cardsResourceParser,
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
