/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-safety. Base: hero.
 * Source: novomedlink.com/semaglutide/patient-safety.html
 * xwalk fields: image (reference), imageAlt (collapsed), text (richtext)
 * Block library: 1 col, row 1 = bg image, row 2 = text content
 *
 * Source DOM: .random-background contains:
 *   .slab-content > .content (text/CTA content)
 *   .background > img (background image as sibling of .slab-content)
 */
export default function parse(element, { document }) {
  // Background image is in .background > img (sibling of .slab-content)
  const bgImg = element.querySelector('.background img');

  // Main heading - look inside .slab-content for h1 with headline class
  const heading = element.querySelector('.slab-content h1, .slab-content h2');

  // Body text - from .cmp-text paragraphs inside slab-content
  const bodyTexts = element.querySelectorAll('.slab-content .cmp-text p');

  // CTA button - the styled button inside slab-content
  const ctaLink = element.querySelector('.slab-content .nni-hcp--button a');

  // Only create block if there's meaningful content (heading or body text)
  if (!heading && bodyTexts.length === 0) {
    // This is an empty/minimal random-background element, skip it
    element.replaceWith(document.createTextNode(''));
    return;
  }

  const cells = [];

  // Row 1: image
  if (bgImg && bgImg.src) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = bgImg.src;
    img.alt = bgImg.alt || '';
    pic.appendChild(img);
    imgFrag.appendChild(pic);
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: text (heading + body + CTA)
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h = document.createElement('h1');
    h.innerHTML = heading.innerHTML;
    textFrag.appendChild(h);
  }

  bodyTexts.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    textFrag.appendChild(para);
  });

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    const btnText = ctaLink.querySelector('.button-text');
    a.textContent = btnText ? btnText.textContent : ctaLink.textContent;
    p.appendChild(a);
    textFrag.appendChild(p);
  }

  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-safety', cells });
  element.replaceWith(block);
}
