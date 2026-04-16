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
      // Cart/search/external-site overlays that leak through
      '.cart',
      '[class*="cart__"]',
      '[class*="search-modal"]',
      '[class*="quick-link"]',
      '[class*="external-site"]',
      '[class*="leaving-site"]',
      '[class*="dmd-"]',
      '[class*="novo-core"]',
      // Input elements (search fields etc. become <p> text in scrape)
      'input[type="text"]',
      'input[type="search"]',
      'input:not([type])',
      // Links to # (modal triggers)
      'a[href="#"]',
      // Tracking pixels
      'img[src*="bat.bing"]',
      'img[src*="analytics"]',
      'img[src*="pixel"]',
      // Video player controls (not authorable)
      '.cmp-video__controls',
      '.cmp-video__overlay',
      '.cmp-video__close',
      '.cmp-video__progress-bar',
      // Spacer elements
      '.spacer',
      // Scroll anchors
      '.scroll-anchor',
    ]);

    // Remove leftover modal/overlay text patterns by content
    element.querySelectorAll('p, a, div').forEach((el) => {
      const text = el.textContent.trim();
      if (text === 'Continue' || text.includes('Return to Site') || text === 'Return to Previous Page'
        || text === 'Back' || text.startsWith('Search novoMEDLINK')
        || text.includes('Access Resources') || text === 'Close Cart'
        || text.startsWith('Continue Return') || text.startsWith('Back Access')
        || text.startsWith('Search novo') || text.startsWith('Quick links')) {
        el.remove();
      }
    });

    // Remove close/cart icons that leaked through
    element.querySelectorAll('img[alt="Close Cart"], img[src*="close."]').forEach((el) => el.remove());

    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
    });
  }
}
