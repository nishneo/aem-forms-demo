/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-safety. Base: hero.
 * Source: novomedlink.com/semaglutide/patient-safety.html
 * xwalk fields: image (reference), imageAlt (collapsed), text (richtext)
 * Block library: 1 col, row 1 = bg image, row 2 = text content
 */
export default function parse(element, { document }) {
  const bgImg = element.querySelector('.background img, img[class*="hero-bg"]');
  const heading = element.querySelector('h1, h2, [class*="headline"]');
  const bodyTexts = element.querySelectorAll('.cmp-text p');
  const ctaLink = element.querySelector('.nni-hcp--button a, a[class*="button"]');

  const cells = [];

  // Row 1: image
  if (bgImg) {
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

  // Row 2: text
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
