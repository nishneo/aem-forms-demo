/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: novomedlink cleanup.
 * Selectors from captured DOM of novomedlink.com/semaglutide pages.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '[id*="CybotCookiebot"]',
    ]);
  }

  if (hookName === H.after) {
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.header.slab',
      '.semaglutide-sticky-header',
      '.therapeutic-areas__popup',
      'footer',
      '.footer-content',
      '.isi',
      '[class*="isi"]',
      '.cart__overlay',
      '.account__actions',
      '.search-modal',
      'noscript',
      'link',
      'iframe',
      '.cmp-experiencefragment--semaglutide_common_isi',
    ]);

    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
    });
  }
}
